-- ===========================================
-- Audit Logging System for Account Changes
-- ===========================================

-- Create account_audit table
CREATE TABLE IF NOT EXISTS public.account_audit (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  old_account account_type,
  new_account account_type NOT NULL,
  changed_by TEXT NOT NULL,            -- admin email or request id
  changed_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  request_id TEXT,
  user_agent TEXT
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_account_audit_user_id ON public.account_audit(user_id);
CREATE INDEX IF NOT EXISTS idx_account_audit_changed_at ON public.account_audit(changed_at);
CREATE INDEX IF NOT EXISTS idx_account_audit_changed_by ON public.account_audit(changed_by);

-- Function to log account changes
CREATE OR REPLACE FUNCTION log_account_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only log if account actually changed
  IF NEW.account IS DISTINCT FROM OLD.account THEN
    INSERT INTO public.account_audit (
      user_id,
      old_account,
      new_account,
      changed_by,
      ip_address,
      request_id,
      user_agent
    ) VALUES (
      NEW.user_id,
      OLD.account,
      NEW.account,
      COALESCE(
        current_setting('request.jwt.claim.sub', true),
        current_setting('request.jwt.claim.email', true),
        'system'
      ),
      inet_client_addr(),
      current_setting('request.id', true),
      current_setting('request.user_agent', true)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS trg_log_account_change ON public.profiles;

-- Create trigger for account changes
CREATE TRIGGER trg_log_account_change
  AFTER UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION log_account_change();

-- RLS policies for audit table
ALTER TABLE public.account_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs" ON public.account_audit
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND account = 'admin'
    )
  );

-- Only service role can insert audit logs
CREATE POLICY "Service role can insert audit logs" ON public.account_audit
  FOR INSERT WITH CHECK (true);

-- Create notifications table if not exists
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ
);

-- Index for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (user_id = auth.uid());

-- Users can update their own notifications
CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Service role can insert notifications
CREATE POLICY "Service role can insert notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

-- Create user_devices table for FCM tokens
CREATE TABLE IF NOT EXISTS public.user_devices (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  device_token TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('web', 'android', 'ios')),
  is_active BOOLEAN DEFAULT TRUE,
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user_devices
CREATE INDEX IF NOT EXISTS idx_user_devices_user_id ON public.user_devices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_devices_token ON public.user_devices(device_token);

-- RLS for user_devices
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- Users can manage their own devices
CREATE POLICY "Users can manage own devices" ON public.user_devices
  FOR ALL USING (user_id = auth.uid());

-- Service role can insert/update devices
CREATE POLICY "Service role can manage devices" ON public.user_devices
  FOR ALL WITH CHECK (true);

-- Function to clean up old audit logs (keep last 90 days)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.account_audit
  WHERE changed_at < NOW() - INTERVAL '90 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to clean up old notifications (keep last 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_notifications()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.notifications
  WHERE created_at < NOW() - INTERVAL '30 days'
  AND is_read = TRUE;

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

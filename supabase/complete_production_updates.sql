-- ===========================================
-- Complete Production Updates for LUXBYTE
-- Apply all security and monitoring enhancements
-- ===========================================

-- 0. Create documents table for file uploads
CREATE TABLE IF NOT EXISTS public.documents (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL,
    file_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    file_name TEXT,
    file_size BIGINT,
    mime_type TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON public.documents(document_type);
CREATE INDEX IF NOT EXISTS idx_documents_uploaded_at ON public.documents(uploaded_at);

-- Enable RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for documents
CREATE POLICY "Users can view their own documents" ON public.documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON public.documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON public.documents
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documents" ON public.documents
    FOR DELETE USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp for documents
CREATE OR REPLACE FUNCTION update_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_documents_updated_at
    BEFORE UPDATE ON public.documents
    FOR EACH ROW
    EXECUTE FUNCTION update_documents_updated_at();

-- Create storage bucket for documents if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc_docs', 'kyc_docs', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies for kyc_docs bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'kyc_docs' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'kyc_docs' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can update their own documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'kyc_docs' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Users can delete their own documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'kyc_docs' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

-- Grant necessary permissions for documents
GRANT ALL ON public.documents TO authenticated;
GRANT USAGE ON SEQUENCE public.documents_id_seq TO authenticated;

-- 1. Create account_audit table
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

-- Create indexes for better performance
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

-- 2. Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  data JSONB
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

-- 3. Create user_devices table for FCM tokens
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

-- 4. Create error_logs table
CREATE TABLE IF NOT EXISTS public.error_logs (
  id BIGSERIAL PRIMARY KEY,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  session_id TEXT,
  level TEXT NOT NULL CHECK (level IN ('debug', 'info', 'warn', 'error')),
  message TEXT NOT NULL,
  data JSONB,
  url TEXT,
  user_agent TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_error_logs_timestamp ON public.error_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_error_logs_level ON public.error_logs(level);
CREATE INDEX IF NOT EXISTS idx_error_logs_user_id ON public.error_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_error_logs_session_id ON public.error_logs(session_id);

-- RLS policies for error_logs
ALTER TABLE public.error_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view error logs
CREATE POLICY "Admins can view error logs" ON public.error_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND account = 'admin'
    )
  );

-- Service role can insert error logs
CREATE POLICY "Service role can insert error logs" ON public.error_logs
  FOR INSERT WITH CHECK (true);

-- 5. Create system_health table for monitoring
CREATE TABLE IF NOT EXISTS public.system_health (
  id BIGSERIAL PRIMARY KEY,
  check_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('healthy', 'warning', 'error')),
  message TEXT,
  data JSONB,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for system_health
CREATE INDEX IF NOT EXISTS idx_system_health_checked_at ON public.system_health(checked_at);
CREATE INDEX IF NOT EXISTS idx_system_health_status ON public.system_health(status);

-- RLS for system_health
ALTER TABLE public.system_health ENABLE ROW LEVEL SECURITY;

-- Only admins can view system health
CREATE POLICY "Admins can view system health" ON public.system_health
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE user_id = auth.uid()
      AND account = 'admin'
    )
  );

-- Service role can insert system health data
CREATE POLICY "Service role can insert system health" ON public.system_health
  FOR INSERT WITH CHECK (true);

-- 6. Cleanup functions
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

CREATE OR REPLACE FUNCTION cleanup_old_error_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.error_logs
  WHERE created_at < NOW() - INTERVAL '30 days';

  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Statistics functions
CREATE OR REPLACE FUNCTION get_error_statistics(days INTEGER DEFAULT 7)
RETURNS TABLE (
  total_errors BIGINT,
  errors_by_level JSONB,
  errors_by_hour JSONB,
  top_errors JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*) as total_errors,
    jsonb_object_agg(level, level_count) as errors_by_level,
    jsonb_object_agg(hour, hour_count) as errors_by_hour,
    jsonb_object_agg(message, message_count) as top_errors
  FROM (
    SELECT
      level,
      COUNT(*) as level_count,
      EXTRACT(hour FROM timestamp) as hour,
      COUNT(*) as hour_count,
      message,
      COUNT(*) as message_count
    FROM public.error_logs
    WHERE created_at >= NOW() - (days || ' days')::INTERVAL
    GROUP BY level, EXTRACT(hour FROM timestamp), message
  ) stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Health check function
CREATE OR REPLACE FUNCTION record_health_check(
  check_name TEXT,
  status TEXT,
  message TEXT DEFAULT NULL,
  data JSONB DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO public.system_health (check_name, status, message, data)
  VALUES (check_name, status, message, data);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;

-- 10. Create a view for admin dashboard
CREATE OR REPLACE VIEW admin_dashboard_stats AS
SELECT
  (SELECT COUNT(*) FROM public.profiles) as total_users,
  (SELECT COUNT(*) FROM public.profiles WHERE account = 'pharmacy') as pharmacy_users,
  (SELECT COUNT(*) FROM public.profiles WHERE account = 'supermarket') as supermarket_users,
  (SELECT COUNT(*) FROM public.profiles WHERE account = 'restaurant') as restaurant_users,
  (SELECT COUNT(*) FROM public.profiles WHERE account = 'clinic') as clinic_users,
  (SELECT COUNT(*) FROM public.profiles WHERE account = 'courier') as courier_users,
  (SELECT COUNT(*) FROM public.profiles WHERE account = 'driver') as driver_users,
  (SELECT COUNT(*) FROM public.account_audit WHERE changed_at >= NOW() - INTERVAL '24 hours') as recent_account_changes,
  (SELECT COUNT(*) FROM public.error_logs WHERE created_at >= NOW() - INTERVAL '24 hours') as recent_errors,
  (SELECT COUNT(*) FROM public.notifications WHERE created_at >= NOW() - INTERVAL '24 hours') as recent_notifications;

-- Grant access to admin dashboard view
GRANT SELECT ON admin_dashboard_stats TO authenticated;

-- 11. Insert initial system health check
INSERT INTO public.system_health (check_name, status, message, data)
VALUES ('database_migration', 'healthy', 'Production updates applied successfully',
        jsonb_build_object('version', '1.0.0', 'timestamp', NOW()));

COMMIT;

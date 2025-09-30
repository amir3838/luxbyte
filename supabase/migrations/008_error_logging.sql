-- ===========================================
-- Error Logging System
-- ===========================================

-- Create error_logs table
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

-- Function to clean up old error logs (keep last 30 days)
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

-- Function to get error statistics
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

-- Create system_health table for monitoring
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

-- Function to record system health check
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

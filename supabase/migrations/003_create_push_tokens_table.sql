-- إنشاء جدول توكنات الإشعارات لمشروع Luxbyte
-- تاريخ الإنشاء: 2025-01-28

-- جدول توكنات الإشعارات
CREATE TABLE IF NOT EXISTS public.push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  platform TEXT CHECK (platform IN ('web','android','ios')) DEFAULT 'web',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_push_tokens_user ON public.push_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_push_tokens_platform ON public.push_tokens(platform);

-- تفعيل Row Level Security
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

-- سياسات الأمان
-- القراءة: المالك فقط
CREATE POLICY "read own tokens" ON public.push_tokens
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- الكتابة: المالك فقط
CREATE POLICY "write own tokens" ON public.push_tokens
FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- التحديث: المالك فقط
CREATE POLICY "update own tokens" ON public.push_tokens
FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- الحذف: المالك فقط
CREATE POLICY "delete own tokens" ON public.push_tokens
FOR DELETE TO authenticated
USING (auth.uid() = user_id);

-- سياسة للمديرين - يمكنهم رؤية جميع التوكنات
CREATE POLICY "admins can view all tokens" ON public.push_tokens
FOR ALL TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_push_tokens_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- تطبيق الدالة على الجدول
CREATE TRIGGER update_push_tokens_updated_at
BEFORE UPDATE ON public.push_tokens
FOR EACH ROW EXECUTE FUNCTION update_push_tokens_updated_at();

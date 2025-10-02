# LUXBYTE Security Guidelines
# إرشادات الأمان لـ LUXBYTE

## Environment Variables Setup
## إعداد متغيرات البيئة

### Required Environment Variables
### متغيرات البيئة المطلوبة

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### Setting up Environment Variables
### إعداد متغيرات البيئة

1. **For Vercel Deployment:**
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add DATABASE_URL
   ```

2. **For Local Development:**
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

## Security Best Practices
## أفضل ممارسات الأمان

### 1. Never Commit Secrets
### 1. لا تلتزم بالأسرار أبداً

- ✅ **DO:** Use environment variables for all secrets
- ❌ **DON'T:** Hardcode API keys, passwords, or tokens in code
- ❌ **DON'T:** Commit `.env` files or files with real credentials

### 2. Use Public Keys Only in Frontend
### 2. استخدم المفاتيح العامة فقط في الواجهة الأمامية

- ✅ **DO:** Use Supabase anon key in frontend (it's designed to be public)
- ✅ **DO:** Use Firebase web config in frontend (it's designed to be public)
- ❌ **DON'T:** Use service role keys in frontend code
- ❌ **DON'T:** Use admin keys in frontend code

### 3. Secure Backend APIs
### 3. تأمين واجهات برمجة التطبيقات الخلفية

- ✅ **DO:** Use service role keys only in server-side code
- ✅ **DO:** Implement proper authentication and authorization
- ✅ **DO:** Use Row Level Security (RLS) in Supabase
- ❌ **DON'T:** Expose sensitive operations to unauthenticated users

### 4. Regular Security Audits
### 4. عمليات تدقيق الأمان المنتظمة

Run security scans before committing:
```bash
npm run scan:secrets
npm run scan:greps
```

## File Structure Security
## أمان هيكل الملفات

### Safe Files (Public)
### الملفات الآمنة (عامة)

- `public/js/common.js` - Contains only public Supabase anon key
- `public/config.js` - Contains only public Firebase config
- `public/firebase-app.js` - Contains only public Firebase config

### Restricted Files (Server-side only)
### الملفات المقيدة (خادم فقط)

- `api/*.js` - Server-side API endpoints
- `.env` - Environment variables (never committed)
- `scripts/*.js` - Build and deployment scripts

## Incident Response
## الاستجابة للحوادث

If you discover a security issue:

1. **Immediately rotate compromised keys**
2. **Remove sensitive data from git history**
3. **Update all affected services**
4. **Notify the development team**

## Contact
## التواصل

For security concerns, contact: security@luxbyte.com

---

**Remember:** Security is everyone's responsibility!
**تذكر:** الأمان مسؤولية الجميع!

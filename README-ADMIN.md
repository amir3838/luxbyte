# لوحة إدارة LUXBYTE

## 🎯 الميزات

### 1. **إدارة المستخدمين**
- عرض قائمة المستخدمين مع التفاصيل
- إحصائيات أنواع الحسابات
- تصفح الصفحات (Pagination)

### 2. **تغيير نوع الحساب**
- تغيير نوع حساب أي مستخدم
- إشعارات تلقائية للمستخدم
- سجل التغييرات

### 3. **API Endpoints**

#### `POST /api/change-account-type`
تغيير نوع حساب مستخدم
```json
{
  "user_id": "uuid",
  "new_account_type": "pharmacy|supermarket|restaurant|clinic|courier|driver|admin",
  "admin_key": "your_admin_key"
}
```

#### `GET /api/get-user-profile`
الحصول على معلومات مستخدم
```
GET /api/get-user-profile?user_id=uuid&admin_key=your_admin_key
```

#### `GET /api/list-users`
عرض قائمة المستخدمين
```
GET /api/list-users?page=1&limit=10&admin_key=your_admin_key
```

## 🔧 الإعداد

### 1. **متغيرات البيئة في Vercel:**
```bash
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_KEY=your_secure_admin_key
```

### 2. **تثبيت Dependencies:**
```bash
npm install
```

### 3. **تشغيل محلي:**
```bash
npm run dev
```

## 🚀 الاستخدام

### 1. **الوصول للوحة الإدارة:**
- اذهب إلى: `https://your-domain.vercel.app/admin-panel.html`
- أدخل مفتاح الإدارة
- اضغط "الاتصال"

### 2. **تغيير نوع الحساب:**
- ابحث عن المستخدم في الجدول
- اضغط "تغيير النوع"
- اختر النوع الجديد
- اضغط "تأكيد التغيير"

## 🔐 الأمان

- **مفتاح الإدارة:** مطلوب لجميع العمليات
- **Service Role Key:** للوصول المباشر لقاعدة البيانات
- **CORS:** مُعد للسماح بالوصول من أي مصدر

## 📊 الإحصائيات

اللوحة تعرض:
- عدد المستخدمين لكل نوع حساب
- تاريخ إنشاء الحساب
- آخر تسجيل دخول
- المدينة (إن وجدت)

## 🛠️ التطوير

### إضافة أنواع حسابات جديدة:
1. حدث `enum account_type` في Supabase
2. حدث `validAccountTypes` في `api/change-account-type.js`
3. حدث `accountTypes` في `admin-panel.html`

### إضافة حقول جديدة:
1. حدث جدول `profiles` في Supabase
2. حدث API endpoints
3. حدث واجهة الإدارة

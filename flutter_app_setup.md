# دليل إنشاء تطبيق Flutter لـ LUXBYTE

## 📱 إنشاء تطبيق Flutter جديد

### 1. إعداد المشروع
```bash
# إنشاء مشروع Flutter جديد
flutter create luxbyte_mobile
cd luxbyte_mobile

# إضافة الحزم المطلوبة
flutter pub add image_picker:^1.1.2
flutter pub add permission_handler:^11.3.1
flutter pub add supabase_flutter:^2.0.0
```

### 2. إعداد Android Manifest
```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-feature android:name="android.hardware.camera.any" android:required="false" />

    <application
        android:label="LUXBYTE"
        android:name="${applicationName}"
        android:icon="@mipmap/ic_launcher">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:theme="@style/LaunchTheme"
            android:configChanges="orientation|keyboardHidden|keyboard|screenSize|smallestScreenSize|locale|layoutDirection|fontScale|screenLayout|density|uiMode"
            android:hardwareAccelerated="true"
            android:windowSoftInputMode="adjustResize">
            <meta-data
              android:name="io.flutter.embedding.android.NormalTheme"
              android:resource="@style/NormalTheme"
              />
            <intent-filter android:autoVerify="true">
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data android:scheme="https" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.MAIN"/>
                <category android:name="android.intent.category.LAUNCHER"/>
            </intent-filter>
        </activity>
        <meta-data
            android:name="flutterEmbedding"
            android:value="2" />
    </application>
</manifest>
```

### 3. إنشاء Document Capture Widget
```dart
// lib/widgets/document_capture_button.dart
import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:permission_handler/permission_handler.dart';

class DocumentCaptureButton extends StatefulWidget {
  final void Function(File file) onCaptured;
  final String label;
  final bool required;

  const DocumentCaptureButton({
    super.key,
    required this.onCaptured,
    required this.label,
    this.required = false,
  });

  @override
  State<DocumentCaptureButton> createState() => _DocumentCaptureButtonState();
}

class _DocumentCaptureButtonState extends State<DocumentCaptureButton> {
  bool _busy = false;
  File? _capturedFile;

  Future<void> _capture() async {
    if (_busy) return;
    setState(() => _busy = true);

    try {
      // 1) تحقّق/اطلب صلاحية الكاميرا
      final status = await Permission.camera.status;
      if (status.isDenied || status.isRestricted) {
        final req = await Permission.camera.request();
        if (!req.isGranted) {
          if (req.isPermanentlyDenied) {
            await _showPermissionDialog();
          }
          return;
        }
      } else if (status.isPermanentlyDenied) {
        await _showPermissionDialog();
        return;
      }

      // 2) افتح الكاميرا مباشرة بعد منح الإذن
      final picker = ImagePicker();
      final XFile? shot = await picker.pickImage(
        source: ImageSource.camera,
        preferredCameraDevice: CameraDevice.rear,
        imageQuality: 85,
        maxWidth: 1280,
        maxHeight: 720,
      );

      if (shot != null) {
        final file = File(shot.path);
        setState(() => _capturedFile = file);
        widget.onCaptured(file);

        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('تم تصوير ${widget.label} بنجاح'),
              backgroundColor: Colors.green,
            ),
          );
        }
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('تم إلغاء التقاط الصورة')),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('تعذر فتح الكاميرا: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _busy = false);
    }
  }

  Future<void> _showPermissionDialog() async {
    return showDialog<void>(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('إذن الكاميرا مطلوب'),
          content: const Text('يرجى السماح بالوصول للكاميرا من إعدادات التطبيق'),
          actions: <Widget>[
            TextButton(
              child: const Text('إلغاء'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
            TextButton(
              child: const Text('فتح الإعدادات'),
              onPressed: () {
                Navigator.of(context).pop();
                openAppSettings();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            if (_capturedFile != null) ...[
              Container(
                height: 200,
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  border: Border.all(color: Colors.green, width: 2),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: Image.file(
                    _capturedFile!,
                    fit: BoxFit.cover,
                  ),
                ),
              ),
              const SizedBox(height: 8),
              Text(
                '✓ تم التقاط الصورة بنجاح',
                style: TextStyle(
                  color: Colors.green,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
            ],
            ElevatedButton.icon(
              onPressed: _busy ? null : _capture,
              icon: _busy
                ? const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(strokeWidth: 2),
                  )
                : const Icon(Icons.camera_alt),
              label: Text(_busy ? 'جارٍ الفتح...' : 'تصوير ${widget.label}'),
              style: ElevatedButton.styleFrom(
                backgroundColor: _capturedFile != null ? Colors.green : null,
                foregroundColor: _capturedFile != null ? Colors.white : null,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              ),
            ),
            if (widget.required)
              const Padding(
                padding: EdgeInsets.only(top: 4),
                child: Text(
                  '* مطلوب',
                  style: TextStyle(color: Colors.red, fontSize: 12),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
```

### 4. شاشة التسجيل الرئيسية
```dart
// lib/screens/signup_screen.dart
import 'dart:io';
import 'package:flutter/material.dart';
import '../widgets/document_capture_button.dart';

class SignupScreen extends StatefulWidget {
  const SignupScreen({super.key});

  @override
  State<SignupScreen> createState() => _SignupScreenState();
}

class _SignupScreenState extends State<SignupScreen> {
  final Map<String, File> _uploadedFiles = {};
  String _selectedRole = 'restaurant';

  final Map<String, List<Map<String, dynamic>>> _requiredDocuments = {
    'restaurant': [
      {'key': 'commercial_register', 'label': 'السجل التجاري', 'required': true},
      {'key': 'tax_card', 'label': 'البطاقة الضريبية', 'required': true},
      {'key': 'location_contract', 'label': 'عقد مقر موثق', 'required': true},
      {'key': 'food_license', 'label': 'رخصة تشغيل مأكولات', 'required': true},
      {'key': 'health_certificate', 'label': 'شهادة صحية', 'required': true},
    ],
    'supermarket': [
      {'key': 'commercial_register', 'label': 'السجل التجاري', 'required': true},
      {'key': 'tax_card', 'label': 'البطاقة الضريبية', 'required': true},
      {'key': 'commercial_license', 'label': 'رخصة تجارية', 'required': true},
    ],
    'pharmacy': [
      {'key': 'pharmacy_license', 'label': 'رخصة الصيدلية', 'required': true},
      {'key': 'pharmacist_certificate', 'label': 'شهادة الصيدلي', 'required': true},
    ],
    'clinic': [
      {'key': 'clinic_license', 'label': 'رخصة العيادة', 'required': true},
      {'key': 'doctor_certificate', 'label': 'شهادة الطبيب', 'required': true},
    ],
    'courier': [
      {'key': 'national_id', 'label': 'الهوية الوطنية', 'required': true},
      {'key': 'driving_license', 'label': 'رخصة القيادة', 'required': true},
    ],
    'driver': [
      {'key': 'national_id', 'label': 'الهوية الوطنية', 'required': true},
      {'key': 'driving_license', 'label': 'رخصة القيادة', 'required': true},
      {'key': 'commercial_register', 'label': 'السجل التجاري', 'required': true},
    ],
  };

  @override
  Widget build(BuildContext context) {
    final documents = _requiredDocuments[_selectedRole] ?? [];

    return Scaffold(
      appBar: AppBar(
        title: const Text('تسجيل البيانات - LUXBYTE'),
        backgroundColor: const Color(0xFF6b7cff),
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // اختيار نوع النشاط
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'نوع النشاط',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    DropdownButtonFormField<String>(
                      value: _selectedRole,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                        labelText: 'اختر نوع النشاط',
                      ),
                      items: const [
                        DropdownMenuItem(value: 'restaurant', child: Text('مطعم')),
                        DropdownMenuItem(value: 'supermarket', child: Text('سوبر ماركت')),
                        DropdownMenuItem(value: 'pharmacy', child: Text('صيدلية')),
                        DropdownMenuItem(value: 'clinic', child: Text('عيادة')),
                        DropdownMenuItem(value: 'courier', child: Text('مندوب توصيل')),
                        DropdownMenuItem(value: 'driver', child: Text('سائق')),
                      ],
                      onChanged: (value) {
                        setState(() {
                          _selectedRole = value!;
                          _uploadedFiles.clear(); // مسح الملفات المحملة
                        });
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // أزرار تصوير المستندات
            const Text(
              'تصوير المستندات المطلوبة',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),

            ...documents.map((doc) => Padding(
              padding: const EdgeInsets.only(bottom: 16),
              child: DocumentCaptureButton(
                label: doc['label'],
                required: doc['required'],
                onCaptured: (file) {
                  setState(() {
                    _uploadedFiles[doc['key']] = file;
                  });
                },
              ),
            )),

            const SizedBox(height: 24),

            // زر الإرسال
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: _canSubmit() ? _submitForm : null,
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF6b7cff),
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
                child: const Text(
                  'إرسال الطلب',
                  style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  bool _canSubmit() {
    final documents = _requiredDocuments[_selectedRole] ?? [];
    final requiredDocs = documents.where((doc) => doc['required'] == true).toList();

    for (final doc in requiredDocs) {
      if (!_uploadedFiles.containsKey(doc['key'])) {
        return false;
      }
    }
    return true;
  }

  void _submitForm() {
    if (_canSubmit()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('تم إرسال الطلب بنجاح'),
          backgroundColor: Colors.green,
        ),
      );
      // هنا يمكنك إضافة منطق الإرسال إلى الخادم
    }
  }
}
```

### 5. تشغيل التطبيق
```bash
# تنظيف المشروع
flutter clean

# تثبيت الحزم
flutter pub get

# تشغيل التطبيق
flutter run -v
```

## 🔧 استكشاف الأخطاء

### إذا لم تفتح الكاميرا:
1. تأكد من منح الأذونات في إعدادات الهاتف
2. تحقق من السجلات:
   ```bash
   adb logcat | findstr flutter
   ```
3. تأكد من أن الهاتف يدعم الكاميرا
4. جرب إعادة تشغيل التطبيق

### إذا حدث كراش:
1. تحقق من إصدارات الحزم
2. تأكد من إعدادات Android Manifest
3. شغّل `flutter clean` ثم `flutter pub get`

## 📱 النتيجة المتوقعة

عند الضغط على "تصوير المستند":
1. ✅ يطلب إذن الكاميرا (مرة واحدة فقط)
2. ✅ تفتح الكاميرا فوراً بعد الموافقة
3. ✅ تظهر معاينة الصورة بعد التقاطها
4. ✅ رسالة نجاح واضحة
5. ✅ في حالة الرفض الدائم: يفتح إعدادات التطبيق

هل تريد مني إنشاء هذا التطبيق Flutter أم تفضل استخدام التطبيق الويب الحالي المحسن؟

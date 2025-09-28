# lib/features/auth/forgot_password_screen.dart

```dart
// lib/features/auth/forgot_password_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/custom_button.dart';
import '../../shared/widgets/custom_email_field.dart';
import '../../shared/widgets/loading_overlay.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  bool _isEmailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  Future<void> _resetPassword() async {
    if (!_formKey.currentState!.validate()) return;

    final authProvider = context.read<AuthProvider>();
    
    try {
      final success = await authProvider.resetPassword(_emailController.text.trim());
      
      if (success && mounted) {
        setState(() {
          _isEmailSent = true;
        });
      } else if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(authProvider.error ?? 'فشل في إرسال رابط الاستعادة'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('حدث خطأ: $e'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
      }
    }
  }

  void _goBack() {
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'استعادة كلمة المرور',
          style: TextStyle(
            fontFamily: 'Cairo',
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          onPressed: _goBack,
          icon: const Icon(Icons.arrow_back_ios),
        ),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          return LoadingOverlay(
            isLoading: authProvider.isLoading,
            child: SingleChildScrollView(
              padding: EdgeInsets.all(24.w),
              child: Form(
                key: _formKey,
                child: Column(
                  children: [
                    SizedBox(height: 40.h),

                    // Icon
                    Container(
                      width: 80.w,
                      height: 80.w,
                      decoration: BoxDecoration(
                        color: _isEmailSent ? AppTheme.successColor.withOpacity(0.1) : AppTheme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(40.r),
                      ),
                      child: Icon(
                        _isEmailSent ? Icons.mark_email_read : Icons.lock_reset,
                        size: 40.w,
                        color: _isEmailSent ? AppTheme.successColor : AppTheme.primaryColor,
                      ),
                    ),

                    SizedBox(height: 30.h),

                    if (!_isEmailSent) ...[
                      // Title
                      Text(
                        'نسيت كلمة المرور؟',
                        style: TextStyle(
                          fontSize: 24.sp,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textPrimary,
                          fontFamily: 'Cairo',
                        ),
                      ),

                      SizedBox(height: 12.h),

                      // Description
                      Text(
                        'أدخل بريدك الإلكتروني وسنرسل لك رابط لاستعادة كلمة المرور',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16.sp,
                          color: AppTheme.textSecondary,
                          fontFamily: 'Cairo',
                        ),
                      ),

                      SizedBox(height: 40.h),

                      // Email Field
                      CustomEmailField(
                        controller: _emailController,
                        label: 'البريد الإلكتروني',
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يرجى إدخال البريد الإلكتروني';
                          }
                          if (!value.contains('@')) {
                            return 'يرجى إدخال بريد إلكتروني صحيح';
                          }
                          return null;
                        },
                      ),

                      SizedBox(height: 30.h),

                      // Reset Button
                      CustomButton(
                        text: 'إرسال رابط الاستعادة',
                        onPressed: _resetPassword,
                        isLoading: authProvider.isLoading,
                      ),
                    ] else ...[
                      // Success State
                      Text(
                        'تم إرسال الرابط!',
                        style: TextStyle(
                          fontSize: 24.sp,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.successColor,
                          fontFamily: 'Cairo',
                        ),
                      ),

                      SizedBox(height: 12.h),

                      Text(
                        'تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني. تحقق من صندوق الوارد أو البريد المزعج.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 16.sp,
                          color: AppTheme.textSecondary,
                          fontFamily: 'Cairo',
                        ),
                      ),

                      SizedBox(height: 40.h),

                      // Back to Login Button
                      CustomButton(
                        text: 'العودة لتسجيل الدخول',
                        onPressed: () => context.go('/login'),
                      ),

                      SizedBox(height: 20.h),

                      // Resend Button
                      TextButton(
                        onPressed: () {
                          setState(() {
                            _isEmailSent = false;
                          });
                        },
                        child: Text(
                          'إرسال مرة أخرى',
                          style: TextStyle(
                            color: AppTheme.primaryColor,
                            fontSize: 16.sp,
                            fontFamily: 'Cairo',
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
```

# lib/features/signup/registration_form_screen.dart

```dart
// lib/features/signup/registration_form_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/activities.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/custom_button.dart';
import '../../shared/widgets/custom_email_field.dart';
import '../../shared/widgets/custom_phone_field.dart';
import '../../shared/widgets/custom_text_field.dart';
import '../../shared/widgets/loading_overlay.dart';
import '../../shared/widgets/location_dropdown.dart';
import './providers/signup_provider.dart';
import './providers/location_provider.dart';

class RegistrationFormScreen extends StatefulWidget {
  const RegistrationFormScreen({super.key});

  @override
  State<RegistrationFormScreen> createState() => _RegistrationFormScreenState();
}

class _RegistrationFormScreenState extends State<RegistrationFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _phoneController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _businessNameController = TextEditingController();
  final _businessAddressController = TextEditingController();
  final _businessPhoneController = TextEditingController();

  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _agreeToTerms = false;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<LocationProvider>().initializeLocations();
    });
  }

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _phoneController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    _businessNameController.dispose();
    _businessAddressController.dispose();
    _businessPhoneController.dispose();
    super.dispose();
  }

  bool get _needsBusinessInfo {
    final signupProvider = context.read<SignupProvider>();
    return Activities.isMerchantActivity(signupProvider.selectedActivity ?? '');
  }

  void _continueToDocuments() {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreeToTerms) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('يجب الموافقة على الشروط والأحكام'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    final signupProvider = context.read<SignupProvider>();
    final locationProvider = context.read<LocationProvider>();

    // Save form data
    signupProvider.setName(_nameController.text.trim());
    signupProvider.setEmail(_emailController.text.trim());
    signupProvider.setPhone(_phoneController.text.trim());
    signupProvider.setPassword(_passwordController.text);

    if (_needsBusinessInfo) {
      signupProvider.setBusinessName(_businessNameController.text.trim());
      signupProvider.setBusinessAddress(_businessAddressController.text.trim());
      signupProvider.setBusinessPhone(_businessPhoneController.text.trim());
    }

    // Navigate to document upload
    context.push('/document-upload');
  }

  void _goBack() {
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'بيانات التسجيل',
          style: TextStyle(
            fontFamily: 'Cairo',
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          onPressed: _goBack,
          icon: const Icon(Icons.arrow_back_ios),
        ),
      ),
      body: Consumer2<SignupProvider, LocationProvider>(
        builder: (context, signupProvider, locationProvider, child) {
          final activityData = Activities.activityDetails[signupProvider.selectedActivity];

          return LoadingOverlay(
            isLoading: signupProvider.isLoading,
            child: SingleChildScrollView(
              padding: EdgeInsets.all(24.w),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Activity Header
                    Container(
                      width: double.infinity,
                      padding: EdgeInsets.all(16.w),
                      decoration: BoxDecoration(
                        color: Color(activityData?['color'] ?? AppTheme.primaryColor.value).withOpacity(0.1),
                        borderRadius: BorderRadius.circular(12.r),
                        border: Border.all(
                          color: Color(activityData?['color'] ?? AppTheme.primaryColor.value).withOpacity(0.3),
                        ),
                      ),
                      child: Row(
                        children: [
                          Icon(
                            _getActivityIcon(signupProvider.selectedActivity ?? ''),
                            color: Color(activityData?['color'] ?? AppTheme.primaryColor.value),
                            size: 24.w,
                          ),
                          SizedBox(width: 12.w),
                          Text(
                            activityData?['nameAr'] ?? signupProvider.selectedActivity ?? '',
                            style: TextStyle(
                              fontSize: 16.sp,
                              fontWeight: FontWeight.bold,
                              color: Color(activityData?['color'] ?? AppTheme.primaryColor.value),
                              fontFamily: 'Cairo',
                            ),
                          ),
                        ],
                      ),
                    ),

                    SizedBox(height: 30.h),

                    // Personal Information Section
                    Text(
                      'البيانات الشخصية',
                      style: TextStyle(
                        fontSize: 18.sp,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                        fontFamily: 'Cairo',
                      ),
                    ),

                    SizedBox(height: 16.h),

                    // Name Field
                    CustomTextField(
                      controller: _nameController,
                      label: 'الاسم الكامل',
                      prefixIcon: const Icon(Icons.person_outline),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال الاسم الكامل';
                        }
                        if (value.length < 3) {
                          return 'الاسم يجب أن يكون 3 أحرف على الأقل';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 16.h),

                    // Email Field
                    CustomEmailField(
                      controller: _emailController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال البريد الإلكتروني';
                        }
                        if (!value.contains('@')) {
                          return 'يرجى إدخال بريد إلكتروني صحيح';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 16.h),

                    // Phone Field
                    CustomPhoneField(
                      controller: _phoneController,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال رقم الهاتف';
                        }
                        if (value.length < 11) {
                          return 'رقم الهاتف غير صحيح';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 16.h),

                    // Password Field
                    CustomTextField(
                      controller: _passwordController,
                      label: 'كلمة المرور',
                      obscureText: _obscurePassword,
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                        icon: Icon(
                          _obscurePassword ? Icons.visibility : Icons.visibility_off,
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال كلمة المرور';
                        }
                        if (value.length < 8) {
                          return 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 16.h),

                    // Confirm Password Field
                    CustomTextField(
                      controller: _confirmPasswordController,
                      label: 'تأكيد كلمة المرور',
                      obscureText: _obscureConfirmPassword,
                      prefixIcon: const Icon(Icons.lock_outline),
                      suffixIcon: IconButton(
                        onPressed: () {
                          setState(() {
                            _obscureConfirmPassword = !_obscureConfirmPassword;
                          });
                        },
                        icon: Icon(
                          _obscureConfirmPassword ? Icons.visibility : Icons.visibility_off,
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى تأكيد كلمة المرور';
                        }
                        if (value != _passwordController.text) {
                          return 'كلمة المرور غير متطابقة';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 20.h),

                    // Location Section
                    Text(
                      'العنوان',
                      style: TextStyle(
                        fontSize: 18.sp,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                        fontFamily: 'Cairo',
                      ),
                    ),

                    SizedBox(height: 16.h),

                    // Location Dropdown
                    const LocationDropdown(),

                    if (_needsBusinessInfo) ...[
                      SizedBox(height: 30.h),

                      // Business Information Section
                      Text(
                        'بيانات النشاط التجاري',
                        style: TextStyle(
                          fontSize: 18.sp,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.textPrimary,
                          fontFamily: 'Cairo',
                        ),
                      ),

                      SizedBox(height: 16.h),

                      // Business Name Field
                      CustomTextField(
                        controller: _businessNameController,
                        label: 'اسم النشاط التجاري',
                        prefixIcon: const Icon(Icons.business_outlined),
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يرجى إدخال اسم النشاط التجاري';
                          }
                          return null;
                        },
                      ),

                      SizedBox(height: 16.h),

                      // Business Address Field
                      CustomTextField(
                        controller: _businessAddressController,
                        label: 'عنوان النشاط التجاري',
                        prefixIcon: const Icon(Icons.location_on_outlined),
                        maxLines: 3,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return 'يرجى إدخال عنوان النشاط التجاري';
                          }
                          return null;
                        },
                      ),

                      SizedBox(height: 16.h),

                      // Business Phone Field
                      CustomPhoneField(
                        controller: _businessPhoneController,
                        label: 'هاتف النشاط التجاري',
                      ),
                    ],

                    SizedBox(height: 30.h),

                    // Terms and Conditions
                    Row(
                      children: [
                        Checkbox(
                          value: _agreeToTerms,
                          onChanged: (value) {
                            setState(() {
                              _agreeToTerms = value ?? false;
                            });
                          },
                          activeColor: AppTheme.primaryColor,
                        ),
                        Expanded(
                          child: RichText(
                            text: TextSpan(
                              style: TextStyle(
                                fontSize: 14.sp,
                                fontFamily: 'Cairo',
                                color: AppTheme.textSecondary,
                              ),
                              children: [
                                const TextSpan(text: 'أوافق على '),
                                TextSpan(
                                  text: 'الشروط والأحكام',
                                  style: TextStyle(
                                    color: AppTheme.primaryColor,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                                const TextSpan(text: ' و '),
                                TextSpan(
                                  text: 'سياسة الخصوصية',
                                  style: TextStyle(
                                    color: AppTheme.primaryColor,
                                    decoration: TextDecoration.underline,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 30.h),

                    // Continue Button
                    CustomButton(
                      text: 'متابعة',
                      onPressed: _continueToDocuments,
                      isEnabled: locationProvider.isLocationValid,
                    ),

                    SizedBox(height: 20.h),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  IconData _getActivityIcon(String activity) {
    switch (activity) {
      case Activities.pharmacy:
        return Icons.local_pharmacy;
      case Activities.supermarket:
        return Icons.store;
      case Activities.restaurant:
        return Icons.restaurant;
      case Activities.clinic:
        return Icons.local_hospital;
      case Activities.courier:
        return Icons.delivery_dining;
      case Activities.driver:
        return Icons.directions_car;
      default:
        return Icons.business;
    }
  }
}
```
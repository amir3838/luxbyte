# lib/features/profile/profile_screen.dart

```dart
// lib/features/profile/profile_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/constants/activities.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/custom_button.dart';
import '../../shared/widgets/loading_overlay.dart';
import '../../shared/widgets/social_media_widget.dart';

class ProfileScreen extends StatefulWidget {
  const ProfileScreen({super.key});

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  final ImagePicker _imagePicker = ImagePicker();

  Future<void> _pickProfileImage() async {
    final XFile? image = await _imagePicker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 800,
      maxHeight: 800,
      imageQuality: 85,
    );

    if (image != null) {
      // Upload profile image
      final authProvider = context.read<AuthProvider>();
      // authProvider.updateProfileImage(image.path);
    }
  }

  Future<void> _logout() async {
    final authProvider = context.read<AuthProvider>();
    await authProvider.logout();
    if (mounted) {
      context.go('/login');
    }
  }

  void _showLogoutDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(
            'تسجيل الخروج',
            style: TextStyle(
              fontFamily: 'Cairo',
              fontWeight: FontWeight.bold,
            ),
          ),
          content: Text(
            'هل أنت متأكد من تسجيل الخروج؟',
            style: TextStyle(
              fontFamily: 'Cairo',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text(
                'إلغاء',
                style: TextStyle(
                  fontFamily: 'Cairo',
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.pop(context);
                _logout();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.errorColor,
              ),
              child: Text(
                'تسجيل الخروج',
                style: TextStyle(
                  fontFamily: 'Cairo',
                ),
              ),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'الملف الشخصي',
          style: TextStyle(
            fontFamily: 'Cairo',
            fontWeight: FontWeight.bold,
          ),
        ),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.arrow_back_ios),
        ),
      ),
      body: Consumer<AuthProvider>(
        builder: (context, authProvider, child) {
          final user = authProvider.user;
          if (user == null) {
            return const Center(child: Text('خطأ في تحميل بيانات المستخدم'));
          }

          final activityData = Activities.activityDetails[user.type];

          return LoadingOverlay(
            isLoading: authProvider.isLoading,
            child: SingleChildScrollView(
              padding: EdgeInsets.all(24.w),
              child: Column(
                children: [
                  // Profile Header
                  Container(
                    width: double.infinity,
                    padding: EdgeInsets.all(24.w),
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [
                          Color(activityData?['color'] ?? AppTheme.primaryColor.value),
                          Color(activityData?['color'] ?? AppTheme.primaryColor.value).withOpacity(0.8),
                        ],
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                      ),
                      borderRadius: BorderRadius.circular(20.r),
                      boxShadow: [AppTheme.elevatedShadow],
                    ),
                    child: Column(
                      children: [
                        // Profile Image
                        Stack(
                          children: [
                            CircleAvatar(
                              radius: 50.r,
                              backgroundColor: Colors.white,
                              backgroundImage: user.profilePicture != null
                                  ? NetworkImage(user.profilePicture!)
                                  : null,
                              child: user.profilePicture == null
                                  ? Icon(
                                      Icons.person,
                                      size: 50.w,
                                      color: Colors.grey,
                                    )
                                  : null,
                            ),
                            Positioned(
                              bottom: 0,
                              right: 0,
                              child: GestureDetector(
                                onTap: _pickProfileImage,
                                child: Container(
                                  width: 32.w,
                                  height: 32.w,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(16.r),
                                    boxShadow: [AppTheme.cardShadow],
                                  ),
                                  child: Icon(
                                    Icons.camera_alt,
                                    size: 16.w,
                                    color: AppTheme.primaryColor,
                                  ),
                                ),
                              ),
                            ),
                          ],
                        ),

                        SizedBox(height: 16.h),

                        // Name and Activity
                        Text(
                          user.name,
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24.sp,
                            fontWeight: FontWeight.bold,
                            fontFamily: 'Cairo',
                          ),
                        ),

                        SizedBox(height: 4.h),

                        Text(
                          activityData?['nameAr'] ?? user.type,
                          style: TextStyle(
                            color: Colors.white70,
                            fontSize: 16.sp,
                            fontFamily: 'Cairo',
                          ),
                        ),

                        SizedBox(height: 8.h),

                        // Status Badge
                        Container(
                          padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 6.h),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(20.r),
                          ),
                          child: Text(
                            Activities.getStatusNameAr(user.status),
                            style: TextStyle(
                              color: Colors.white,
                              fontSize: 14.sp,
                              fontFamily: 'Cairo',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 30.h),

                  // Profile Information
                  _buildInfoSection('المعلومات الشخصية', [
                    _buildInfoItem('الاسم', user.name),
                    _buildInfoItem('البريد الإلكتروني', user.email),
                    _buildInfoItem('رقم الهاتف', user.phone),
                    if (user.businessName != null)
                      _buildInfoItem('اسم النشاط التجاري', user.businessName!),
                    if (user.address != null)
                      _buildInfoItem('العنوان', user.address!),
                  ]),

                  SizedBox(height: 20.h),

                  // Account Settings
                  _buildInfoSection('إعدادات الحساب', [
                    _buildActionItem(
                      'تحديث المعلومات',
                      Icons.edit,
                      () {
                        // Navigate to edit profile
                      },
                    ),
                    _buildActionItem(
                      'تغيير كلمة المرور',
                      Icons.lock_outline,
                      () {
                        // Navigate to change password
                      },
                    ),
                    _buildActionItem(
                      'الإشعارات',
                      Icons.notifications_outlined,
                      () => context.push('/notifications'),
                    ),
                  ]),

                  SizedBox(height: 20.h),

                  // Application Info
                  _buildInfoSection('حول التطبيق', [
                    _buildActionItem(
                      'الشروط والأحكام',
                      Icons.description,
                      () {
                        // Open terms
                      },
                    ),
                    _buildActionItem(
                      'سياسة الخصوصية',
                      Icons.privacy_tip_outlined,
                      () {
                        // Open privacy policy
                      },
                    ),
                    _buildActionItem(
                      'المساعدة والدعم',
                      Icons.help_outline,
                      () => context.push('/bot'),
                    ),
                  ]),

                  SizedBox(height: 30.h),

                  // Logout Button
                  CustomButton(
                    text: 'تسجيل الخروج',
                    onPressed: _showLogoutDialog,
                    backgroundColor: AppTheme.errorColor,
                    icon: const Icon(Icons.logout, color: Colors.white),
                  ),

                  SizedBox(height: 20.h),

                  // Social Media
                  const SocialMediaWidget(),

                  SizedBox(height: 20.h),

                  // App Version
                  Text(
                    'LUXBYTE v1.0.0',
                    style: TextStyle(
                      fontSize: 12.sp,
                      color: AppTheme.textTertiary,
                      fontFamily: 'Cairo',
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildInfoSection(String title, List<Widget> children) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [AppTheme.cardShadow],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
              fontFamily: 'Cairo',
            ),
          ),
          SizedBox(height: 16.h),
          ...children,
        ],
      ),
    );
  }

  Widget _buildInfoItem(String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16.h),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100.w,
            child: Text(
              label,
              style: TextStyle(
                fontSize: 14.sp,
                color: AppTheme.textSecondary,
                fontFamily: 'Cairo',
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(
                fontSize: 14.sp,
                fontWeight: FontWeight.w500,
                color: AppTheme.textPrimary,
                fontFamily: 'Cairo',
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionItem(String title, IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        margin: EdgeInsets.only(bottom: 8.h),
        padding: EdgeInsets.symmetric(vertical: 12.h),
        child: Row(
          children: [
            Icon(
              icon,
              color: AppTheme.primaryColor,
              size: 20.w,
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: Text(
                title,
                style: TextStyle(
                  fontSize: 14.sp,
                  fontWeight: FontWeight.w500,
                  color: AppTheme.textPrimary,
                  fontFamily: 'Cairo',
                ),
              ),
            ),
            Icon(
              Icons.arrow_forward_ios,
              color: AppTheme.textTertiary,
              size: 16.w,
            ),
          ],
        ),
      ),
    );
  }
}
```

# lib/features/bot/bot_screen.dart

```dart
// lib/features/bot/bot_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:go_router/go_router.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../core/constants/social_links.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/social_media_widget.dart';

class BotScreen extends StatefulWidget {
  const BotScreen({super.key});

  @override
  State<BotScreen> createState() => _BotScreenState();
}

class _BotScreenState extends State<BotScreen> {
  final List<Map<String, dynamic>> _faqs = [
    {
      'question': 'كيف يمكنني تسجيل حساب جديد؟',
      'answer': 'يمكنك تسجيل حساب جديد عن طريق اختيار نوع النشاط (شوب إي جي أو ماستر درايفر)، ثم ملء البيانات المطلوبة ورفع المستندات اللازمة.',
    },
    {
      'question': 'ما هي المستندات المطلوبة للتسجيل؟',
      'answer': 'المستندات المطلوبة تختلف حسب نوع النشاط:\n• الصيدلية: الرقم القومي، رخصة الصيدلية، السجل التجاري، البطاقة الضريبية\n• السوبرماركت: الرقم القومي، السجل التجاري، البطاقة الضريبية\n• المطعم: الرقم القومي، السجل التجاري، الشهادة الصحية، البطاقة الضريبية\n• السائق: الرقم القومي، رخصة القيادة، رخصة السيارة',
    },
    {
      'question': 'كم تستغرق مراجعة الطلب؟',
      'answer': 'مراجعة طلبك تستغرق عادة من 24 إلى 48 ساعة عمل. ستتلقى إشعار عبر البريد الإلكتروني عند الانتهاء من المراجعة.',
    },
    {
      'question': 'كيف يمكنني تغيير نوع النشاط؟',
      'answer': 'لتغيير نوع النشاط، يرجى التواصل مع فريق الدعم عبر الواتساب أو الاتصال المباشر. سيتطلب ذلك إعادة رفع المستندات المناسبة للنشاط الجديد.',
    },
    {
      'question': 'ما هو الفرق بين شوب إي جي وماستر درايفر؟',
      'answer': 'شوب إي جي: منصة شاملة للتجار (صيدليات، سوبرماركت، مطاعم، عيادات) ومندوبي التوصيل\n\nماستر درايفر: منصة نقل الركاب مثل أوبر للسائقين الذين يمتلكون سيارات',
    },
    {
      'question': 'كيف يمكنني استعادة كلمة المرور؟',
      'answer': 'يمكنك استعادة كلمة المرور من شاشة تسجيل الدخول عن طريق النقر على "نسيت كلمة المرور؟" وإدخال بريدك الإلكتروني.',
    },
    {
      'question': 'كيف يمكنني التواصل مع الدعم؟',
      'answer': 'يمكنك التواصل مع فريق الدعم عبر:\n• واتساب: 01148709609\n• الاتصال المباشر: 01148709609\n• البريد الإلكتروني: support@luxbyte.com',
    },
  ];

  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, dynamic>> _chatMessages = [];
  bool _showFAQ = true;

  @override
  void initState() {
    super.initState();
    _addBotMessage('مرحباً! أنا مساعدك الذكي في LUXBYTE. كيف يمكنني مساعدتك؟');
  }

  @override
  void dispose() {
    _messageController.dispose();
    super.dispose();
  }

  void _addBotMessage(String message) {
    setState(() {
      _chatMessages.add({
        'message': message,
        'isUser': false,
        'timestamp': DateTime.now(),
      });
    });
  }

  void _addUserMessage(String message) {
    setState(() {
      _chatMessages.add({
        'message': message,
        'isUser': true,
        'timestamp': DateTime.now(),
      });
      _showFAQ = false;
    });
  }

  void _handleFAQTap(Map<String, dynamic> faq) {
    _addUserMessage(faq['question']);
    Future.delayed(const Duration(milliseconds: 500), () {
      _addBotMessage(faq['answer']);
    });
  }

  void _sendMessage() {
    final message = _messageController.text.trim();
    if (message.isEmpty) return;

    _addUserMessage(message);
    _messageController.clear();

    // Simple bot response logic
    Future.delayed(const Duration(milliseconds: 1000), () {
      String response = _getBotResponse(message);
      _addBotMessage(response);
    });
  }

  String _getBotResponse(String message) {
    final lowerMessage = message.toLowerCase();
    
    if (lowerMessage.contains('تسجيل') || lowerMessage.contains('حساب')) {
      return 'لتسجيل حساب جديد، اختر نوع النشاط المناسب (شوب إي جي أو ماستر درايفر) ثم اتبع الخطوات المطلوبة.';
    } else if (lowerMessage.contains('مستندات') || lowerMessage.contains('وثائق')) {
      return 'المستندات المطلوبة تختلف حسب نوع النشاط. يمكنك مراجعة القائمة الكاملة في الأسئلة الشائعة أعلاه.';
    } else if (lowerMessage.contains('مراجعة') || lowerMessage.contains('موافقة')) {
      return 'مراجعة طلبك تستغرق من 24 إلى 48 ساعة عمل. ستتلقى إشعار عند الانتهاء.';
    } else if (lowerMessage.contains('دعم') || lowerMessage.contains('مساعدة')) {
      return 'يمكنك التواصل مع فريق الدعم عبر الواتساب: 01148709609 أو الاتصال المباشر على نفس الرقم.';
    } else if (lowerMessage.contains('شكرا') || lowerMessage.contains('شكراً')) {
      return 'عفواً! سعيد لمساعدتك. هل تحتاج لأي مساعدة أخرى؟';
    } else {
      return 'عذراً، لم أفهم سؤالك. يمكنك مراجعة الأسئلة الشائعة أعلاه أو التواصل مع فريق الدعم للحصول على مساعدة مباشرة.';
    }
  }

  Future<void> _contactSupport() async {
    final url = Uri.parse(SocialLinks.whatsappChatUrl);
    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            CircleAvatar(
              radius: 16.r,
              backgroundColor: AppTheme.primaryColor,
              child: Icon(
                Icons.smart_toy,
                color: Colors.white,
                size: 20.w,
              ),
            ),
            SizedBox(width: 12.w),
            Text(
              'المساعد الذكي',
              style: TextStyle(
                fontFamily: 'Cairo',
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        leading: IconButton(
          onPressed: () => context.pop(),
          icon: const Icon(Icons.arrow_back_ios),
        ),
        actions: [
          IconButton(
            onPressed: _contactSupport,
            icon: const Icon(Icons.support_agent),
            tooltip: 'تواصل مع الدعم',
          ),
        ],
      ),
      body: Column(
        children: [
          // FAQ Section
          if (_showFAQ && _chatMessages.length <= 1)
            Container(
              height: 200.h,
              padding: EdgeInsets.all(16.w),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'الأسئلة الشائعة',
                    style: TextStyle(
                      fontSize: 16.sp,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                      fontFamily: 'Cairo',
                    ),
                  ),
                  SizedBox(height: 12.h),
                  Expanded(
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _faqs.take(4).length,
                      itemBuilder: (context, index) {
                        final faq = _faqs[index];
                        return GestureDetector(
                          onTap: () => _handleFAQTap(faq),
                          child: Container(
                            width: 200.w,
                            margin: EdgeInsets.only(right: 12.w),
                            padding: EdgeInsets.all(12.w),
                            decoration: BoxDecoration(
                              color: AppTheme.primaryColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(12.r),
                              border: Border.all(
                                color: AppTheme.primaryColor.withOpacity(0.3),
                              ),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(
                                  Icons.help_outline,
                                  color: AppTheme.primaryColor,
                                  size: 20.w,
                                ),
                                SizedBox(height: 8.h),
                                Text(
                                  faq['question'],
                                  style: TextStyle(
                                    fontSize: 12.sp,
                                    fontWeight: FontWeight.w500,
                                    color: AppTheme.textPrimary,
                                    fontFamily: 'Cairo',
                                  ),
                                  maxLines: 3,
                                  overflow: TextOverflow.ellipsis,
                                ),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),

          // Chat Messages
          Expanded(
            child: ListView.builder(
              padding: EdgeInsets.all(16.w),
              itemCount: _chatMessages.length,
              itemBuilder: (context, index) {
                final message = _chatMessages[index];
                return _buildMessageBubble(message);
              },
            ),
          ),

          // Message Input
          Container(
            padding: EdgeInsets.all(16.w),
            decoration: BoxDecoration(
              color: Colors.white,
              border: Border(
                top: BorderSide(color: Colors.grey.shade200),
              ),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _messageController,
                    decoration: InputDecoration(
                      hintText: 'اكتب رسالتك هنا...',
                      hintStyle: TextStyle(
                        fontFamily: 'Cairo',
                        color: AppTheme.textTertiary,
                      ),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(25.r),
                        borderSide: BorderSide(color: Colors.grey.shade300),
                      ),
                      contentPadding: EdgeInsets.symmetric(
                        horizontal: 16.w,
                        vertical: 12.h,
                      ),
                    ),
                    style: TextStyle(
                      fontFamily: 'Cairo',
                    ),
                    textDirection: TextDirection.rtl,
                    onSubmitted: (_) => _sendMessage(),
                  ),
                ),
                SizedBox(width: 12.w),
                GestureDetector(
                  onTap: _sendMessage,
                  child: Container(
                    width: 48.w,
                    height: 48.w,
                    decoration: BoxDecoration(
                      color: AppTheme.primaryColor,
                      borderRadius: BorderRadius.circular(24.r),
                    ),
                    child: Icon(
                      Icons.send,
                      color: Colors.white,
                      size: 20.w,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> message) {
    final isUser = message['isUser'] as bool;
    
    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      child: Row(
        mainAxisAlignment: isUser ? MainAxisAlignment.end : MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          if (!isUser) ...[
            CircleAvatar(
              radius: 16.r,
              backgroundColor: AppTheme.primaryColor,
              child: Icon(
                Icons.smart_toy,
                color: Colors.white,
                size: 16.w,
              ),
            ),
            SizedBox(width: 8.w),
          ],
          Flexible(
            child: Container(
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(
                color: isUser ? AppTheme.primaryColor : Colors.grey.shade100,
                borderRadius: BorderRadius.circular(12.r),
              ),
              child: Text(
                message['message'],
                style: TextStyle(
                  fontSize: 14.sp,
                  color: isUser ? Colors.white : AppTheme.textPrimary,
                  fontFamily: 'Cairo',
                ),
              ),
            ),
          ),
          if (isUser) ...[
            SizedBox(width: 8.w),
            CircleAvatar(
              radius: 16.r,
              backgroundColor: AppTheme.secondaryColor,
              child: Icon(
                Icons.person,
                color: Colors.white,
                size: 16.w,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
```
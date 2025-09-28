# lib/features/signup/verification_waiting_screen.dart

```dart
// lib/features/signup/verification_waiting_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/activities.dart';
import '../../core/providers/auth_provider.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/custom_button.dart';
import '../../shared/widgets/social_media_widget.dart';
import './providers/signup_provider.dart';

class VerificationWaitingScreen extends StatefulWidget {
  const VerificationWaitingScreen({super.key});

  @override
  State<VerificationWaitingScreen> createState() => _VerificationWaitingScreenState();
}

class _VerificationWaitingScreenState extends State<VerificationWaitingScreen>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _rotationController;
  late Animation<double> _pulseAnimation;
  late Animation<double> _rotationAnimation;

  @override
  void initState() {
    super.initState();
    _initializeAnimations();
    _registerUser();
  }

  void _initializeAnimations() {
    _pulseController = AnimationController(
      duration: const Duration(seconds: 2),
      vsync: this,
    )..repeat(reverse: true);

    _rotationController = AnimationController(
      duration: const Duration(seconds: 10),
      vsync: this,
    )..repeat();

    _pulseAnimation = Tween<double>(
      begin: 0.8,
      end: 1.2,
    ).animate(CurvedAnimation(
      parent: _pulseController,
      curve: Curves.easeInOut,
    ));

    _rotationAnimation = Tween<double>(
      begin: 0,
      end: 1,
    ).animate(_rotationController);
  }

  Future<void> _registerUser() async {
    final signupProvider = context.read<SignupProvider>();
    final authProvider = context.read<AuthProvider>();

    // Simulate registration process
    await Future.delayed(const Duration(seconds: 2));

    try {
      // Here you would normally call the actual signup method
      // For now, we'll just set the loading state
      signupProvider.setLoading(false);
    } catch (e) {
      signupProvider.setError(e.toString());
    }
  }

  void _goToLogin() {
    context.go('/login');
  }

  void _contactSupport() {
    // Open WhatsApp or phone dialer
    // This would be implemented using url_launcher
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _rotationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Consumer<SignupProvider>(
        builder: (context, signupProvider, child) {
          final activityType = signupProvider.selectedActivity;
          final activityData = Activities.activityDetails[activityType];

          return Container(
            decoration: BoxDecoration(
              gradient: AppTheme.primaryGradient,
            ),
            child: SafeArea(
              child: Padding(
                padding: EdgeInsets.all(24.w),
                child: Column(
                  children: [
                    const Spacer(),

                    // Animated Icon
                    AnimatedBuilder(
                      animation: _pulseAnimation,
                      builder: (context, child) {
                        return Transform.scale(
                          scale: _pulseAnimation.value,
                          child: AnimatedBuilder(
                            animation: _rotationAnimation,
                            builder: (context, child) {
                              return Transform.rotate(
                                angle: _rotationAnimation.value * 2 * 3.14159,
                                child: Container(
                                  width: 120.w,
                                  height: 120.w,
                                  decoration: BoxDecoration(
                                    color: Colors.white,
                                    borderRadius: BorderRadius.circular(60.r),
                                    boxShadow: [
                                      BoxShadow(
                                        color: Colors.black.withOpacity(0.2),
                                        blurRadius: 20,
                                        offset: const Offset(0, 10),
                                      ),
                                    ],
                                  ),
                                  child: Icon(
                                    Icons.hourglass_empty,
                                    size: 60.w,
                                    color: Color(activityData?['color'] ?? AppTheme.primaryColor.value),
                                  ),
                                ),
                              );
                            },
                          ),
                        );
                      },
                    ),

                    SizedBox(height: 40.h),

                    // Success Title
                    Text(
                      'تم إرسال طلبك بنجاح!',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28.sp,
                        fontWeight: FontWeight.bold,
                        fontFamily: 'Cairo',
                      ),
                      textAlign: TextAlign.center,
                    ),

                    SizedBox(height: 16.h),

                    // Subtitle
                    Text(
                      'طلبك قيد المراجعة من قبل فريقنا',
                      style: TextStyle(
                        color: Colors.white70,
                        fontSize: 18.sp,
                        fontFamily: 'Cairo',
                      ),
                      textAlign: TextAlign.center,
                    ),

                    SizedBox(height: 30.h),

                    // Info Card
                    Container(
                      width: double.infinity,
                      padding: EdgeInsets.all(20.w),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(16.r),
                        boxShadow: [AppTheme.elevatedShadow],
                      ),
                      child: Column(
                        children: [
                          // Activity Info
                          Row(
                            children: [
                              Container(
                                width: 50.w,
                                height: 50.w,
                                decoration: BoxDecoration(
                                  color: Color(activityData?['color'] ?? AppTheme.primaryColor.value).withOpacity(0.1),
                                  borderRadius: BorderRadius.circular(12.r),
                                ),
                                child: Icon(
                                  _getActivityIcon(activityType ?? ''),
                                  color: Color(activityData?['color'] ?? AppTheme.primaryColor.value),
                                  size: 24.w,
                                ),
                              ),
                              SizedBox(width: 12.w),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      activityData?['nameAr'] ?? activityType ?? '',
                                      style: TextStyle(
                                        fontSize: 16.sp,
                                        fontWeight: FontWeight.bold,
                                        color: AppTheme.textPrimary,
                                        fontFamily: 'Cairo',
                                      ),
                                    ),
                                    Text(
                                      signupProvider.name ?? '',
                                      style: TextStyle(
                                        fontSize: 14.sp,
                                        color: AppTheme.textSecondary,
                                        fontFamily: 'Cairo',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),

                          SizedBox(height: 20.h),

                          // Status Timeline
                          _buildStatusTimeline(),

                          SizedBox(height: 20.h),

                          // Expected Time
                          Container(
                            padding: EdgeInsets.all(12.w),
                            decoration: BoxDecoration(
                              color: AppTheme.infoColor.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8.r),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  Icons.schedule,
                                  color: AppTheme.infoColor,
                                  size: 16.w,
                                ),
                                SizedBox(width: 8.w),
                                Expanded(
                                  child: Text(
                                    'المراجعة تستغرق عادة من 24 إلى 48 ساعة',
                                    style: TextStyle(
                                      fontSize: 12.sp,
                                      color: AppTheme.infoColor,
                                      fontFamily: 'Cairo',
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),

                    const Spacer(),

                    // Action Buttons
                    Column(
                      children: [
                        CustomButton(
                          text: 'العودة لتسجيل الدخول',
                          onPressed: _goToLogin,
                          backgroundColor: Colors.white,
                          textColor: AppTheme.primaryColor,
                        ),

                        SizedBox(height: 16.h),

                        OutlinedButton(
                          onPressed: _contactSupport,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: const BorderSide(color: Colors.white, width: 2),
                            minimumSize: Size(double.infinity, 48.h),
                          ),
                          child: Text(
                            'تواصل مع الدعم',
                            style: TextStyle(
                              fontSize: 16.sp,
                              fontFamily: 'Cairo',
                            ),
                          ),
                        ),
                      ],
                    ),

                    SizedBox(height: 30.h),

                    // Social Media
                    const SocialMediaWidget(showTitle: false),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatusTimeline() {
    return Column(
      children: [
        _buildTimelineStep(
          title: 'تم إرسال الطلب',
          isCompleted: true,
          isActive: false,
        ),
        _buildTimelineStep(
          title: 'قيد المراجعة',
          isCompleted: false,
          isActive: true,
        ),
        _buildTimelineStep(
          title: 'الموافقة',
          isCompleted: false,
          isActive: false,
        ),
      ],
    );
  }

  Widget _buildTimelineStep({
    required String title,
    required bool isCompleted,
    required bool isActive,
  }) {
    return Row(
      children: [
        Container(
          width: 20.w,
          height: 20.w,
          decoration: BoxDecoration(
            color: isCompleted ? AppTheme.successColor : 
                   isActive ? AppTheme.primaryColor : Colors.grey.shade300,
            borderRadius: BorderRadius.circular(10.r),
          ),
          child: isCompleted
              ? Icon(
                  Icons.check,
                  size: 12.w,
                  color: Colors.white,
                )
              : isActive
                  ? Container(
                      width: 8.w,
                      height: 8.w,
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(4.r),
                      ),
                    )
                  : null,
        ),
        SizedBox(width: 12.w),
        Expanded(
          child: Text(
            title,
            style: TextStyle(
              fontSize: 14.sp,
              fontWeight: isActive ? FontWeight.w600 : FontWeight.normal,
              color: isCompleted ? AppTheme.successColor :
                     isActive ? AppTheme.primaryColor : AppTheme.textSecondary,
              fontFamily: 'Cairo',
            ),
          ),
        ),
      ],
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

# lib/features/dashboards/merchant/merchant_dashboard.dart

```dart
// lib/features/dashboards/merchant/merchant_dashboard.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/dashboard_provider.dart';
import '../../../core/providers/order_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../core/constants/activities.dart';
import '../../../shared/widgets/loading_overlay.dart';

class MerchantDashboard extends StatefulWidget {
  const MerchantDashboard({super.key});

  @override
  State<MerchantDashboard> createState() => _MerchantDashboardState();
}

class _MerchantDashboardState extends State<MerchantDashboard> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _loadData();
    });
  }

  Future<void> _loadData() async {
    final user = context.read<AuthProvider>().user;
    if (user != null) {
      await Future.wait([
        context.read<DashboardProvider>().loadStatistics(user: user),
        context.read<OrderProvider>().loadOrders(user: user),
      ]);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            final user = authProvider.user;
            final activityData = Activities.activityDetails[user?.type];
            
            return Row(
              children: [
                if (activityData != null) ...[
                  Icon(
                    _getActivityIcon(user?.type ?? ''),
                    color: Color(activityData['color'] as int),
                    size: 24.w,
                  ),
                  SizedBox(width: 8.w),
                ],
                Text(
                  activityData?['nameAr'] ?? 'لوحة التحكم',
                  style: TextStyle(
                    fontFamily: 'Cairo',
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ],
            );
          },
        ),
        actions: [
          IconButton(
            onPressed: () => context.push('/notifications'),
            icon: const Icon(Icons.notifications_outlined),
          ),
          IconButton(
            onPressed: () => context.push('/profile'),
            icon: const Icon(Icons.person_outline),
          ),
        ],
      ),
      body: Consumer3<AuthProvider, DashboardProvider, OrderProvider>(
        builder: (context, authProvider, dashboardProvider, orderProvider, child) {
          final user = authProvider.user;
          if (user == null) {
            return const Center(child: Text('خطأ في تحميل بيانات المستخدم'));
          }

          return LoadingOverlay(
            isLoading: dashboardProvider.isLoading || orderProvider.isLoading,
            child: RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                padding: EdgeInsets.all(16.w),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Welcome Card
                    _buildWelcomeCard(user, authProvider),

                    SizedBox(height: 20.h),

                    // Statistics Cards
                    _buildStatisticsGrid(dashboardProvider),

                    SizedBox(height: 20.h),

                    // Quick Actions
                    _buildQuickActions(),

                    SizedBox(height: 20.h),

                    // Recent Orders
                    _buildRecentOrders(orderProvider),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildWelcomeCard(user, AuthProvider authProvider) {
    final activityData = Activities.activityDetails[user.type];
    
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Color(activityData?['color'] ?? AppTheme.primaryColor.value),
            Color(activityData?['color'] ?? AppTheme.primaryColor.value).withOpacity(0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16.r),
        boxShadow: [AppTheme.elevatedShadow],
      ),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'مرحباً ${user.name}',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 20.sp,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Cairo',
                  ),
                ),
                SizedBox(height: 4.h),
                Text(
                  activityData?['description'] ?? '',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 14.sp,
                    fontFamily: 'Cairo',
                  ),
                ),
                SizedBox(height: 8.h),
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 4.h),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20.r),
                  ),
                  child: Text(
                    Activities.getStatusNameAr(user.status),
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 12.sp,
                      fontFamily: 'Cairo',
                    ),
                  ),
                ),
              ],
            ),
          ),
          Icon(
            _getActivityIcon(user.type),
            color: Colors.white,
            size: 48.w,
          ),
        ],
      ),
    );
  }

  Widget _buildStatisticsGrid(DashboardProvider dashboardProvider) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 12.h,
      crossAxisSpacing: 12.w,
      childAspectRatio: 1.2,
      children: [
        _buildStatCard(
          title: 'إجمالي الطلبات',
          value: dashboardProvider.totalOrders.toString(),
          icon: Icons.shopping_cart,
          color: AppTheme.primaryColor,
        ),
        _buildStatCard(
          title: 'الطلبات المعلقة',
          value: dashboardProvider.pendingOrders.toString(),
          icon: Icons.hourglass_empty,
          color: AppTheme.warningColor,
        ),
        _buildStatCard(
          title: 'الطلبات المكتملة',
          value: dashboardProvider.completedOrders.toString(),
          icon: Icons.check_circle,
          color: AppTheme.successColor,
        ),
        _buildStatCard(
          title: 'إجمالي الإيرادات',
          value: '${dashboardProvider.totalRevenue.toStringAsFixed(0)} ج.م',
          icon: Icons.monetization_on,
          color: AppTheme.infoColor,
        ),
      ],
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required IconData icon,
    required Color color,
  }) {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        boxShadow: [AppTheme.cardShadow],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Icon(icon, color: color, size: 24.w),
              Container(
                width: 8.w,
                height: 8.w,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: BorderRadius.circular(4.r),
                ),
              ),
            ],
          ),
          const Spacer(),
          Text(
            value,
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
              fontFamily: 'Cairo',
            ),
          ),
          SizedBox(height: 4.h),
          Text(
            title,
            style: TextStyle(
              fontSize: 12.sp,
              color: AppTheme.textSecondary,
              fontFamily: 'Cairo',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'إجراءات سريعة',
          style: TextStyle(
            fontSize: 18.sp,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
            fontFamily: 'Cairo',
          ),
        ),
        SizedBox(height: 12.h),
        Row(
          children: [
            Expanded(
              child: _buildActionButton(
                title: 'الطلبات',
                icon: Icons.list_alt,
                onTap: () => context.push('/orders'),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: _buildActionButton(
                title: 'المنتجات',
                icon: Icons.inventory_2,
                onTap: () => context.push('/products'),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: _buildActionButton(
                title: 'إضافة منتج',
                icon: Icons.add_circle,
                onTap: () => context.push('/add-product'),
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButton({
    required String title,
    required IconData icon,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: EdgeInsets.all(16.w),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12.r),
          border: Border.all(color: Colors.grey.shade200),
          boxShadow: [AppTheme.cardShadow],
        ),
        child: Column(
          children: [
            Icon(icon, color: AppTheme.primaryColor, size: 24.w),
            SizedBox(height: 8.h),
            Text(
              title,
              style: TextStyle(
                fontSize: 12.sp,
                fontWeight: FontWeight.w500,
                color: AppTheme.textPrimary,
                fontFamily: 'Cairo',
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentOrders(OrderProvider orderProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'الطلبات الأخيرة',
              style: TextStyle(
                fontSize: 18.sp,
                fontWeight: FontWeight.bold,
                color: AppTheme.textPrimary,
                fontFamily: 'Cairo',
              ),
            ),
            TextButton(
              onPressed: () => context.push('/orders'),
              child: Text(
                'عرض الكل',
                style: TextStyle(
                  fontSize: 14.sp,
                  color: AppTheme.primaryColor,
                  fontFamily: 'Cairo',
                ),
              ),
            ),
          ],
        ),
        SizedBox(height: 12.h),
        if (orderProvider.orders.isEmpty)
          Container(
            padding: EdgeInsets.all(20.w),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12.r),
            ),
            child: Center(
              child: Text(
                'لا توجد طلبات حتى الآن',
                style: TextStyle(
                  fontSize: 16.sp,
                  color: AppTheme.textSecondary,
                  fontFamily: 'Cairo',
                ),
              ),
            ),
          )
        else
          ...orderProvider.orders.take(3).map((order) => 
            Container(
              margin: EdgeInsets.only(bottom: 8.h),
              padding: EdgeInsets.all(16.w),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.r),
                boxShadow: [AppTheme.cardShadow],
              ),
              child: ListTile(
                contentPadding: EdgeInsets.zero,
                leading: CircleAvatar(
                  backgroundColor: _getStatusColor(order.status).withOpacity(0.1),
                  child: Icon(
                    _getStatusIcon(order.status),
                    color: _getStatusColor(order.status),
                  ),
                ),
                title: Text(
                  'طلب #${order.id.substring(0, 8)}',
                  style: TextStyle(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.bold,
                    fontFamily: 'Cairo',
                  ),
                ),
                subtitle: Text(
                  '${order.totalAmount} ج.م - ${_getStatusName(order.status)}',
                  style: TextStyle(
                    fontSize: 12.sp,
                    color: AppTheme.textSecondary,
                    fontFamily: 'Cairo',
                  ),
                ),
                trailing: Icon(
                  Icons.arrow_forward_ios,
                  size: 16.w,
                  color: AppTheme.textTertiary,
                ),
                onTap: () => context.push('/order-details/${order.id}'),
              ),
            ),
          ).toList(),
      ],
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
      default:
        return Icons.business;
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'pending':
        return AppTheme.warningColor;
      case 'processing':
        return AppTheme.infoColor;
      case 'completed':
        return AppTheme.successColor;
      case 'cancelled':
        return AppTheme.errorColor;
      default:
        return AppTheme.textSecondary;
    }
  }

  IconData _getStatusIcon(String status) {
    switch (status) {
      case 'pending':
        return Icons.hourglass_empty;
      case 'processing':
        return Icons.sync;
      case 'completed':
        return Icons.check_circle;
      case 'cancelled':
        return Icons.cancel;
      default:
        return Icons.info;
    }
  }

  String _getStatusName(String status) {
    switch (status) {
      case 'pending':
        return 'قيد الانتظار';
      case 'processing':
        return 'قيد التحضير';
      case 'completed':
        return 'مكتمل';
      case 'cancelled':
        return 'ملغي';
      default:
        return status;
    }
  }
}
```
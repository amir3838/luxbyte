# lib/features/dashboards/courier/courier_dashboard.dart

```dart
// lib/features/dashboards/courier/courier_dashboard.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/order_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/loading_overlay.dart';

class CourierDashboard extends StatefulWidget {
  const CourierDashboard({super.key});

  @override
  State<CourierDashboard> createState() => _CourierDashboardState();
}

class _CourierDashboardState extends State<CourierDashboard> {
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
      await context.read<OrderProvider>().loadAvailableOrders(user: user);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(
              Icons.delivery_dining,
              color: AppTheme.primaryColor,
              size: 24.w,
            ),
            SizedBox(width: 8.w),
            Text(
              'مندوب التوصيل',
              style: TextStyle(
                fontFamily: 'Cairo',
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
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
      body: Consumer2<AuthProvider, OrderProvider>(
        builder: (context, authProvider, orderProvider, child) {
          final user = authProvider.user;
          if (user == null) {
            return const Center(child: Text('خطأ في تحميل بيانات المستخدم'));
          }

          return LoadingOverlay(
            isLoading: orderProvider.isLoading,
            child: RefreshIndicator(
              onRefresh: _loadData,
              child: DefaultTabController(
                length: 3,
                child: Column(
                  children: [
                    // Stats Header
                    _buildStatsHeader(user, orderProvider),
                    
                    // Tab Bar
                    Container(
                      color: Colors.white,
                      child: TabBar(
                        labelColor: AppTheme.primaryColor,
                        unselectedLabelColor: AppTheme.textSecondary,
                        indicatorColor: AppTheme.primaryColor,
                        labelStyle: TextStyle(
                          fontFamily: 'Cairo',
                          fontWeight: FontWeight.w600,
                        ),
                        tabs: const [
                          Tab(text: 'متاحة'),
                          Tab(text: 'جارية'),
                          Tab(text: 'مكتملة'),
                        ],
                      ),
                    ),

                    // Tab Views
                    Expanded(
                      child: TabBarView(
                        children: [
                          _buildAvailableOrders(orderProvider),
                          _buildActiveOrders(orderProvider),
                          _buildCompletedOrders(orderProvider),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatsHeader(user, OrderProvider orderProvider) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            AppTheme.primaryColor,
            AppTheme.primaryColor.withOpacity(0.8),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
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
                  Text(
                    'مندوب توصيل نشط',
                    style: TextStyle(
                      color: Colors.white70,
                      fontSize: 14.sp,
                      fontFamily: 'Cairo',
                    ),
                  ),
                ],
              ),
              Container(
                padding: EdgeInsets.all(12.w),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12.r),
                ),
                child: Icon(
                  Icons.delivery_dining,
                  color: Colors.white,
                  size: 32.w,
                ),
              ),
            ],
          ),
          SizedBox(height: 20.h),
          Row(
            children: [
              Expanded(
                child: _buildStatItem(
                  'اليوم',
                  orderProvider.todayOrdersCount.toString(),
                  Icons.today,
                ),
              ),
              Expanded(
                child: _buildStatItem(
                  'الأسبوع',
                  orderProvider.orders.length.toString(),
                  Icons.calendar_today,
                ),
              ),
              Expanded(
                child: _buildStatItem(
                  'التقييم',
                  user.rating.toStringAsFixed(1),
                  Icons.star,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatItem(String title, String value, IconData icon) {
    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.1),
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 20.w),
          SizedBox(height: 4.h),
          Text(
            value,
            style: TextStyle(
              color: Colors.white,
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              fontFamily: 'Cairo',
            ),
          ),
          Text(
            title,
            style: TextStyle(
              color: Colors.white70,
              fontSize: 12.sp,
              fontFamily: 'Cairo',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAvailableOrders(OrderProvider orderProvider) {
    return ListView.builder(
      padding: EdgeInsets.all(16.w),
      itemCount: orderProvider.availableOrders.length,
      itemBuilder: (context, index) {
        final order = orderProvider.availableOrders[index];
        return _buildOrderCard(order, 'available');
      },
    );
  }

  Widget _buildActiveOrders(OrderProvider orderProvider) {
    return ListView.builder(
      padding: EdgeInsets.all(16.w),
      itemCount: orderProvider.activeOrders.length,
      itemBuilder: (context, index) {
        final order = orderProvider.activeOrders[index];
        return _buildOrderCard(order, 'active');
      },
    );
  }

  Widget _buildCompletedOrders(OrderProvider orderProvider) {
    return ListView.builder(
      padding: EdgeInsets.all(16.w),
      itemCount: orderProvider.completedOrders.length,
      itemBuilder: (context, index) {
        final order = orderProvider.completedOrders[index];
        return _buildOrderCard(order, 'completed');
      },
    );
  }

  Widget _buildOrderCard(order, String type) {
    Color statusColor;
    IconData statusIcon;
    String statusText;
    String actionText;

    switch (type) {
      case 'available':
        statusColor = AppTheme.infoColor;
        statusIcon = Icons.local_shipping;
        statusText = 'متاح للاستلام';
        actionText = 'استلام';
        break;
      case 'active':
        statusColor = AppTheme.warningColor;
        statusIcon = Icons.directions_run;
        statusText = 'قيد التوصيل';
        actionText = 'تم التسليم';
        break;
      case 'completed':
      default:
        statusColor = AppTheme.successColor;
        statusIcon = Icons.check_circle;
        statusText = 'تم التسليم';
        actionText = '';
    }

    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: statusColor.withOpacity(0.3)),
        boxShadow: [AppTheme.cardShadow],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 40.w,
                height: 40.w,
                decoration: BoxDecoration(
                  color: statusColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8.r),
                ),
                child: Icon(
                  statusIcon,
                  color: statusColor,
                  size: 20.w,
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'طلب #${order.id.substring(0, 8)}',
                      style: TextStyle(
                        fontSize: 16.sp,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                        fontFamily: 'Cairo',
                      ),
                    ),
                    Text(
                      statusText,
                      style: TextStyle(
                        fontSize: 12.sp,
                        color: statusColor,
                        fontFamily: 'Cairo',
                      ),
                    ),
                  ],
                ),
              ),
              Text(
                '${order.totalAmount} ج.م',
                style: TextStyle(
                  fontSize: 16.sp,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.successColor,
                  fontFamily: 'Cairo',
                ),
              ),
            ],
          ),
          SizedBox(height: 12.h),
          Row(
            children: [
              Icon(
                Icons.location_on,
                color: AppTheme.textSecondary,
                size: 16.w,
              ),
              SizedBox(width: 4.w),
              Expanded(
                child: Text(
                  order.deliveryAddress ?? 'عنوان التوصيل',
                  style: TextStyle(
                    fontSize: 14.sp,
                    color: AppTheme.textSecondary,
                    fontFamily: 'Cairo',
                  ),
                ),
              ),
            ],
          ),
          if (actionText.isNotEmpty) ...[
            SizedBox(height: 12.h),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () {
                      // Handle action
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: statusColor,
                      minimumSize: Size(0, 36.h),
                    ),
                    child: Text(
                      actionText,
                      style: TextStyle(
                        fontSize: 14.sp,
                        fontFamily: 'Cairo',
                      ),
                    ),
                  ),
                ),
                SizedBox(width: 12.w),
                OutlinedButton(
                  onPressed: () => context.push('/order-details/${order.id}'),
                  style: OutlinedButton.styleFrom(
                    minimumSize: Size(0, 36.h),
                  ),
                  child: Text(
                    'التفاصيل',
                    style: TextStyle(
                      fontSize: 14.sp,
                      fontFamily: 'Cairo',
                    ),
                  ),
                ),
              ],
            ),
          ] else ...[
            SizedBox(height: 12.h),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton(
                onPressed: () => context.push('/order-details/${order.id}'),
                style: OutlinedButton.styleFrom(
                  minimumSize: Size(0, 36.h),
                ),
                child: Text(
                  'عرض التفاصيل',
                  style: TextStyle(
                    fontSize: 14.sp,
                    fontFamily: 'Cairo',
                  ),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }
}
```

# lib/features/dashboards/driver/driver_dashboard.dart

```dart
// lib/features/dashboards/driver/driver_dashboard.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import '../../../core/providers/auth_provider.dart';
import '../../../core/providers/order_provider.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/loading_overlay.dart';

class DriverDashboard extends StatefulWidget {
  const DriverDashboard({super.key});

  @override
  State<DriverDashboard> createState() => _DriverDashboardState();
}

class _DriverDashboardState extends State<DriverDashboard> {
  bool _isOnline = false;

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
      await context.read<OrderProvider>().loadAvailableOrders(user: user);
      setState(() {
        _isOnline = user.isOnline;
      });
    }
  }

  void _toggleOnlineStatus() {
    setState(() {
      _isOnline = !_isOnline;
    });
    // Here you would update the user's online status in the database
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Icon(
              Icons.directions_car,
              color: Colors.indigo,
              size: 24.w,
            ),
            SizedBox(width: 8.w),
            Text(
              'ماستر درايفر',
              style: TextStyle(
                fontFamily: 'Cairo',
                fontWeight: FontWeight.bold,
              ),
            ),
          ],
        ),
        actions: [
          Switch(
            value: _isOnline,
            onChanged: (value) => _toggleOnlineStatus(),
            activeColor: AppTheme.successColor,
          ),
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
      body: Consumer2<AuthProvider, OrderProvider>(
        builder: (context, authProvider, orderProvider, child) {
          final user = authProvider.user;
          if (user == null) {
            return const Center(child: Text('خطأ في تحميل بيانات المستخدم'));
          }

          return LoadingOverlay(
            isLoading: orderProvider.isLoading,
            child: RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                padding: EdgeInsets.all(16.w),
                child: Column(
                  children: [
                    // Status Card
                    _buildStatusCard(user),
                    
                    SizedBox(height: 20.h),

                    // Vehicle Info
                    _buildVehicleInfo(user),

                    SizedBox(height: 20.h),

                    // Statistics
                    _buildStatisticsGrid(orderProvider),

                    SizedBox(height: 20.h),

                    // Available Rides
                    _buildAvailableRides(orderProvider),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatusCard(user) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: _isOnline
              ? [AppTheme.successColor, AppTheme.successColor.withOpacity(0.8)]
              : [Colors.grey, Colors.grey.withOpacity(0.8)],
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
                Row(
                  children: [
                    Container(
                      width: 8.w,
                      height: 8.w,
                      decoration: BoxDecoration(
                        color: _isOnline ? Colors.white : Colors.white70,
                        borderRadius: BorderRadius.circular(4.r),
                      ),
                    ),
                    SizedBox(width: 8.w),
                    Text(
                      _isOnline ? 'متاح الآن' : 'غير متاح',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 14.sp,
                        fontFamily: 'Cairo',
                      ),
                    ),
                  ],
                ),
                SizedBox(height: 8.h),
                Text(
                  _isOnline ? 'جاهز لاستقبال الرحلات' : 'اضغط للتفعيل',
                  style: TextStyle(
                    color: Colors.white70,
                    fontSize: 12.sp,
                    fontFamily: 'Cairo',
                  ),
                ),
              ],
            ),
          ),
          GestureDetector(
            onTap: _toggleOnlineStatus,
            child: Container(
              padding: EdgeInsets.all(16.w),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.2),
                borderRadius: BorderRadius.circular(50.r),
              ),
              child: Icon(
                _isOnline ? Icons.directions_car : Icons.power_settings_new,
                color: Colors.white,
                size: 32.w,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildVehicleInfo(user) {
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
          Text(
            'معلومات السيارة',
            style: TextStyle(
              fontSize: 16.sp,
              fontWeight: FontWeight.bold,
              color: AppTheme.textPrimary,
              fontFamily: 'Cairo',
            ),
          ),
          SizedBox(height: 12.h),
          Row(
            children: [
              Expanded(
                child: _buildInfoItem('الموديل', user.vehicleModel ?? 'غير محدد'),
              ),
              Expanded(
                child: _buildInfoItem('اللون', user.vehicleColor ?? 'غير محدد'),
              ),
            ],
          ),
          SizedBox(height: 8.h),
          _buildInfoItem('رقم اللوحة', user.vehicleNumber ?? 'غير محدد'),
        ],
      ),
    );
  }

  Widget _buildInfoItem(String label, String value) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4.h),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 12.sp,
              color: AppTheme.textSecondary,
              fontFamily: 'Cairo',
            ),
          ),
          Text(
            value,
            style: TextStyle(
              fontSize: 14.sp,
              fontWeight: FontWeight.w500,
              color: AppTheme.textPrimary,
              fontFamily: 'Cairo',
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatisticsGrid(OrderProvider orderProvider) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      mainAxisSpacing: 12.h,
      crossAxisSpacing: 12.w,
      childAspectRatio: 1.3,
      children: [
        _buildStatCard(
          title: 'رحلات اليوم',
          value: orderProvider.todayOrdersCount.toString(),
          icon: Icons.today,
          color: Colors.indigo,
        ),
        _buildStatCard(
          title: 'إجمالي الأرباح',
          value: '${orderProvider.orders.fold(0.0, (sum, order) => sum + order.totalAmount).toStringAsFixed(0)} ج.م',
          icon: Icons.monetization_on,
          color: AppTheme.successColor,
        ),
        _buildStatCard(
          title: 'التقييم',
          value: '4.8',
          icon: Icons.star,
          color: AppTheme.warningColor,
        ),
        _buildStatCard(
          title: 'الرحلات المكتملة',
          value: orderProvider.completedOrders.length.toString(),
          icon: Icons.check_circle,
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
              fontSize: 16.sp,
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

  Widget _buildAvailableRides(OrderProvider orderProvider) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'الرحلات المتاحة',
          style: TextStyle(
            fontSize: 18.sp,
            fontWeight: FontWeight.bold,
            color: AppTheme.textPrimary,
            fontFamily: 'Cairo',
          ),
        ),
        SizedBox(height: 12.h),
        if (!_isOnline)
          Container(
            padding: EdgeInsets.all(20.w),
            decoration: BoxDecoration(
              color: Colors.grey.shade100,
              borderRadius: BorderRadius.circular(12.r),
            ),
            child: Center(
              child: Column(
                children: [
                  Icon(
                    Icons.power_settings_new,
                    size: 48.w,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 12.h),
                  Text(
                    'قم بتفعيل الحالة لاستقبال الرحلات',
                    style: TextStyle(
                      fontSize: 16.sp,
                      color: AppTheme.textSecondary,
                      fontFamily: 'Cairo',
                    ),
                    textAlign: TextAlign.center,
                  ),
                ],
              ),
            ),
          )
        else if (orderProvider.availableOrders.isEmpty)
          Container(
            padding: EdgeInsets.all(20.w),
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(12.r),
            ),
            child: Center(
              child: Column(
                children: [
                  Icon(
                    Icons.search,
                    size: 48.w,
                    color: Colors.grey,
                  ),
                  SizedBox(height: 12.h),
                  Text(
                    'لا توجد رحلات متاحة حالياً',
                    style: TextStyle(
                      fontSize: 16.sp,
                      color: AppTheme.textSecondary,
                      fontFamily: 'Cairo',
                    ),
                  ),
                ],
              ),
            ),
          )
        else
          ...orderProvider.availableOrders.take(5).map((order) => 
            Container(
              margin: EdgeInsets.only(bottom: 12.h),
              padding: EdgeInsets.all(16.w),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12.r),
                border: Border.all(color: Colors.indigo.withOpacity(0.3)),
                boxShadow: [AppTheme.cardShadow],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        Icons.location_on,
                        color: Colors.indigo,
                        size: 20.w,
                      ),
                      SizedBox(width: 8.w),
                      Expanded(
                        child: Text(
                          'من: ${order.pickupAddress ?? 'نقطة الانطلاق'}',
                          style: TextStyle(
                            fontSize: 14.sp,
                            color: AppTheme.textPrimary,
                            fontFamily: 'Cairo',
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 8.h),
                  Row(
                    children: [
                      Icon(
                        Icons.flag,
                        color: AppTheme.errorColor,
                        size: 20.w,
                      ),
                      SizedBox(width: 8.w),
                      Expanded(
                        child: Text(
                          'إلى: ${order.deliveryAddress ?? 'نقطة الوصول'}',
                          style: TextStyle(
                            fontSize: 14.sp,
                            color: AppTheme.textPrimary,
                            fontFamily: 'Cairo',
                          ),
                        ),
                      ),
                    ],
                  ),
                  SizedBox(height: 12.h),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${order.totalAmount} ج.م',
                        style: TextStyle(
                          fontSize: 18.sp,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.successColor,
                          fontFamily: 'Cairo',
                        ),
                      ),
                      Row(
                        children: [
                          ElevatedButton(
                            onPressed: () {
                              // Accept ride
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.indigo,
                              minimumSize: Size(80.w, 32.h),
                            ),
                            child: Text(
                              'قبول',
                              style: TextStyle(
                                fontSize: 12.sp,
                                fontFamily: 'Cairo',
                              ),
                            ),
                          ),
                          SizedBox(width: 8.w),
                          OutlinedButton(
                            onPressed: () => context.push('/order-details/${order.id}'),
                            style: OutlinedButton.styleFrom(
                              minimumSize: Size(80.w, 32.h),
                            ),
                            child: Text(
                              'التفاصيل',
                              style: TextStyle(
                                fontSize: 12.sp,
                                fontFamily: 'Cairo',
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ).toList(),
      ],
    );
  }
}
```
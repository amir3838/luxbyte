# lib/shared/widgets/location_dropdown.dart

```dart
// lib/shared/widgets/location_dropdown.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../features/signup/providers/location_provider.dart';
import 'custom_text_field.dart';

class LocationDropdown extends StatefulWidget {
  const LocationDropdown({super.key});

  @override
  State<LocationDropdown> createState() => _LocationDropdownState();
}

class _LocationDropdownState extends State<LocationDropdown> {
  final _areaController = TextEditingController();

  @override
  void dispose() {
    _areaController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<LocationProvider>(
      builder: (context, locationProvider, child) {
        return Column(
          children: [
            // Governorate Dropdown
            DropdownButtonFormField<String>(
              value: locationProvider.selectedGovernorate,
              decoration: InputDecoration(
                labelText: 'المحافظة',
                prefixIcon: const Icon(Icons.location_city),
                filled: true,
                fillColor: Colors.grey.shade50,
                contentPadding: EdgeInsets.symmetric(
                  horizontal: 16.w,
                  vertical: 16.h,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.r),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.r),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.r),
                  borderSide: const BorderSide(color: AppTheme.primaryColor, width: 2),
                ),
              ),
              style: TextStyle(
                fontSize: 16.sp,
                fontFamily: 'Cairo',
                color: AppTheme.textPrimary,
              ),
              isExpanded: true,
              items: locationProvider.governorates.map((governorate) {
                return DropdownMenuItem<String>(
                  value: governorate,
                  child: Text(
                    governorate,
                    style: TextStyle(
                      fontSize: 16.sp,
                      fontFamily: 'Cairo',
                    ),
                  ),
                );
              }).toList(),
              onChanged: locationProvider.setSelectedGovernorate,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'يرجى اختيار المحافظة';
                }
                return null;
              },
            ),

            SizedBox(height: 16.h),

            // City Dropdown
            DropdownButtonFormField<String>(
              value: locationProvider.selectedCity,
              decoration: InputDecoration(
                labelText: 'المدينة',
                prefixIcon: const Icon(Icons.location_on),
                filled: true,
                fillColor: locationProvider.cities.isEmpty ? Colors.grey.shade100 : Colors.grey.shade50,
                contentPadding: EdgeInsets.symmetric(
                  horizontal: 16.w,
                  vertical: 16.h,
                ),
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.r),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                enabledBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.r),
                  borderSide: BorderSide(color: Colors.grey.shade300),
                ),
                focusedBorder: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12.r),
                  borderSide: const BorderSide(color: AppTheme.primaryColor, width: 2),
                ),
              ),
              style: TextStyle(
                fontSize: 16.sp,
                fontFamily: 'Cairo',
                color: AppTheme.textPrimary,
              ),
              isExpanded: true,
              items: locationProvider.cities.map((city) {
                return DropdownMenuItem<String>(
                  value: city,
                  child: Text(
                    city,
                    style: TextStyle(
                      fontSize: 16.sp,
                      fontFamily: 'Cairo',
                    ),
                  ),
                );
              }).toList(),
              onChanged: locationProvider.cities.isEmpty ? null : locationProvider.setSelectedCity,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'يرجى اختيار المدينة';
                }
                return null;
              },
            ),

            SizedBox(height: 16.h),

            // Area/Street Text Field
            CustomTextField(
              controller: _areaController,
              label: 'المنطقة/الشارع',
              prefixIcon: const Icon(Icons.home_outlined),
              onChanged: locationProvider.setArea,
              validator: (value) {
                if (value == null || value.isEmpty) {
                  return 'يرجى إدخال المنطقة أو الشارع';
                }
                return null;
              },
            ),

            if (locationProvider.isLocationValid) ...[
              SizedBox(height: 12.h),
              Container(
                width: double.infinity,
                padding: EdgeInsets.all(12.w),
                decoration: BoxDecoration(
                  color: AppTheme.successColor.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(8.r),
                  border: Border.all(color: AppTheme.successColor.withOpacity(0.3)),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.check_circle,
                      color: AppTheme.successColor,
                      size: 16.w,
                    ),
                    SizedBox(width: 8.w),
                    Expanded(
                      child: Text(
                        'العنوان الكامل: ${locationProvider.fullAddress}',
                        style: TextStyle(
                          fontSize: 14.sp,
                          color: AppTheme.successColor,
                          fontFamily: 'Cairo',
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ],
        );
      },
    );
  }
}
```

# lib/features/signup/document_upload_screen.dart

```dart
// lib/features/signup/document_upload_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_screen_util/flutter_screen_util.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';
import '../../core/constants/activities.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/widgets/custom_button.dart';
import '../../shared/widgets/custom_text_field.dart';
import '../../shared/widgets/loading_overlay.dart';
import './providers/signup_provider.dart';
import './providers/document_provider.dart';

class DocumentUploadScreen extends StatefulWidget {
  const DocumentUploadScreen({super.key});

  @override
  State<DocumentUploadScreen> createState() => _DocumentUploadScreenState();
}

class _DocumentUploadScreenState extends State<DocumentUploadScreen> {
  final _vehicleModelController = TextEditingController();
  final _vehicleNumberController = TextEditingController();
  final _vehicleColorController = TextEditingController();

  @override
  void dispose() {
    _vehicleModelController.dispose();
    _vehicleNumberController.dispose();
    _vehicleColorController.dispose();
    super.dispose();
  }

  Future<void> _pickDocument(String documentType) async {
    final documentProvider = context.read<DocumentProvider>();
    
    showModalBottomSheet(
      context: context,
      builder: (BuildContext context) {
        return SafeArea(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              ListTile(
                leading: const Icon(Icons.camera_alt),
                title: const Text('التقاط صورة'),
                onTap: () {
                  Navigator.pop(context);
                  documentProvider.pickImage(
                    documentType: documentType,
                    source: ImageSource.camera,
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.photo_library),
                title: const Text('اختيار من المعرض'),
                onTap: () {
                  Navigator.pop(context);
                  documentProvider.pickImage(
                    documentType: documentType,
                    source: ImageSource.gallery,
                  );
                },
              ),
              ListTile(
                leading: const Icon(Icons.description),
                title: const Text('اختيار ملف'),
                onTap: () {
                  Navigator.pop(context);
                  documentProvider.pickFile(
                    documentType: documentType,
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  Future<void> _submitDocuments() async {
    final signupProvider = context.read<SignupProvider>();
    final documentProvider = context.read<DocumentProvider>();
    
    final activityType = signupProvider.selectedActivity;
    if (activityType == null) return;

    // Check if all required documents are selected
    final requiredDocs = Activities.getRequiredDocuments(activityType);
    final missingDocs = requiredDocs.where((doc) => !documentProvider.isDocumentSelected(doc)).toList();
    
    if (missingDocs.isNotEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('يرجى رفع جميع المستندات المطلوبة'),
          backgroundColor: AppTheme.errorColor,
        ),
      );
      return;
    }

    // For drivers, check vehicle info
    if (activityType == Activities.driver) {
      if (!documentProvider.isVehicleInfoValid()) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('يرجى إدخال معلومات السيارة'),
            backgroundColor: AppTheme.errorColor,
          ),
        );
        return;
      }
    }

    // Continue to verification waiting
    context.push('/verification-waiting');
  }

  void _goBack() {
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          'رفع المستندات',
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
      body: Consumer2<SignupProvider, DocumentProvider>(
        builder: (context, signupProvider, documentProvider, child) {
          final activityType = signupProvider.selectedActivity;
          final requiredDocs = Activities.getRequiredDocuments(activityType ?? '');
          final activityData = Activities.activityDetails[activityType];

          return LoadingOverlay(
            isLoading: documentProvider.isUploading,
            child: SingleChildScrollView(
              padding: EdgeInsets.all(24.w),
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
                    ),
                    child: Column(
                      children: [
                        Icon(
                          _getActivityIcon(activityType ?? ''),
                          color: Color(activityData?['color'] ?? AppTheme.primaryColor.value),
                          size: 32.w,
                        ),
                        SizedBox(height: 8.h),
                        Text(
                          activityData?['nameAr'] ?? activityType ?? '',
                          style: TextStyle(
                            fontSize: 18.sp,
                            fontWeight: FontWeight.bold,
                            color: Color(activityData?['color'] ?? AppTheme.primaryColor.value),
                            fontFamily: 'Cairo',
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 20.h),

                  // Instructions
                  Container(
                    padding: EdgeInsets.all(16.w),
                    decoration: BoxDecoration(
                      color: AppTheme.infoColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12.r),
                      border: Border.all(color: AppTheme.infoColor.withOpacity(0.3)),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          Icons.info_outline,
                          color: AppTheme.infoColor,
                          size: 20.w,
                        ),
                        SizedBox(width: 12.w),
                        Expanded(
                          child: Text(
                            'يرجى رفع جميع المستندات المطلوبة بصيغة واضحة وقابلة للقراءة',
                            style: TextStyle(
                              fontSize: 14.sp,
                              color: AppTheme.infoColor,
                              fontFamily: 'Cairo',
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 20.h),

                  // Required Documents
                  Text(
                    'المستندات المطلوبة',
                    style: TextStyle(
                      fontSize: 18.sp,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.textPrimary,
                      fontFamily: 'Cairo',
                    ),
                  ),

                  SizedBox(height: 16.h),

                  // Document List
                  ...requiredDocs.map((docType) {
                    return _buildDocumentCard(docType, documentProvider);
                  }).toList(),

                  // Vehicle Information for Drivers
                  if (activityType == Activities.driver) ...[
                    SizedBox(height: 30.h),
                    
                    Text(
                      'معلومات السيارة',
                      style: TextStyle(
                        fontSize: 18.sp,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.textPrimary,
                        fontFamily: 'Cairo',
                      ),
                    ),

                    SizedBox(height: 16.h),

                    CustomTextField(
                      controller: _vehicleModelController,
                      label: 'موديل السيارة',
                      prefixIcon: const Icon(Icons.directions_car),
                      onChanged: documentProvider.setVehicleModel,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال موديل السيارة';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 16.h),

                    CustomTextField(
                      controller: _vehicleNumberController,
                      label: 'رقم اللوحة',
                      prefixIcon: const Icon(Icons.pin),
                      onChanged: documentProvider.setVehicleNumber,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال رقم اللوحة';
                        }
                        return null;
                      },
                    ),

                    SizedBox(height: 16.h),

                    CustomTextField(
                      controller: _vehicleColorController,
                      label: 'لون السيارة',
                      prefixIcon: const Icon(Icons.palette),
                      onChanged: documentProvider.setVehicleColor,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'يرجى إدخال لون السيارة';
                        }
                        return null;
                      },
                    ),
                  ],

                  SizedBox(height: 30.h),

                  // Progress Indicator
                  Container(
                    padding: EdgeInsets.all(16.w),
                    decoration: BoxDecoration(
                      color: Colors.grey.shade50,
                      borderRadius: BorderRadius.circular(12.r),
                    ),
                    child: Column(
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              'تقدم الرفع',
                              style: TextStyle(
                                fontSize: 14.sp,
                                fontWeight: FontWeight.w500,
                                fontFamily: 'Cairo',
                              ),
                            ),
                            Text(
                              '${(documentProvider.getUploadProgress(activityType ?? '') * 100).toInt()}%',
                              style: TextStyle(
                                fontSize: 14.sp,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.primaryColor,
                                fontFamily: 'Cairo',
                              ),
                            ),
                          ],
                        ),
                        SizedBox(height: 8.h),
                        LinearProgressIndicator(
                          value: documentProvider.getUploadProgress(activityType ?? ''),
                          backgroundColor: Colors.grey.shade300,
                          valueColor: AlwaysStoppedAnimation<Color>(AppTheme.primaryColor),
                        ),
                      ],
                    ),
                  ),

                  SizedBox(height: 30.h),

                  // Submit Button
                  CustomButton(
                    text: 'إنهاء وإرسال للمراجعة',
                    onPressed: documentProvider.areAllRequiredDocumentsUploaded(activityType ?? '') &&
                              (activityType != Activities.driver || documentProvider.isVehicleInfoValid())
                        ? _submitDocuments
                        : null,
                  ),

                  SizedBox(height: 20.h),
                ],
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildDocumentCard(String docType, DocumentProvider documentProvider) {
    final docData = Activities.documentDetails[docType];
    final isSelected = documentProvider.isDocumentSelected(docType);
    final isUploaded = documentProvider.isDocumentUploaded(docType);

    return Container(
      margin: EdgeInsets.only(bottom: 12.h),
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: isUploaded ? AppTheme.successColor.withOpacity(0.1) : 
               isSelected ? AppTheme.warningColor.withOpacity(0.1) : Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(
          color: isUploaded ? AppTheme.successColor :
                 isSelected ? AppTheme.warningColor : Colors.grey.shade300,
        ),
        boxShadow: [AppTheme.cardShadow],
      ),
      child: Row(
        children: [
          // Document Icon
          Container(
            width: 40.w,
            height: 40.w,
            decoration: BoxDecoration(
              color: isUploaded ? AppTheme.successColor.withOpacity(0.1) :
                     isSelected ? AppTheme.warningColor.withOpacity(0.1) : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(8.r),
            ),
            child: Icon(
              isUploaded ? Icons.check_circle : 
              isSelected ? Icons.upload_file : Icons.description,
              color: isUploaded ? AppTheme.successColor :
                     isSelected ? AppTheme.warningColor : Colors.grey,
              size: 20.w,
            ),
          ),

          SizedBox(width: 12.w),

          // Document Info
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  docData?['nameAr'] ?? docType,
                  style: TextStyle(
                    fontSize: 14.sp,
                    fontWeight: FontWeight.w600,
                    color: AppTheme.textPrimary,
                    fontFamily: 'Cairo',
                  ),
                ),
                if (isSelected) ...[
                  SizedBox(height: 4.h),
                  Text(
                    isUploaded ? 'تم الرفع بنجاح' : 
                    'تم اختياره - ${documentProvider.getDocumentSize(docType)}',
                    style: TextStyle(
                      fontSize: 12.sp,
                      color: isUploaded ? AppTheme.successColor : AppTheme.warningColor,
                      fontFamily: 'Cairo',
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Upload Button
          if (!isUploaded)
            TextButton(
              onPressed: () => _pickDocument(docType),
              child: Text(
                isSelected ? 'تغيير' : 'رفع',
                style: TextStyle(
                  fontSize: 12.sp,
                  color: AppTheme.primaryColor,
                  fontFamily: 'Cairo',
                ),
              ),
            ),
        ],
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
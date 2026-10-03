<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\InquiryController;
use App\Http\Controllers\Api\CustomerReviewController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\JobCardController;
use App\Http\Controllers\Api\OnlineServiceController;
use App\Http\Controllers\Api\BlogController;
use App\Http\Controllers\Api\AboutTimelineController;
use App\Http\Controllers\Api\SubscriberController;
use App\Http\Controllers\Api\CarCompanyController;
use App\Http\Controllers\Api\UserController;

/*
|--------------------------------------------------------------------------
| AUTHENTICATION & USER PROFILE
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/send-otp', [AuthController::class, 'sendOtp']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/complete-profile', [AuthController::class, 'completeProfile']);
    Route::get('/user', [AuthController::class, 'me'])->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/user/logout', [AuthController::class, 'logout']);
    Route::get('/user/get-user-data', [UserController::class, 'getUserData']);
    Route::post('/user/reset-password', [UserController::class, 'changePassword']);
});

/*
|--------------------------------------------------------------------------
| SERVICES (Public & Admin)
|--------------------------------------------------------------------------
*/
Route::get('/services', [ServiceController::class, 'getPublicServices']);
Route::get('/service/services', [ServiceController::class, 'getPublicServices']);
Route::get('/get-service/{id}', [ServiceController::class, 'getSlugService']);
Route::get('/services/{id}', [ServiceController::class, 'getSlugService']);
Route::get('/service/get-service/{id}', [ServiceController::class, 'getSlugService']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::get('/admin/services', [ServiceController::class, 'getAllInquiries']);
    Route::get('/service/admin/services', [ServiceController::class, 'getAllInquiries']);
    Route::post('/admin/create', [ServiceController::class, 'createService']);
    Route::post('/service/create-service', [ServiceController::class, 'createService']);
    Route::post('/admin/upload-media', [ServiceController::class, 'uploadServiceMedia']);
    Route::post('/service/upload-media', [ServiceController::class, 'uploadServiceMedia']);
    Route::match(['put', 'post'], '/admin/update-status', [ServiceController::class, 'updateServiceStatus']);
    Route::match(['put', 'post'], '/service/update-service-status/{id?}', [ServiceController::class, 'updateServiceStatus']);
    Route::delete('/admin/service/{id}', [ServiceController::class, 'deleteService']);
    Route::delete('/service/delete-service/{id}', [ServiceController::class, 'deleteService']);
});

/*
|--------------------------------------------------------------------------
| INQUIRIES (Public & Admin)
|--------------------------------------------------------------------------
*/
Route::post('/service-inquiry', [InquiryController::class, 'createServiceInquiry']);
Route::post('/inquiry/service-inquiry', [InquiryController::class, 'createServiceInquiry']);
Route::post('/inquery/service-inquiry', [InquiryController::class, 'createServiceInquiry']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::match(['get', 'post'], '/admin/admin-inquery-data', [InquiryController::class, 'adminInquiryData']);
    Route::match(['get', 'post'], '/inquery/admin-inquiry-data', [InquiryController::class, 'adminInquiryData']);
    Route::match(['get', 'post'], '/inquery/admin/admin-inquery-data', [InquiryController::class, 'adminInquiryData']);
    Route::match(['get', 'post'], '/inquiry/admin-inquiry-data', [InquiryController::class, 'adminInquiryData']);
    Route::match(['get', 'post'], '/inquiry/admin/admin-inquery-data', [InquiryController::class, 'adminInquiryData']);
    Route::match(['get', 'post'], '/admin/inquiry-details', [InquiryController::class, 'getInquiryDetails']);
    Route::match(['get', 'post'], '/inquery/admin/inquiry-details', [InquiryController::class, 'getInquiryDetails']);
    Route::match(['get', 'post'], '/inquiry/admin/inquiry-details', [InquiryController::class, 'getInquiryDetails']);
    Route::post('/admin/update-inquiry', [InquiryController::class, 'updateInquiryStatus']);
    Route::post('/inquery/admin/update-inquiry', [InquiryController::class, 'updateInquiryStatus']);
    Route::post('/inquiry/admin/update-inquiry', [InquiryController::class, 'updateInquiryStatus']);
    Route::post('/inquery/update-inquiry-status', [InquiryController::class, 'updateInquiryStatus']);
    Route::post('/inquiry/update-inquiry-status', [InquiryController::class, 'updateInquiryStatus']);
    Route::post('/admin/inquiry-export', [InquiryController::class, 'exportCustomerInqueryData']);
    Route::post('/inquery/admin/inquiry-export', [InquiryController::class, 'exportCustomerInqueryData']);
    Route::post('/inquiry/admin/inquiry-export', [InquiryController::class, 'exportCustomerInqueryData']);
});

/*
|--------------------------------------------------------------------------
| CUSTOMER REVIEWS
|--------------------------------------------------------------------------
*/
Route::post('/save-customer-review', [CustomerReviewController::class, 'saveCustomerReview']);
Route::post('/customer-review/save-customer-review', [CustomerReviewController::class, 'saveCustomerReview']);
Route::post('/customer-reviews/save-customer-review', [CustomerReviewController::class, 'saveCustomerReview']);
Route::get('/customer-review/admin/all', [CustomerReviewController::class, 'getAllReviews']);
Route::get('/customer-reviews/admin/all', [CustomerReviewController::class, 'getAllReviews']);
Route::get('/reviews', [CustomerReviewController::class, 'getAllReviews']);
Route::get('/review/reviews', [CustomerReviewController::class, 'getAllReviews']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::match(['put', 'post'], '/customer-review/admin/approve/{id}', [CustomerReviewController::class, 'approveCustomerReview']);
    Route::match(['put', 'post'], '/customer-reviews/admin/approve/{id}', [CustomerReviewController::class, 'approveCustomerReview']);
    Route::match(['put', 'post'], '/review/approve-customer-review/{id}', [CustomerReviewController::class, 'approveCustomerReview']);
});

/*
|--------------------------------------------------------------------------
| GALLERY
|--------------------------------------------------------------------------
*/
Route::get('/gallery', [GalleryController::class, 'getGalleryImages']);
Route::get('/gallery/gallery', [GalleryController::class, 'getGalleryImages']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/gallery/admin/upload', [GalleryController::class, 'uploadGalleryImage']);
    Route::post('/gallery/admin/upload-gallery-image', [GalleryController::class, 'uploadGalleryImage']);
    Route::delete('/gallery/admin/{id}', [GalleryController::class, 'deleteGalleryImage']);
    Route::delete('/gallery/admin/delete-gallery-image/{id}', [GalleryController::class, 'deleteGalleryImage']);
});

/*
|--------------------------------------------------------------------------
| JOB CARDS & CUSTOMER HUD
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/customer/my-cars', [JobCardController::class, 'getMyCars']);
    Route::get('/jobcard/customer/my-cars', [JobCardController::class, 'getMyCars']);
    Route::get('/customer/job-card/{carId}', [JobCardController::class, 'getCustomerJobCard']);
    Route::get('/jobcard/customer/job-card/{carId}', [JobCardController::class, 'getCustomerJobCard']);
});

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::match(['get', 'post'], '/admin/user-cars', [JobCardController::class, 'getUserCars']);
    Route::match(['get', 'post'], '/jobcard/user-cars', [JobCardController::class, 'getUserCars']);
    Route::match(['get', 'post'], '/jobcard/admin/user-cars', [JobCardController::class, 'getUserCars']);
    Route::post('/admin/user-cars/create', [JobCardController::class, 'createUserCar']);
    Route::post('/jobcard/admin/create-user-car', [JobCardController::class, 'createUserCar']);
    Route::get('/admin/get-job-cards', [JobCardController::class, 'adminJobCardList']);
    Route::get('/jobcard/admin/get-job-cards', [JobCardController::class, 'adminJobCardList']);
    Route::get('/jobcard/admin/job-card-list', [JobCardController::class, 'adminJobCardList']);
    Route::get('/admin/get-card/{id}', [JobCardController::class, 'getJobCardById']);
    Route::get('/jobcard/admin/get-card/{id}', [JobCardController::class, 'getJobCardById']);
    Route::get('/admin/user-cars/{userId}', [JobCardController::class, 'getCarsByUser']);
    Route::get('/jobcard/user-cars/{userId}', [JobCardController::class, 'getCarsByUser']);
    Route::get('/jobcard/admin/user-cars/{userId}', [JobCardController::class, 'getCarsByUser']);
    Route::post('/admin/job-card/create', [JobCardController::class, 'createJobCard']);
    Route::post('/jobcard/admin/job-card/create', [JobCardController::class, 'createJobCard']);
    Route::post('/jobcard/admin/create-job-card', [JobCardController::class, 'createJobCard']);
    Route::match(['patch', 'post'], '/admin/jobcard/{id?}/progress', [JobCardController::class, 'updateJobProgress']);
    Route::match(['patch', 'post'], '/jobcard/admin/jobcard/{id?}/progress', [JobCardController::class, 'updateJobProgress']);
    Route::match(['patch', 'post'], '/jobcard/admin/update-progress', [JobCardController::class, 'updateJobProgress']);

    Route::post('/admin/job-services/create', [JobCardController::class, 'createJobService']);
    Route::post('/jobcard/admin/job-services/create', [JobCardController::class, 'createJobService']);
    Route::get('/admin/job-services/{jobId}', [JobCardController::class, 'getJobServicesByJob']);
    Route::get('/jobcard/admin/job-services/{jobId}', [JobCardController::class, 'getJobServicesByJob']);
    Route::delete('/admin/job-services/{id}', [JobCardController::class, 'deleteJobService']);
    Route::delete('/jobcard/admin/job-services/{id}', [JobCardController::class, 'deleteJobService']);

    Route::get('/admin/job-cards/{jobId}/get-media', [JobCardController::class, 'getJobMedia']);
    Route::get('/jobcard/admin/job-cards/{jobId}/get-media', [JobCardController::class, 'getJobMedia']);
    Route::post('/admin/job-cards/{jobId}/media', [JobCardController::class, 'uploadJobMedia']);
    Route::post('/jobcard/admin/job-cards/{jobId}/media', [JobCardController::class, 'uploadJobMedia']);
    Route::delete('/admin/job-cards/{jobId}/media/{mediaId}', [JobCardController::class, 'deleteJobMedia']);
    Route::delete('/jobcard/admin/job-cards/{jobId}/media/{mediaId}', [JobCardController::class, 'deleteJobMedia']);
});

/*
|--------------------------------------------------------------------------
| BLOGS
|--------------------------------------------------------------------------
*/
Route::get('/blog/published', [BlogController::class, 'displayPublishedBlogs']);
Route::get('/blog/blogs/{slug}', [BlogController::class, 'showSlugWiseBlog']);
Route::post('/blog/like-toggle/{id}', [BlogController::class, 'likeBlogToggle'])->middleware('auth:sanctum');

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::match(['get', 'post'], '/blog/admin/blogs', [BlogController::class, 'displayBlog']);
    Route::post('/blog/admin/create-blog', [BlogController::class, 'creteAdminBlog']);
    Route::post('/blog/create-blog', [BlogController::class, 'creteAdminBlog']);
    Route::post('/blog/admin/update-status', [BlogController::class, 'changeBlogStatus']);
    Route::post('/blog/change-blog-status/{id?}', [BlogController::class, 'changeBlogStatus']);
});

/*
|--------------------------------------------------------------------------
| ABOUT TIMELINE
|--------------------------------------------------------------------------
*/
Route::get('/about-timeline', [AboutTimelineController::class, 'getTimeline']);
Route::get('/about-timeline/about-timeline', [AboutTimelineController::class, 'getTimeline']);
Route::get('/about-timeline/{id}', [AboutTimelineController::class, 'getSingleTimeline']);
Route::get('/about-timeline/about-timeline/{id}', [AboutTimelineController::class, 'getSingleTimeline']);

Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/create-about-timeline', [AboutTimelineController::class, 'createTimeline']);
    Route::post('/about-timeline/create-timeline', [AboutTimelineController::class, 'createTimeline']);
    Route::post('/about-timeline/admin/create-about-timeline', [AboutTimelineController::class, 'createTimeline']);
    Route::put('/admin/update-about-timeline', [AboutTimelineController::class, 'updateTimeline']);
    Route::put('/about-timeline/admin/update-about-timeline', [AboutTimelineController::class, 'updateTimeline']);
    Route::post('/about-timeline/admin/update-about-timeline', [AboutTimelineController::class, 'updateTimeline']);
    Route::delete('/admin/delete-about-timeline/{id}', [AboutTimelineController::class, 'deleteTimeline']);
    Route::delete('/about-timeline/admin/delete-about-timeline/{id}', [AboutTimelineController::class, 'deleteTimeline']);
    Route::post('/about-timeline/admin/delete-timeline-image', [AboutTimelineController::class, 'deleteTimelineImage']);
});

/*
|--------------------------------------------------------------------------
| NEWSLETTER SUBSCRIBERS
|--------------------------------------------------------------------------
*/
Route::post('/subscribe', [SubscriberController::class, 'saveSubscription']);
Route::post('/subscribe/subscribe', [SubscriberController::class, 'saveSubscription']);
Route::match(['get', 'post'], '/admin/subscribe', [SubscriberController::class, 'showSubscriptionData'])->middleware(['auth:sanctum', 'admin']);
Route::match(['get', 'post'], '/subscribe/admin/subscribe', [SubscriberController::class, 'showSubscriptionData'])->middleware(['auth:sanctum', 'admin']);
Route::match(['get', 'post'], '/subscribe/admin/subscribers', [SubscriberController::class, 'showSubscriptionData'])->middleware(['auth:sanctum', 'admin']);

/*
|--------------------------------------------------------------------------
| CAR COMPANIES & MODELS
|--------------------------------------------------------------------------
*/
Route::get('/companies', [CarCompanyController::class, 'getCarCompay']);
Route::get('/car-companies/companies', [CarCompanyController::class, 'getCarCompay']);
Route::get('/car-companies/get-car-compay', [CarCompanyController::class, 'getCarCompay']);
Route::get('/car-companies/get-car-company', [CarCompanyController::class, 'getCarCompay']);
Route::get('/{companyId}/car-models', [CarCompanyController::class, 'getCarModels']);
Route::get('/car-companies/{companyId}/car-models', [CarCompanyController::class, 'getCarModels']);
Route::get('/car-companies/get-car-models/{companyId}', [CarCompanyController::class, 'getCarModels']);

/*
|--------------------------------------------------------------------------
| ADMIN USER MANAGEMENT & STATS
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::match(['get', 'post'], '/admin/user-data', [UserController::class, 'allUsers']);
    Route::match(['get', 'post'], '/user/admin/user-data', [UserController::class, 'allUsers']);
    Route::match(['get', 'post'], '/user/admin/all-users', [UserController::class, 'allUsers']);
    Route::match(['get', 'post'], '/admin/dashboard-stats', [UserController::class, 'getDashboardDataCount']);
    Route::match(['get', 'post'], '/user/admin/dashboard-stats', [UserController::class, 'getDashboardDataCount']);
    Route::post('/admin/user-export', [UserController::class, 'exportUsersData']);
    Route::post('/user/admin/user-export', [UserController::class, 'exportUsersData']);
    Route::post('/admin/update-status', [UserController::class, 'changeUserStatus']);
    Route::post('/admin/update-user-status', [UserController::class, 'changeUserStatus']);
    Route::post('/user/admin/update-status', [UserController::class, 'changeUserStatus']);
    Route::post('/user/admin/change-status', [UserController::class, 'changeUserStatus']);
    Route::post('/admin/update-user-data', [UserController::class, 'updateUserData']);
    Route::post('/user/admin/update-user-data', [UserController::class, 'updateUserData']);
    Route::get('/admin/get-user-job', [UserController::class, 'getUsersForJob']);
    Route::get('/user/admin/get-user-job', [UserController::class, 'getUsersForJob']);
});

/*
|--------------------------------------------------------------------------
| ONLINE SERVICES & PACKAGES
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/admin/online-category-create', [OnlineServiceController::class, 'createCategory']);
    Route::post('/online-service/admin/online-category-create', [OnlineServiceController::class, 'createCategory']);
    Route::get('/admin/online-category', [OnlineServiceController::class, 'getCategories']);
    Route::get('/online-service/admin/online-category', [OnlineServiceController::class, 'getCategories']);
    Route::get('/online-service/categories', [OnlineServiceController::class, 'getCategories']);
    Route::put('/admin/online-category/{id}', [OnlineServiceController::class, 'updateCategory']);
    Route::put('/online-service/admin/online-category/{id}', [OnlineServiceController::class, 'updateCategory']);
    Route::delete('/admin/online-category/{id}', [OnlineServiceController::class, 'deleteCategory']);
    Route::delete('/online-service/admin/online-category/{id}', [OnlineServiceController::class, 'deleteCategory']);

    Route::post('/admin/online-service-create', [OnlineServiceController::class, 'createService']);
    Route::post('/online-service/admin/online-service-create', [OnlineServiceController::class, 'createService']);
    Route::put('/admin/online-service-update/{id}', [OnlineServiceController::class, 'updateService']);
    Route::put('/online-service/admin/online-service-update/{id}', [OnlineServiceController::class, 'updateService']);
    Route::delete('/admin/online-service-delete/{id}', [OnlineServiceController::class, 'deleteService']);
    Route::delete('/online-service/admin/online-service-delete/{id}', [OnlineServiceController::class, 'deleteService']);

    Route::post('/admin/package-create', [OnlineServiceController::class, 'createPackage']);
    Route::post('/online-service/admin/package-create', [OnlineServiceController::class, 'createPackage']);
    Route::put('/admin/package-update/{id}', [OnlineServiceController::class, 'updatePackage']);
    Route::put('/online-service/admin/package-update/{id}', [OnlineServiceController::class, 'updatePackage']);
    Route::delete('/admin/package-delete/{id}', [OnlineServiceController::class, 'deletePackage']);
    Route::delete('/online-service/admin/package-delete/{id}', [OnlineServiceController::class, 'deletePackage']);

    Route::post('/admin/addon-create', [OnlineServiceController::class, 'createAddon']);
    Route::post('/online-service/admin/addon-create', [OnlineServiceController::class, 'createAddon']);
    Route::put('/admin/addon-update/{id}', [OnlineServiceController::class, 'updateAddon']);
    Route::put('/online-service/admin/addon-update/{id}', [OnlineServiceController::class, 'updateAddon']);
    Route::delete('/admin/addon-delete/{id}', [OnlineServiceController::class, 'deleteAddon']);
    Route::delete('/online-service/admin/addon-delete/{id}', [OnlineServiceController::class, 'deleteAddon']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/online-category/{id}', [OnlineServiceController::class, 'getCategoryById']);
    Route::get('/online-service/{id}', [OnlineServiceController::class, 'getCategoryById']);
    Route::get('/admin/get-online-service/{id}', [OnlineServiceController::class, 'getServiceById']);
    Route::get('/online-service/admin/get-online-service/{id}', [OnlineServiceController::class, 'getServiceById']);
    Route::get('/admin/list-online-service', [OnlineServiceController::class, 'getServices']);
    Route::get('/online-service/admin/list-online-service', [OnlineServiceController::class, 'getServices']);
    Route::get('/admin/package', [OnlineServiceController::class, 'getPackages']);
    Route::get('/online-service/admin/package', [OnlineServiceController::class, 'getPackages']);
    Route::get('/admin/package/{id}', [OnlineServiceController::class, 'getPackageById']);
    Route::get('/online-service/admin/package/{id}', [OnlineServiceController::class, 'getPackageById']);
    Route::get('/admin/addon', [OnlineServiceController::class, 'getAddons']);
    Route::get('/online-service/admin/addon', [OnlineServiceController::class, 'getAddons']);
    Route::get('/admin/addon/{id}', [OnlineServiceController::class, 'getAddonById']);
    Route::get('/online-service/admin/addon/{id}', [OnlineServiceController::class, 'getAddonById']);
});


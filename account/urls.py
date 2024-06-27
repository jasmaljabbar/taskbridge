from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, HomeView, LogoutView, LoginView, VerifyOTP,ResendOtpView,Tasker_ListingView,TaskCategory_ListingView

urlpatterns = [
    path("api/login/", LoginView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/register/", RegisterView.as_view(), name="sign_up"),
    path('api/validate-otp', VerifyOTP.as_view(), name='validate_otp'),
    path('api/resend-otp', ResendOtpView.as_view(), name='resend_otp'),
    path("api/home/", HomeView.as_view(), name="home"),
    path("api/taskcategory/", TaskCategory_ListingView.as_view(), name="home"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
    path("api/taskers/", Tasker_ListingView.as_view(), name="taskers"),
]

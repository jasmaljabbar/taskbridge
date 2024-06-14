from django.urls import path
from rest_framework_simplejwt.views import  TokenRefreshView
from .views import RegisterView, HomeView, LogoutView,LoginView

urlpatterns = [
    path("api/login/", LoginView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/register/", RegisterView.as_view(), name="sign_up"),
    path("api/home/", HomeView.as_view(), name="home"),
    path("api/logout/", LogoutView.as_view(), name="logout"),
]

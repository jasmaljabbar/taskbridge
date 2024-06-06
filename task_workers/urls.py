from django.urls import path
from .views import TaskerRegisterView

urlpatterns = [
    path('register/', TaskerRegisterView.as_view(), name='tasker-register'),
]

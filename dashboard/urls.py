from django.urls import path 
from .views import *


urlpatterns = [
    path('UserProfileDetailView/<int:pk>/', UserIndvualViewPermsion.as_view(), name='user-profile-detail'),
    path('employeeindividualPermission/<int:pk>/', EmployeesIndvualViewPermsion.as_view(), name='employee-list'),
]
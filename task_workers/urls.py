from django.urls import path
from .views import TaskerSignupView,TaskerProfileView,TaskerProfileUpdateView,Work_Listing

urlpatterns = [
    path('become_tasker/', TaskerSignupView.as_view(), name='tasker_signup'),
    path('profile/', TaskerProfileView.as_view(), name='tasker-profile'),
    path('TaskerProfile/', TaskerProfileView.as_view(), name='tasker-profile'),
    path('update/', TaskerProfileUpdateView.as_view(), name='tasker-profile-update'),
    path('workcategory/', Work_Listing.as_view(), name='tasker-profile-update'),
]

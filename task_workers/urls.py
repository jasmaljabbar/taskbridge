from django.urls import path
from .views import TaskerSignupView, WorkCategoryListView

urlpatterns = [
    path('become_tasker/', TaskerSignupView.as_view(), name='tasker_signup'),
    # path('login/', LoginView.as_view(), name='login'),
    path('workcategories/', WorkCategoryListView.as_view(), name='workcategory-list'),
]

from django.urls import path
from adminside.views import AdminLogin, Dashboard,Block_user, Blocking_tasker,Accepting_request, EditUser, Tasker_Listing,Work_Listing,WorkCategoryAdding

urlpatterns = [
    path("admin_login/", AdminLogin.as_view(), name="admin_login"),
    path("dashboard/", Dashboard.as_view(), name="dashboard"),
    path("accepting_request/", Accepting_request.as_view(), name="accepting_request"),
    path("blocking_tasker/", Blocking_tasker.as_view(), name="blocking_tasker"),
    path("user_action/", Block_user.as_view(), name="user_action"),
    path("edit_user/<int:id>", EditUser.as_view(), name="edit_user"),
    path("tasker_listing/", Tasker_Listing.as_view(), name="tasker_listing"),
    path("workcategory/", Work_Listing.as_view(), name="workercategory"),
    path('add_workcategory/', WorkCategoryAdding.as_view(), name='add-workcategory'),
]

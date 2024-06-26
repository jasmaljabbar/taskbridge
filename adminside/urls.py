from django.urls import path
from adminside.views import AdminLogin, Dashboard, DeleteUser, EditUser, Tasker_Listing,Work_Listing,Work_category_adding

urlpatterns = [
    path("admin_login/", AdminLogin.as_view(), name="admin_login"),
    path("dashboard/", Dashboard.as_view(), name="dashboard"),
    path("delete_user/", DeleteUser.as_view(), name="delete_user"),
    path("edit_user/<int:id>", EditUser.as_view(), name="edit_user"),
    path("tasker_listing/", Tasker_Listing.as_view(), name="tasker_listing"),
    path("workcategory/", Work_Listing.as_view(), name="workercategory"),
    path('add_workcategory/', Work_category_adding.as_view(), name='add-workcategory'),
]

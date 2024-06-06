from django.urls import path
from adminside.views import AdminLogin, Dashboard, DeleteUser, EditUser

urlpatterns = [
    path("admin_login/", AdminLogin.as_view(), name="admin_login"),
    path("dashboard/", Dashboard.as_view(), name="dashboard"),
    path("delete_user/", DeleteUser.as_view(), name="delete_user"),
    path("edit_user/<int:id>", EditUser.as_view(), name="edit_user"),
]

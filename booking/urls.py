from django.urls import path
from .views import CreateAppointmentAPIView,AppointmentHistory,TaskerAppointmentHistoryView,ManageAppointmentStatusView

urlpatterns = [
    path('appointments/', CreateAppointmentAPIView.as_view(), name='appointment-create'),
    path('appointment/history/', AppointmentHistory.as_view(), name='appointment-history'),
    path('appointment/taskerHistory/', TaskerAppointmentHistoryView.as_view(), name='appointmentTasker-history'),
     path('appointment/manage/<int:appointment_id>/<str:new_status>/', ManageAppointmentStatusView.as_view(), name='manage_appointment_status'),
]
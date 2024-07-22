from rest_framework import generics, permissions
from booking.models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.response import Response
from rest_framework import status
from django.views import View
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from account.utils import send_tasker_email
from django.core.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.mixins import LoginRequiredMixin
from account.utils import send_user_appointment_email


class CreateAppointmentAPIView(generics.CreateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print("Incoming data:", request.data)
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)

        # Retrieve user and employee emails
        appointment = serializer.instance
        user = appointment.user
        employee_email = appointment.employee.email
        print(employee_email)
        # Send notification emails
        send_tasker_email(employee_email, user)

        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class UpdateAppointmentAPIView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        print("Incoming data for update:", request.data)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_update(serializer)

        # Retrieve user and employee emails
        appointment = serializer.instance
        user = appointment.user
        employee_email = appointment.employee.email
        print("Updated employee email:", employee_email)
        
        # Send notification emails
        send_tasker_email(employee_email, user)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def perform_update(self, serializer):
        serializer.save()

class CancelAppointmentAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        appointment_id = kwargs.get('appointment_id')
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            if appointment.status == 'canceled':
                return Response({"detail": "Appointment is already canceled."}, status=status.HTTP_400_BAD_REQUEST)
            
            appointment.status = 'canceled'
            appointment.save()

            # Send notification emails
            user = appointment.user
            employee_email = appointment.employee.email
            print("Canceled employee email:", employee_email)
            send_tasker_email(employee_email, user)

            return Response({"detail": "Appointment canceled successfully."}, status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({"detail": "Appointment not found."}, status=status.HTTP_404_NOT_FOUND)


class AppointmentHistory(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):        
        return Appointment.objects.filter(user=self.request.user)
    
class TaskerAppointmentHistoryView(generics.ListAPIView):
    serializer_class = AppointmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Appointment.objects.filter(employee=user)
    
class ManagingAppointment:
    def __init__(self, tasker):
        self.tasker = tasker

    def accept_appointment(self, appointment, email, info):
        if appointment.employee != self.tasker:
            raise PermissionDenied("You do not have permission to accept this appointment.")
        appointment.status = Appointment.ACCEPTED
        appointment.save()
        send_user_appointment_email(email, 'accepted', info)
        return appointment

    def reject_appointment(self, appointment, email, info):
        if appointment.employee != self.tasker:
            raise PermissionDenied("You do not have permission to reject this appointment.")
        appointment.status = Appointment.REJECTED
        appointment.save()
        send_user_appointment_email(email, 'rejected', info)
        return appointment


class ManageAppointmentStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, appointment_id, new_status):
        try:
            appointment = Appointment.objects.get(id=appointment_id)
            if new_status not in [Appointment.PENDING, Appointment.ACCEPTED, Appointment.REJECTED]:
                return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
                
            appointment.status = new_status
            info_data = request.data
            info = info_data.get('info', '')
            if new_status == 'accepted':
                info='Congratulations! your appointment is accepted'+' ' + info
            elif new_status == 'rejected':
                info='Sorry! your appointment is rejected' + ' ' + info
            
            send_user_appointment_email(appointment.user.email, 'rejected', info)
            appointment.save()
            return Response({"status": "success", "new_status": new_status}, status=status.HTTP_200_OK)
        except Appointment.DoesNotExist:
            return Response({"error": "Appointment not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

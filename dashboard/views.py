from django.shortcuts import render
from rest_framework import generics , status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser , IsAuthenticated , AllowAny
from . serializer import EmployeeIndvualSerializers,UserIndvualSerializers
from task_workers.models import Tasker
from profiles.models import Profile

# Create your views here.


@permission_classes([IsAuthenticated])
class EmployeesIndvualViewPermsion(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EmployeeIndvualSerializers
    def get_queryset(self):
        return Tasker.objects.filter(user__is_staff=True)  



class UserIndvualViewPermsion(generics.RetrieveAPIView):
    queryset = Profile.objects.all()
    serializer_class = UserIndvualSerializers
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.queryset.get(user__id=self.kwargs['pk'])
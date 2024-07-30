from django.shortcuts import render
from rest_framework import generics , status
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAdminUser , IsAuthenticated , AllowAny
from . serializer import EmployeeIndvualSerializers,UserIndvualSerializers,CountSerializer,TaskerSubscriptionSerializer
from task_workers.models import Tasker
from rest_framework.response import Response
from account.models import UserData
from django.conf import settings
from django.contrib.auth import get_user_model
from . models import SubscriptionIncome
from django.utils import timezone
from datetime import timedelta
from profiles.models import Profile
from task_workers.models import Tasker,SubscriptionPrice 
from task_workers.serializers import TaskerSerializer
from rest_framework.views import APIView
from django.db.models import Count
from django.db.models.functions import TruncMonth


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


class UserWorkerCountView(APIView):
    permission_classes = [IsAuthenticated]  # Adjust the permissions as needed

    def get(self, request, *args, **kwargs):
        users_count = UserData.objects.count()
        workers_count = Tasker.objects.count()
        data = {
            'users_count': users_count,
            'workers_count': workers_count
        }
        serializer = CountSerializer(data=data)
        serializer.is_valid()  # You might need this to ensure data is valid
        return Response(serializer.data)
    


class Worker_mothely_subscribed(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        worker_monthly_subscribe = Tasker.objects.filter(subscribed=True, subscription_type='monthly')
        serializer = TaskerSerializer(worker_monthly_subscribe, many=True)
        return Response(serializer.data)
    


class SubscriptionIncomeDashboard(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        income = SubscriptionIncome.objects.first()
        if not income:
            income = SubscriptionIncome.objects.create()

        data = {
            'monthly_subscription_income': income.monthly_subscription_income,
            'yearly_subscription_income': income.yearly_subscription_income,
        }
        print(data)
        return Response(data)






class TaskerSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        subscriptions = Tasker.objects.filter(subscribed=True)
        serializer = TaskerSubscriptionSerializer(subscriptions, many=True)
        return Response(serializer.data)
    


User = get_user_model()

class UserDistributionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        total_users = User.objects.count()
        taskers = Tasker.objects.count()
        regular_users = total_users - taskers

        data = {
            'regular_users': regular_users,
            'taskers': taskers
        }
        return Response(data)

class UserGrowthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user_growth = UserData.objects.annotate(
            month=TruncMonth('date_joined')
        ).values('month').annotate(
            users=Count('id')
        ).order_by('month')

        data = [
            {
                'date': entry['month'].strftime('%Y-%m-%d'),
                'users': entry['users']
            }
            for entry in user_growth
        ]
        return Response(data)
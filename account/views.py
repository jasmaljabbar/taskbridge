from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer,LoginSerializer,TaskerHomeSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .utils import generate_otp,send_otp_email
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import UserData
from rest_framework_simplejwt.views import TokenObtainPairView
from task_workers.models import Tasker
from task_workers.models import WorkCategory
from task_workers.serializers import WorkCategorySerializer,TaskerFetchingSerializer



class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    
class VerifyOTP(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_entered = request.data.get('otp')

        try:
            user = UserData.objects.get(email=email, otp=otp_entered)
            print('email:',email, 'otp:',otp_entered)
            if user.otp_time:
                current_time = timezone.now()
                otp_time = user.otp_time

                # Check if the OTP is within 1 minutes
                if current_time - otp_time > timedelta(minutes=1):
                    return Response({'detail': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

            user.is_verified = True
            user.otp = None
            user.otp_time = None
            user.save()


            return Response({'message': 'Email verified successfully.'}, 
                              status=status.HTTP_200_OK)
        except UserData.DoesNotExist:
            return Response({'detail': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)



class RegisterView(APIView):
     def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            otp = generate_otp()
            user.otp = otp
            user.otp_time = timezone.now()
            print(otp)
            user.save()

            send_otp_email(user.email, otp)

            return Response({'message': 'User registered successfully. OTP sent to your email.'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
class ResendOtpView(APIView):
    def post(self, request):
        email = request.data.get('email')

        try:
            user = UserData.objects.get(email=email)

            otp = generate_otp()
            user.otp = otp
            user.otp_time = timezone.now()
            print(otp)
            user.save()

            send_otp_email(user.email, otp)

            return Response({'message': 'New OTP sent to your email.'}, status=status.HTTP_200_OK)
        except UserData.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)
    

class HomeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        user_info = {
            "username": user.name,
            "email": user.email,
        }
        content = {"user": user_info}
        return Response(content)


class Tasker_ListingView(APIView):
    def get(self,request):
        taskers = Tasker.objects.filter(user__is_staff=True)[:9]
        serializer = TaskerHomeSerializer(taskers, many=True)
        return Response(serializer.data)
    
class TaskCategory_ListingView(APIView):
    def get(self,request):
        taskCategoty = WorkCategory.objects.all()
        serializer = WorkCategorySerializer(taskCategoty, many=True)
        return Response(serializer.data)
  
class Category_Tasker_filter(APIView):
    def get(self, request, taskId, *args, **kwargs):
        try:
            workCategory = WorkCategory.objects.get(id = taskId)
            taskers = Tasker.objects.filter(task=workCategory)
            serializer = TaskerHomeSerializer(taskers, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Tasker.DoesNotExist:
            return Response({"error": "Tasker not found"}, status=status.HTTP_404_NOT_FOUND)
        
class SearchTasker(APIView):
    def get(self, request, *args, **kwargs):

        query = request.query_params.get('query', '')
        taskers = Tasker.objects.filter(full_name__icontains=query) | Tasker.objects.filter(task__name__icontains=query)
        
        serializer = TaskerHomeSerializer(taskers, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class TaskerDetails(APIView):
    permission_classes = [IsAuthenticated]
    print(permission_classes)
    def get(self, request, user_id):
        try:
            tasker = Tasker.objects.get(user__id=user_id)
            serializer = TaskerFetchingSerializer(tasker)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Tasker.DoesNotExist:
            return Response({"error": "Tasker not found"}, status=status.HTTP_404_NOT_FOUND)
        


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data.get("refreshToken")
            if refresh_token:
                RefreshToken(refresh_token).blacklist()
                return Response(status=status.HTTP_205_RESET_CONTENT)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

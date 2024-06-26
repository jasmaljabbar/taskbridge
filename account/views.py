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

                # Check if the OTP is within 5 minutes
                if current_time - otp_time > timedelta(minutes=1):
                    return Response({'detail': 'OTP expired'}, status=status.HTTP_400_BAD_REQUEST)

            user.is_verified = True

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
        taskers = Tasker.objects.all()
        serializer = TaskerHomeSerializer(taskers, many=True)
        return Response(serializer.data)

        


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

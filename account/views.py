from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer,LoginSerializer,OtpSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .utils import generate_otp,send_otp_email
from django.core.exceptions import ObjectDoesNotExist
from django.conf import settings
from .models import UserData
from rest_framework_simplejwt.views import TokenObtainPairView

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    
class VerifyOTP(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_entered = request.data.get('otp')

        try:
            user = UserData.objects.get(email=email, otp=otp_entered)
            print('email:',email, 'otp:',otp_entered)
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
            print(otp)
            user.save()

            send_otp_email(user.email, otp)

            return Response({'message': 'User registered successfully. OTP sent to your email.'}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
# class OtpView(APIView):
#     def post(self, request):
#         print("Request data:", request.data)  # Debug print statement

#         # Ensure request.data is a dictionary
#         # if not isinstance(request.data, dict):
#         #     return Response({'error': 'Invalid data format'}, status=status.HTTP_400_BAD_REQUEST)
        
#         # Get the OTP and email from the request data
#         user_email = request.data.get('email')
#         print("email:",user_email)
#         otp_data = localstorage.email.get('otp')

#         if otp_data is None or user_email is None:
#             return Response({'error': 'OTP and email are required'}, status=status.HTTP_400_BAD_REQUEST)

#         # Pass the OTP data to the serializer
#         serializer_otp = OtpSerializer(data={'otp': otp_data})

#         # Validate the serializer data
#         if serializer_otp.is_valid():
#             validated_data = serializer_otp.validated_data
#             otp_value = validated_data['otp']

#             try:
#                 # Retrieve the user data based on the email
#                 user_data = UserData.objects.get(email=user_email)
                
#                 # Check if the OTP matches
#                 if user_data.otp == otp_value:
#                     print(user_data)
#                     print(otp_value)
#                     return Response(validated_data, status=status.HTTP_200_OK)
#                 else:
#                     return Response({'error': 'Invalid OTP'}, status=status.HTTP_400_BAD_REQUEST)
#             except ObjectDoesNotExist:
#                 return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
#         else:
#             return Response(serializer_otp.errors, status=status.HTTP_400_BAD_REQUEST)

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

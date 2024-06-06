from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
import os
from django.conf import settings

class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class HomeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        user_info = {
            "username": user.name,
            "email": user.email,
            "profile_pic": user.profile_pic.url if user.profile_pic else None,
        }
        content = {"user": user_info}
        return Response(content)

    def post(self, request):
        user = request.user
        image_file = request.data.get("image")

        if user.profile_pic:
            old_profile_pic_path = os.path.join(settings.MEDIA_ROOT, str(user.profile_pic))
            if os.path.exists(old_profile_pic_path):
                os.remove(old_profile_pic_path)

        user.profile_pic = image_file
        user.save()
        return Response(status=status.HTTP_200_OK)



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

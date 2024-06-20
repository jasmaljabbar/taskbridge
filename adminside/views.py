from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import status
from django.contrib.auth import authenticate
from rest_framework.response import Response
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from account.models import UserData
from .serializers import UserDataSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


class AdminLogin(APIView):

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response(
                {"error": "Email and password are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(email=email, password=password)

        if user is not None and user.is_staff:

            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_200_OK,
            )
        else:

            return Response(
                {"error": "Invalid credentials or user is not an admin."},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class Dashboard(APIView):

    def get(self, request):
        users = UserData.objects.filter(is_staff=False)

        serializer = UserDataSerializer(users, many=True)
        return Response(serializer.data)


class DeleteUser(APIView):

    def post(self, request):
        user_id = request.data.get("id")
        try:
            user = UserData.objects.get(id=user_id)
            user.delete()
            return Response({"Success": "User Deleted"}, status=status.HTTP_200_OK)
        except UserData.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )


class EditUser(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):
        user = get_object_or_404(UserData, id=id)
        try:
            user.name = request.data.get("name")
            user.email = request.data.get("email")
            password = request.data.get("password")
            confirm_password = request.data.get("confirm_password")

            # Check if the email already exists for another user
            existing_user = (
                UserData.objects.exclude(id=user.id).filter(email=user.email).exists()
            )
            if existing_user:
                return Response(
                    {"email": ["Email already exists"]},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Check if password and confirm_password are provided and match
            if password and confirm_password:
                if password != confirm_password:
                    return Response(
                        {"password": ["Passwords do not match"]},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                else:
                    user.set_password(password)

            user.save()
            return Response({"Success": "User Updated"}, status=status.HTTP_200_OK)
        except UserData.DoesNotExist:
            return Response(
                {"error": "User does not exist"}, status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class Tasker_Listing(APIView):
    def get(self, request):
        users = UserData.objects.filter(is_staff=True,is_superuser = False)

        serializer = UserDataSerializer(users, many=True)
        return Response(serializer.data)
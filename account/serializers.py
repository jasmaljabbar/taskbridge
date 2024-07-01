from rest_framework import serializers
from rest_framework_simplejwt.tokens import Token
from .models import UserData
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed
from task_workers.models import Tasker

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ['id', 'email', 'name', 'password', 'is_verified', 'otp']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = UserData.objects.create_user(**validated_data)
        return user

class OtpSerializer(serializers.Serializer):
    otp = serializers.CharField(max_length=6)


class LoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        data = super().validate(attrs)

        user = self.user

        # Bypass the is_verified check for superusers (admins)
        if not user.is_verified and not user.is_superuser:
            raise AuthenticationFailed('Account is not verified.')

        refresh = self.get_token(self.user)

        data['refresh'] = str(refresh)
        data['access'] = str(refresh.access_token)

        data['name'] = user.name
        data['email'] = user.email
        data['is_staff'] = user.is_staff
        data['is_admin'] = user.is_superuser  
        data['requested_to_tasker'] = user.requested_to_tasker

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['is_admin'] = user.is_superuser  
        return token

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['name'] = user.name
        token['email'] = user.email
        token['is_staff'] = user.is_staff
        token['is_admin'] = user.is_superuser  
        return token


class TaskerHomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tasker
        fields = [
            "user",
            "full_name",
            "phone_number",
            "aadhar_number",
            "address",
            "work_photo",
            "task",
            "task_fee",
            "city",
            "state",
            
        ]

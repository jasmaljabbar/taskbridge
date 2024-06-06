from rest_framework import serializers
from account.models import UserData


class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = [
            "id",
            "name",
            "email",
            "date_joined",
            "is_admin",
            "is_active",
            "is_staff",
            "is_superuser",
            "profile_pic",
        ]

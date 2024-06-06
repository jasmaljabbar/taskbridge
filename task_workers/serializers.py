from rest_framework import serializers
from account.models import Tasker
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']

class TaskerSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Tasker
        fields = ['user', 'full_name', 'phone_number', 'tasks']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        tasker = Tasker.objects.create(user=user, **validated_data)
        return tasker

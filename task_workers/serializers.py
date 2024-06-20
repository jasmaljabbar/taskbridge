from rest_framework import serializers
from .models import Tasker, WorkCategory
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name']

class WorkCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkCategory
        fields = ['id', 'name', 'description']

class TaskerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    tasks = serializers.PrimaryKeyRelatedField(queryset=WorkCategory.objects.all(), many=True)

    class Meta:
        model = Tasker
        fields = [
            'user', 'full_name', 'phone_number','aadhar_number', 'tasks',
            'city', 'state', 'address', 'service_charge'
        ]

    def create(self, validated_data):
        user = self.context['request'].user
        tasks_data = validated_data.pop('tasks')
        tasker = Tasker.objects.create(user=user, **validated_data)
        tasker.tasks.set(tasks_data)  # Add existing tasks to the tasker
        return tasker

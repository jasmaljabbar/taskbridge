from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from task_workers.models import Tasker,WorkCategory
from profiles.models import Profile


class EmployeeIndvualSerializers(ModelSerializer):
    service = WorkCategory
    class Meta:
        model = Tasker
        fields = ['id','user', 'full_name', 'phone_number', 'aadhar_number', 'task', 'task_fee',
            'city', 'state', 'address', 'work_photo']
    read_only_fields = ["id"]



class UserIndvualSerializers(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  

    class Meta:
        model = Profile
        fields = ['id', 'user', 'phone_number', 'profile_photo']
        read_only_fields = ["id"]

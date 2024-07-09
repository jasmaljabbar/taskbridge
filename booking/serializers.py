from rest_framework import serializers
from .models import Appointment
from profiles.models import Profile
from django.contrib.auth import get_user_model
from task_workers.models import Tasker  # Import the Tasker model

User = get_user_model()

class AppointmentSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=True)
    user = serializers.HiddenField(default=serializers.CurrentUserDefault())

    class Meta:
        model = Appointment
        fields = ['id','user', 'employee', 'minimum_hours_to_work', 'address', 'phone_number', 'date','status']

    def validate_employee(self, value):
        if not User.objects.filter(id=value.id, is_staff=True).exists():  # Assuming staff users are employees
            raise serializers.ValidationError("Invalid employee ID. This user is not an employee.")
        return value
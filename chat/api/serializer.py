from chat.models import Chat
from rest_framework.serializers import ModelSerializer
from account.models import UserData
from task_workers.models import Tasker
from rest_framework import serializers
from rest_framework.serializers import Serializer, IntegerField, CharField, ImageField


class UserChatSeralizer(ModelSerializer):
    class Meta:
        model = UserData
        fields = ['id','name','profile_pic']


class EmployeeChatSeralizer(ModelSerializer):
    class Meta:
        model = Tasker
        fields = ['id']

        
class ChatSerializer(ModelSerializer):
    sender = UserChatSeralizer(read_only = True)
    receiver = UserChatSeralizer(read_only = True)
    class Meta:
        model = Chat
        fields = ['id','sender','receiver','message','date','is_read']

        

class EmployeeChatSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    images = serializers.ImageField(allow_null=True, required=False)
    read_only_fields = ["id"]


class UserChatSerializer(Serializer):
    id = IntegerField()
    first_name = CharField(max_length=100)
    last_name = CharField(max_length=100)
    images = ImageField(allow_null=True, required=False)

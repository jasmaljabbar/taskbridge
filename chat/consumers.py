import json
from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from chat.models import Chat
from channels.db import database_sync_to_async

class TextConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        sender_id, recipient_id = self.room_name.split('_')

        # Creating room
        self.room_group_name = f"chat_{min(sender_id, recipient_id)}_{max(sender_id, recipient_id)}"

        # Join the room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, code):
        # Leave the room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
        await super().disconnect(code)

    async def receive(self, text_data):
        # Receive message from WebSocket
        text_data_json = json.loads(text_data)
        message = text_data_json.get('message')  # Changed 'text' to 'message'
        sender_id = text_data_json.get('sender', {}).get('id')  # Adjusted to extract 'id' from 'sender'
        recipient_id = text_data_json.get('receiver', {}).get('id')  # Adjusted to extract 'id' from 'receiver'

        if not message or sender_id is None or recipient_id is None:
            print("Invalid message format:", text_data_json)  # Debugging line
            return  # Early exit if essential fields are missing

        chat_message = await self.save_chat_message(message, sender_id, recipient_id)

        if chat_message and not chat_message.is_read:
            await self.mark_as_read(chat_message)

        messages = await self.get_messages(sender_id, recipient_id)
        
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'messages': messages,
                'sender_id': sender_id,
                'message': message
            }
        )



    async def chat_message(self, event):
        messages = event.get('messages', [])
        sender_id = event.get('sender_id')
        message = event.get('message')

        await self.send(text_data=json.dumps({
            'messages': messages,
            'sender': {'id': sender_id},
            'message': message
        }))


    @database_sync_to_async
    def save_chat_message(self, message, sender_id, recipient_id):
        return Chat.objects.create(message=message, sender_id=sender_id, receiver_id=recipient_id)

    @database_sync_to_async
    def mark_as_read(self, chat_message):
        chat_message.mark_as_read()

    @database_sync_to_async
    def get_messages(self, sender, recipient_id):
        from .models import Chat
        from chat.api.serializer import ChatSerializer

        messages = []
        for instance in Chat.objects.filter(sender__in=[sender, recipient_id], receiver__in=[sender, recipient_id]):
            messages.append(ChatSerializer(instance).data)

        return messages

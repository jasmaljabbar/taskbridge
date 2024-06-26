from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Tasker, WorkCategory
from rest_framework import status
from .serializers import TaskerSerializer, WorkCategorySerializer,Tasker_fetching_Serializer

class WorkCategoryListView(generics.ListAPIView):
    queryset = WorkCategory.objects.all()
    serializer_class = WorkCategorySerializer

class TaskerSignupView(generics.CreateAPIView):
    queryset = Tasker.objects.all()
    serializer_class = TaskerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        print('Request received for Tasker signup')

        # Print request user information for debugging
        print(f'Request user: {request.user}')
        print(f'User authenticated: {request.user.is_authenticated}')

        if not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        user = request.user
        
        # Optional: Ensure user is set to staff only if required by your logic
        user.is_staff = True  # Remove this line if not needed
        user.save()
        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        
        # Generate refresh and access tokens for the user
        refresh = RefreshToken.for_user(user)
        response_data = serializer.data
        response_data['refresh'] = str(refresh)
        response_data['access'] = str(refresh.access_token)
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
class TaskerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = Tasker_fetching_Serializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        tasker = Tasker.objects.get(user=self.request.user)
        print(tasker)
        return tasker
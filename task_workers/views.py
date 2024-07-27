from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from .models import Tasker, WorkCategory
from rest_framework.views import APIView
import json
import stripe
from account.utils import send_admin_email
from rest_framework import status
from account.models import UserData
from django.conf import settings
from .serializers import TaskerSerializer, WorkCategorySerializer,TaskerFetchingSerializer,TaskerUpdateSerializer

stripe.api_key = settings.STRIPE_SECRET_KEY

@permission_classes([AllowAny])
class WorkCategoryListView(generics.ListAPIView):
    queryset = WorkCategory.objects.all()
    serializer_class = WorkCategorySerializer

@permission_classes([AllowAny])
class Work_Listing(APIView):
    def get(self, request):
        task = WorkCategory.objects.filter(blocked=False)
        serializer = WorkCategorySerializer(task, many=True)
        return Response(serializer.data)



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
        user.requested_to_tasker = True
        admins = UserData.objects.filter(is_superuser=True)
        for admin in admins:
            send_admin_email(admin.email, user.name)
        user.save()

        # Print request data for debugging
        print(f'Request data: {request.data}')

        # Correct the request data
        corrected_data = request.data.copy()
        if 'task_service_charge' in corrected_data:
            corrected_data['task_fee'] = corrected_data.pop('task_service_charge')

        serializer = self.get_serializer(data=corrected_data)
        try:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
        except Exception as e:
            print(f'Error during Tasker creation: {e}')
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Generate refresh and access tokens for the user
        refresh = RefreshToken.for_user(user)
        response_data = serializer.data
        response_data['refresh'] = str(refresh)
        response_data['access'] = str(refresh.access_token)

        return Response(response_data, status=status.HTTP_201_CREATED)


class TaskerCheckoutSessionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return Response({'error': 'User is not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            tasker = Tasker.objects.get(user=request.user)
            session = stripe.checkout.Session.create(
                payment_method_types=['card'],
                line_items=[
                    {
                        'price_data': {
                            'currency': 'usd',
                            'product_data': {
                                'name': 'Tasker Subscription',
                            },
                            'unit_amount': int(tasker.task_fee * 100),
                        },
                        'quantity': 1,
                    },
                ],
                mode='payment',
                success_url='http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
                cancel_url='http://localhost:5173/',
            )
            return Response({'url': session.url})
        except Tasker.DoesNotExist:
            return Response({'error': 'Tasker profile not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class TaskerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = TaskerFetchingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        tasker = Tasker.objects.get(user=self.request.user)
        print(tasker)
        return tasker
    

class TaskerProfileUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        try:
            tasker_profile = Tasker.objects.get(user=request.user)
        except Tasker.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = TaskerUpdateSerializer(instance=tasker_profile, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
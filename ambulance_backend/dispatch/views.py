from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from .models import EmergencyCall, Trip
from .serializers import (
    EmergencyCallSerializer, 
    EmergencyCallCreateSerializer,
    TripSerializer,
    TripCreateSerializer
)
from ambulances.models import Ambulance

class EmergencyCallListCreateView(generics.ListCreateAPIView):
    queryset = EmergencyCall.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EmergencyCallCreateSerializer
        return EmergencyCallSerializer
    
    def perform_create(self, serializer):
        # Automatically assign dispatcher if user is a dispatcher
        if self.request.user.role == 'dispatcher':
            serializer.save(dispatcher=self.request.user)
        else:
            serializer.save()

class EmergencyCallDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = EmergencyCall.objects.all()
    serializer_class = EmergencyCallSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def assign_ambulance_to_call(request, call_id):
    """Assign an ambulance to an emergency call"""
    try:
        call = EmergencyCall.objects.get(pk=call_id)
        ambulance_id = request.data.get('ambulance_id')
        
        if not ambulance_id:
            return Response({'error': 'ambulance_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            ambulance = Ambulance.objects.get(pk=ambulance_id)
        except Ambulance.DoesNotExist:
            return Response({'error': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if ambulance is available
        if ambulance.status != 'available':
            return Response({'error': 'Ambulance is not available'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Assign ambulance to call
        call.assigned_ambulance = ambulance
        call.status = 'assigned'
        call.save()
        
        # Update ambulance status
        ambulance.status = 'assigned'
        ambulance.save()
        
        serializer = EmergencyCallSerializer(call)
        return Response(serializer.data)
        
    except EmergencyCall.DoesNotExist:
        return Response({'error': 'Emergency call not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def update_call_status(request, call_id):
    """Update emergency call status"""
    try:
        call = EmergencyCall.objects.get(pk=call_id)
        new_status = request.data.get('status')
        
        if not new_status:
            return Response({'error': 'status is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update call status
        call.status = new_status
        call.save()
        
        # Update ambulance status if needed
        if call.assigned_ambulance:
            if new_status == 'completed':
                call.assigned_ambulance.status = 'available'
            elif new_status == 'en_route':
                call.assigned_ambulance.status = 'en_route'
            elif new_status == 'at_scene':
                call.assigned_ambulance.status = 'at_scene'
            elif new_status == 'transporting':
                call.assigned_ambulance.status = 'transporting'
            
            call.assigned_ambulance.save()
        
        serializer = EmergencyCallSerializer(call)
        return Response(serializer.data)
        
    except EmergencyCall.DoesNotExist:
        return Response({'error': 'Emergency call not found'}, status=status.HTTP_404_NOT_FOUND)

class TripListCreateView(generics.ListCreateAPIView):
    queryset = Trip.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TripCreateSerializer
        return TripSerializer

class TripDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def complete_trip(request, trip_id):
    """Complete a trip and update status"""
    try:
        trip = Trip.objects.get(pk=trip_id)
        
        # Set end time and complete status
        trip.end_time = timezone.now()
        trip.status = 'completed'
        trip.save()
        
        # Update ambulance status to available
        if trip.ambulance:
            trip.ambulance.status = 'available'
            trip.ambulance.save()
        
        # Update call status to completed
        if trip.call:
            trip.call.status = 'completed'
            trip.call.save()
        
        serializer = TripSerializer(trip)
        return Response(serializer.data)
        
    except Trip.DoesNotExist:
        return Response({'error': 'Trip not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def active_trips(request):
    """Get all active trips"""
    trips = Trip.objects.filter(status='active')
    serializer = TripSerializer(trips, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def pending_calls(request):
    """Get all pending emergency calls"""
    calls = EmergencyCall.objects.filter(status='pending')
    serializer = EmergencyCallSerializer(calls, many=True)
    return Response(serializer.data)

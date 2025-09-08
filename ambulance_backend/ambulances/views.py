from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Ambulance
from .serializers import AmbulanceSerializer, AmbulanceLocationUpdateSerializer

class AmbulanceListCreateView(generics.ListCreateAPIView):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer
    permission_classes = [permissions.IsAuthenticated]

class AmbulanceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Ambulance.objects.all()
    serializer_class = AmbulanceSerializer
    permission_classes = [permissions.IsAuthenticated]

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_ambulance_location(request, pk):
    """Update ambulance location"""
    try:
        ambulance = Ambulance.objects.get(pk=pk)
    except Ambulance.DoesNotExist:
        return Response({'error': 'Ambulance not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = AmbulanceLocationUpdateSerializer(ambulance, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def available_ambulances(request):
    """Get list of available ambulances"""
    ambulances = Ambulance.objects.filter(status='available')
    serializer = AmbulanceSerializer(ambulances, many=True)
    return Response(serializer.data)

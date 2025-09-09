from rest_framework import serializers
from .models import EmergencyCall, Trip
from ambulances.serializers import AmbulanceSerializer
from patients.serializers import PatientSerializer
from accounts.serializers import UserSerializer

class EmergencyCallSerializer(serializers.ModelSerializer):
    assigned_ambulance_details = AmbulanceSerializer(source='assigned_ambulance', read_only=True)
    dispatcher_details = UserSerializer(source='dispatcher', read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)
    
    class Meta:
        model = EmergencyCall
        fields = [
            'id', 'caller_name', 'caller_phone', 'latitude', 'longitude', 'address',
            'priority', 'status', 'description', 'assigned_ambulance', 'assigned_ambulance_details',
            'dispatcher', 'dispatcher_details', 'patient', 'patient_details',
            'request_source', 'requester_type', 'requester_details',
            'created_at', 'response_time'
        ]
        read_only_fields = ['id', 'created_at']

class EmergencyCallCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmergencyCall
        fields = [
            'caller_name', 'caller_phone', 'latitude', 'longitude', 'address',
            'priority', 'description', 'request_source', 'requester_type',
            'requester_details'
        ]

class TripSerializer(serializers.ModelSerializer):
    call_details = EmergencyCallSerializer(source='call', read_only=True)
    ambulance_details = AmbulanceSerializer(source='ambulance', read_only=True)
    patient_details = PatientSerializer(source='patient', read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'call', 'call_details', 'ambulance', 'ambulance_details',
            'patient', 'patient_details', 'start_time', 'end_time',
            'distance', 'cost', 'status', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class TripCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = [
            'call', 'ambulance', 'patient', 'start_time', 'distance', 'cost'
        ]

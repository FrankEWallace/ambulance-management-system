from rest_framework import serializers
from .models import DriverInspection, ParamedicInspection, MaintenanceRecord
from ambulances.serializers import AmbulanceSerializer
from accounts.serializers import UserSerializer

class DriverInspectionSerializer(serializers.ModelSerializer):
    driver_details = UserSerializer(source='driver', read_only=True)
    ambulance_details = AmbulanceSerializer(source='ambulance', read_only=True)
    
    class Meta:
        model = DriverInspection
        fields = [
            'id', 'driver', 'driver_details', 'ambulance', 'ambulance_details',
            'date', 'shift', 'vehicle_inspection', 'mileage', 'fuel_level',
            'overall_status', 'additional_notes', 'submitted_at'
        ]
        read_only_fields = ['id', 'submitted_at']

class DriverInspectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = DriverInspection
        fields = [
            'driver', 'ambulance', 'date', 'shift', 'vehicle_inspection',
            'mileage', 'fuel_level', 'overall_status', 'additional_notes'
        ]

class ParamedicInspectionSerializer(serializers.ModelSerializer):
    paramedic_details = UserSerializer(source='paramedic', read_only=True)
    ambulance_details = AmbulanceSerializer(source='ambulance', read_only=True)
    
    class Meta:
        model = ParamedicInspection
        fields = [
            'id', 'paramedic', 'paramedic_details', 'ambulance', 'ambulance_details',
            'date', 'shift', 'medical_equipment', 'overall_status',
            'additional_notes', 'submitted_at'
        ]
        read_only_fields = ['id', 'submitted_at']

class ParamedicInspectionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParamedicInspection
        fields = [
            'paramedic', 'ambulance', 'date', 'shift', 'medical_equipment',
            'overall_status', 'additional_notes'
        ]

class MaintenanceRecordSerializer(serializers.ModelSerializer):
    ambulance_details = AmbulanceSerializer(source='ambulance', read_only=True)
    
    class Meta:
        model = MaintenanceRecord
        fields = [
            'id', 'ambulance', 'ambulance_details', 'maintenance_type', 'status',
            'scheduled_date', 'completed_date', 'description', 'cost', 'vendor',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class MaintenanceRecordCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MaintenanceRecord
        fields = [
            'ambulance', 'maintenance_type', 'status', 'scheduled_date',
            'completed_date', 'description', 'cost', 'vendor'
        ]

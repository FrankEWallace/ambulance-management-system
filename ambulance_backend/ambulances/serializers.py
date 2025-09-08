from rest_framework import serializers
from .models import Ambulance

class AmbulanceSerializer(serializers.ModelSerializer):
    assigned_driver_name = serializers.CharField(source='assigned_driver.get_full_name', read_only=True)
    assigned_paramedic_name = serializers.CharField(source='assigned_paramedic.get_full_name', read_only=True)
    
    class Meta:
        model = Ambulance
        fields = [
            'id', 'vehicle_number', 'license_number', 'model', 'year', 'status',
            'latitude', 'longitude', 'assigned_driver', 'assigned_driver_name',
            'assigned_paramedic', 'assigned_paramedic_name', 'last_maintenance',
            'next_maintenance', 'insurance_expiry', 'equipment', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

class AmbulanceLocationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambulance
        fields = ['latitude', 'longitude']

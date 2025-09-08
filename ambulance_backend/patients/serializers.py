from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'id', 'name', 'age', 'gender', 'phone', 'medical_condition',
            'allergies', 'medications', 'emergency_contact_name',
            'emergency_contact_phone', 'emergency_contact_relation',
            'pickup_latitude', 'pickup_longitude', 'pickup_address',
            'destination_latitude', 'destination_longitude', 
            'destination_address', 'hospital_name', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

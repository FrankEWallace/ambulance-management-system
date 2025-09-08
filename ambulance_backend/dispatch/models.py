from django.db import models
from django.contrib.auth import get_user_model
from ambulances.models import Ambulance
from patients.models import Patient

User = get_user_model()

class EmergencyCall(models.Model):
    PRIORITY_CHOICES = [
        ('critical', 'Critical'),
        ('high', 'High'),
        ('medium', 'Medium'),
        ('low', 'Low'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('assigned', 'Assigned'),
        ('en_route', 'En Route'),
        ('at_scene', 'At Scene'),
        ('transporting', 'Transporting'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    REQUEST_SOURCE_CHOICES = [
        ('phone_call', 'Phone Call'),
        ('system', 'System'),
        ('mobile_app', 'Mobile App'),
        ('web_portal', 'Web Portal'),
    ]
    
    REQUESTER_TYPE_CHOICES = [
        ('individual', 'Individual'),
        ('hospital', 'Hospital'),
        ('clinic', 'Clinic'),
        ('nursing_home', 'Nursing Home'),
        ('emergency_services', 'Emergency Services'),
    ]
    
    # Caller information
    caller_name = models.CharField(max_length=200)
    caller_phone = models.CharField(max_length=20)
    
    # Location
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    address = models.TextField()
    
    # Call details
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    description = models.TextField()
    
    # Assignments
    assigned_ambulance = models.ForeignKey(
        Ambulance, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='emergency_calls'
    )
    dispatcher = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='dispatched_calls',
        limit_choices_to={'role': 'dispatcher'}
    )
    patient = models.ForeignKey(
        Patient, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='emergency_calls'
    )
    
    # Request information
    request_source = models.CharField(max_length=20, choices=REQUEST_SOURCE_CHOICES)
    requester_type = models.CharField(max_length=20, choices=REQUESTER_TYPE_CHOICES)
    
    # Requester details (stored as JSON)
    requester_details = models.JSONField(default=dict, blank=True)
    
    # Timing
    created_at = models.DateTimeField(auto_now_add=True)
    response_time = models.IntegerField(null=True, blank=True, help_text="Response time in minutes")
    
    def __str__(self):
        return f"Call {self.id} - {self.priority} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']


class Trip(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('completed', 'Completed'),
    ]
    
    call = models.OneToOneField(EmergencyCall, on_delete=models.CASCADE, related_name='trip')
    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE, related_name='trips')
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='trips')
    
    start_time = models.DateTimeField()
    end_time = models.DateTimeField(null=True, blank=True)
    distance = models.DecimalField(max_digits=8, decimal_places=2, help_text="Distance in kilometers")
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Trip {self.id} - {self.ambulance.vehicle_number} - {self.status}"
    
    class Meta:
        ordering = ['-created_at']

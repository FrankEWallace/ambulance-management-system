from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Ambulance(models.Model):
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('assigned', 'Assigned'),
        ('en_route', 'En Route'),
        ('at_scene', 'At Scene'),
        ('transporting', 'Transporting'),
        ('at_hospital', 'At Hospital'),
        ('maintenance', 'Maintenance'),
    ]
    
    vehicle_number = models.CharField(max_length=20, unique=True)
    license_number = models.CharField(max_length=20, unique=True)
    model = models.CharField(max_length=100)
    year = models.IntegerField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # Location fields
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    
    # Staff assignments
    assigned_driver = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='driver_ambulances',
        limit_choices_to={'role': 'driver'}
    )
    assigned_paramedic = models.ForeignKey(
        User, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name='paramedic_ambulances',
        limit_choices_to={'role': 'paramedic'}
    )
    
    # Maintenance and insurance
    last_maintenance = models.DateField()
    next_maintenance = models.DateField()
    insurance_expiry = models.DateField()
    
    # Equipment (stored as JSON)
    equipment = models.JSONField(default=list)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.vehicle_number} - {self.model}"
    
    class Meta:
        ordering = ['vehicle_number']

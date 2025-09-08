from django.db import models
from django.contrib.auth import get_user_model
from ambulances.models import Ambulance

User = get_user_model()

class DriverInspection(models.Model):
    SHIFT_CHOICES = [
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('night', 'Night'),
    ]
    
    STATUS_CHOICES = [
        ('ready', 'Ready'),
        ('needs_attention', 'Needs Attention'),
        ('out_of_service', 'Out of Service'),
    ]
    
    driver = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='driver_inspections',
        limit_choices_to={'role': 'driver'}
    )
    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE, related_name='driver_inspections')
    date = models.DateField()
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    
    # Vehicle inspection items (stored as JSON)
    vehicle_inspection = models.JSONField(default=list)
    
    mileage = models.IntegerField()
    fuel_level = models.IntegerField(help_text="Fuel level percentage")
    overall_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    additional_notes = models.TextField(blank=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Driver Inspection - {self.ambulance.vehicle_number} - {self.date}"
    
    class Meta:
        ordering = ['-submitted_at']
        unique_together = ['driver', 'ambulance', 'date', 'shift']


class ParamedicInspection(models.Model):
    SHIFT_CHOICES = [
        ('morning', 'Morning'),
        ('afternoon', 'Afternoon'),
        ('night', 'Night'),
    ]
    
    STATUS_CHOICES = [
        ('ready', 'Ready'),
        ('needs_attention', 'Needs Attention'),
        ('out_of_service', 'Out of Service'),
    ]
    
    paramedic = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='paramedic_inspections',
        limit_choices_to={'role': 'paramedic'}
    )
    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE, related_name='paramedic_inspections')
    date = models.DateField()
    shift = models.CharField(max_length=20, choices=SHIFT_CHOICES)
    
    # Medical equipment items (stored as JSON)
    medical_equipment = models.JSONField(default=list)
    
    overall_status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    additional_notes = models.TextField(blank=True)
    
    submitted_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Paramedic Inspection - {self.ambulance.vehicle_number} - {self.date}"
    
    class Meta:
        ordering = ['-submitted_at']
        unique_together = ['paramedic', 'ambulance', 'date', 'shift']


class MaintenanceRecord(models.Model):
    MAINTENANCE_TYPE_CHOICES = [
        ('routine', 'Routine Maintenance'),
        ('repair', 'Repair'),
        ('inspection', 'Inspection'),
        ('emergency', 'Emergency Repair'),
    ]
    
    STATUS_CHOICES = [
        ('scheduled', 'Scheduled'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    ambulance = models.ForeignKey(Ambulance, on_delete=models.CASCADE, related_name='maintenance_records')
    maintenance_type = models.CharField(max_length=20, choices=MAINTENANCE_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    
    scheduled_date = models.DateField()
    completed_date = models.DateField(null=True, blank=True)
    
    description = models.TextField()
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    vendor = models.CharField(max_length=200, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Maintenance - {self.ambulance.vehicle_number} - {self.maintenance_type}"
    
    class Meta:
        ordering = ['-scheduled_date']

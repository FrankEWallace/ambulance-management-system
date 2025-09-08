from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('name', 'age', 'gender', 'medical_condition', 'phone', 'created_at')
    list_filter = ('gender', 'created_at')
    search_fields = ('name', 'phone', 'medical_condition')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Personal Information', {
            'fields': ('name', 'age', 'gender', 'phone', 'medical_condition')
        }),
        ('Medical Information', {
            'fields': ('allergies', 'medications')
        }),
        ('Emergency Contact', {
            'fields': ('emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation')
        }),
        ('Pickup Location', {
            'fields': ('pickup_latitude', 'pickup_longitude', 'pickup_address')
        }),
        ('Destination', {
            'fields': ('destination_latitude', 'destination_longitude', 'destination_address', 'hospital_name')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

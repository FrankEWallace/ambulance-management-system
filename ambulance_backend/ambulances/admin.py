from django.contrib import admin
from .models import Ambulance

@admin.register(Ambulance)
class AmbulanceAdmin(admin.ModelAdmin):
    list_display = ('vehicle_number', 'model', 'year', 'status', 'assigned_driver', 'assigned_paramedic', 'next_maintenance')
    list_filter = ('status', 'year', 'model')
    search_fields = ('vehicle_number', 'license_number', 'model')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Vehicle Information', {
            'fields': ('vehicle_number', 'license_number', 'model', 'year', 'status')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude')
        }),
        ('Staff Assignment', {
            'fields': ('assigned_driver', 'assigned_paramedic')
        }),
        ('Maintenance & Insurance', {
            'fields': ('last_maintenance', 'next_maintenance', 'insurance_expiry')
        }),
        ('Equipment', {
            'fields': ('equipment',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

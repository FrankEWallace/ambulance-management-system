from django.contrib import admin
from .models import DriverInspection, ParamedicInspection, MaintenanceRecord

@admin.register(DriverInspection)
class DriverInspectionAdmin(admin.ModelAdmin):
    list_display = ('driver', 'ambulance', 'date', 'shift', 'overall_status', 'submitted_at')
    list_filter = ('shift', 'overall_status', 'date', 'submitted_at')
    search_fields = ('driver__username', 'ambulance__vehicle_number')
    readonly_fields = ('submitted_at',)
    
    fieldsets = (
        ('Inspection Details', {
            'fields': ('driver', 'ambulance', 'date', 'shift')
        }),
        ('Vehicle Inspection', {
            'fields': ('vehicle_inspection', 'mileage', 'fuel_level')
        }),
        ('Status', {
            'fields': ('overall_status', 'additional_notes')
        }),
        ('Timestamps', {
            'fields': ('submitted_at',)
        }),
    )

@admin.register(ParamedicInspection)
class ParamedicInspectionAdmin(admin.ModelAdmin):
    list_display = ('paramedic', 'ambulance', 'date', 'shift', 'overall_status', 'submitted_at')
    list_filter = ('shift', 'overall_status', 'date', 'submitted_at')
    search_fields = ('paramedic__username', 'ambulance__vehicle_number')
    readonly_fields = ('submitted_at',)
    
    fieldsets = (
        ('Inspection Details', {
            'fields': ('paramedic', 'ambulance', 'date', 'shift')
        }),
        ('Medical Equipment', {
            'fields': ('medical_equipment',)
        }),
        ('Status', {
            'fields': ('overall_status', 'additional_notes')
        }),
        ('Timestamps', {
            'fields': ('submitted_at',)
        }),
    )

@admin.register(MaintenanceRecord)
class MaintenanceRecordAdmin(admin.ModelAdmin):
    list_display = ('ambulance', 'maintenance_type', 'status', 'scheduled_date', 'completed_date', 'cost')
    list_filter = ('maintenance_type', 'status', 'scheduled_date')
    search_fields = ('ambulance__vehicle_number', 'description', 'vendor')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Maintenance Information', {
            'fields': ('ambulance', 'maintenance_type', 'status')
        }),
        ('Scheduling', {
            'fields': ('scheduled_date', 'completed_date')
        }),
        ('Details', {
            'fields': ('description', 'cost', 'vendor')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

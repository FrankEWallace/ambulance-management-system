from django.contrib import admin
from .models import EmergencyCall, Trip

@admin.register(EmergencyCall)
class EmergencyCallAdmin(admin.ModelAdmin):
    list_display = ('id', 'caller_name', 'priority', 'status', 'assigned_ambulance', 'dispatcher', 'created_at')
    list_filter = ('priority', 'status', 'request_source', 'requester_type', 'created_at')
    search_fields = ('caller_name', 'caller_phone', 'description', 'address')
    readonly_fields = ('created_at',)
    
    fieldsets = (
        ('Caller Information', {
            'fields': ('caller_name', 'caller_phone')
        }),
        ('Location', {
            'fields': ('latitude', 'longitude', 'address')
        }),
        ('Call Details', {
            'fields': ('priority', 'status', 'description')
        }),
        ('Assignment', {
            'fields': ('assigned_ambulance', 'dispatcher', 'patient')
        }),
        ('Request Information', {
            'fields': ('request_source', 'requester_type', 'requester_details')
        }),
        ('Timing', {
            'fields': ('created_at', 'response_time')
        }),
    )

@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ('id', 'ambulance', 'patient', 'start_time', 'end_time', 'distance', 'cost', 'status')
    list_filter = ('status', 'start_time')
    search_fields = ('ambulance__vehicle_number', 'patient__name')
    readonly_fields = ('created_at', 'updated_at')
    
    fieldsets = (
        ('Trip Information', {
            'fields': ('call', 'ambulance', 'patient', 'status')
        }),
        ('Timing', {
            'fields': ('start_time', 'end_time')
        }),
        ('Trip Details', {
            'fields': ('distance', 'cost')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

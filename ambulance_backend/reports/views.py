from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Q, Count, Avg, Sum
from django.utils import timezone
from datetime import datetime, timedelta
from .models import DriverInspection, ParamedicInspection, MaintenanceRecord
from .serializers import (
    DriverInspectionSerializer,
    DriverInspectionCreateSerializer,
    ParamedicInspectionSerializer,
    ParamedicInspectionCreateSerializer,
    MaintenanceRecordSerializer,
    MaintenanceRecordCreateSerializer
)

# Driver Inspections
class DriverInspectionListCreateView(generics.ListCreateAPIView):
    queryset = DriverInspection.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return DriverInspectionCreateSerializer
        return DriverInspectionSerializer
    
    def get_queryset(self):
        queryset = DriverInspection.objects.all()
        
        # Filter by driver if user is a driver
        if self.request.user.role == 'driver':
            queryset = queryset.filter(driver=self.request.user)
        
        # Filter by query parameters
        ambulance_id = self.request.query_params.get('ambulance_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        status = self.request.query_params.get('status')
        
        if ambulance_id:
            queryset = queryset.filter(ambulance_id=ambulance_id)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if status:
            queryset = queryset.filter(overall_status=status)
        
        return queryset

class DriverInspectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DriverInspection.objects.all()
    serializer_class = DriverInspectionSerializer
    permission_classes = [permissions.IsAuthenticated]

# Paramedic Inspections
class ParamedicInspectionListCreateView(generics.ListCreateAPIView):
    queryset = ParamedicInspection.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return ParamedicInspectionCreateSerializer
        return ParamedicInspectionSerializer
    
    def get_queryset(self):
        queryset = ParamedicInspection.objects.all()
        
        # Filter by paramedic if user is a paramedic
        if self.request.user.role == 'paramedic':
            queryset = queryset.filter(paramedic=self.request.user)
        
        # Filter by query parameters
        ambulance_id = self.request.query_params.get('ambulance_id')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        status = self.request.query_params.get('status')
        
        if ambulance_id:
            queryset = queryset.filter(ambulance_id=ambulance_id)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)
        if status:
            queryset = queryset.filter(overall_status=status)
        
        return queryset

class ParamedicInspectionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ParamedicInspection.objects.all()
    serializer_class = ParamedicInspectionSerializer
    permission_classes = [permissions.IsAuthenticated]

# Maintenance Records
class MaintenanceRecordListCreateView(generics.ListCreateAPIView):
    queryset = MaintenanceRecord.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return MaintenanceRecordCreateSerializer
        return MaintenanceRecordSerializer
    
    def get_queryset(self):
        queryset = MaintenanceRecord.objects.all()
        
        # Filter by query parameters
        ambulance_id = self.request.query_params.get('ambulance_id')
        maintenance_type = self.request.query_params.get('maintenance_type')
        status = self.request.query_params.get('status')
        date_from = self.request.query_params.get('date_from')
        date_to = self.request.query_params.get('date_to')
        
        if ambulance_id:
            queryset = queryset.filter(ambulance_id=ambulance_id)
        if maintenance_type:
            queryset = queryset.filter(maintenance_type=maintenance_type)
        if status:
            queryset = queryset.filter(status=status)
        if date_from:
            queryset = queryset.filter(scheduled_date__gte=date_from)
        if date_to:
            queryset = queryset.filter(scheduled_date__lte=date_to)
        
        return queryset

class MaintenanceRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = MaintenanceRecord.objects.all()
    serializer_class = MaintenanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

# Report Views
@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def inspection_summary(request):
    """Get inspection summary statistics"""
    today = timezone.now().date()
    week_ago = today - timedelta(days=7)
    month_ago = today - timedelta(days=30)
    
    # Driver inspections
    driver_inspections_today = DriverInspection.objects.filter(date=today).count()
    driver_inspections_week = DriverInspection.objects.filter(date__gte=week_ago).count()
    driver_inspections_month = DriverInspection.objects.filter(date__gte=month_ago).count()
    
    # Paramedic inspections
    paramedic_inspections_today = ParamedicInspection.objects.filter(date=today).count()
    paramedic_inspections_week = ParamedicInspection.objects.filter(date__gte=week_ago).count()
    paramedic_inspections_month = ParamedicInspection.objects.filter(date__gte=month_ago).count()
    
    # Status breakdown
    driver_status_breakdown = DriverInspection.objects.filter(date__gte=week_ago).values('overall_status').annotate(count=Count('id'))
    paramedic_status_breakdown = ParamedicInspection.objects.filter(date__gte=week_ago).values('overall_status').annotate(count=Count('id'))
    
    return Response({
        'driver_inspections': {
            'today': driver_inspections_today,
            'week': driver_inspections_week,
            'month': driver_inspections_month,
            'status_breakdown': list(driver_status_breakdown)
        },
        'paramedic_inspections': {
            'today': paramedic_inspections_today,
            'week': paramedic_inspections_week,
            'month': paramedic_inspections_month,
            'status_breakdown': list(paramedic_status_breakdown)
        }
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def maintenance_summary(request):
    """Get maintenance summary statistics"""
    today = timezone.now().date()
    month_ago = today - timedelta(days=30)
    
    # Maintenance records
    pending_maintenance = MaintenanceRecord.objects.filter(status='scheduled').count()
    completed_this_month = MaintenanceRecord.objects.filter(
        status='completed',
        completed_date__gte=month_ago
    ).count()
    
    # Cost analysis
    monthly_cost = MaintenanceRecord.objects.filter(
        completed_date__gte=month_ago,
        status='completed'
    ).aggregate(total=Sum('cost'))['total'] or 0
    
    # Maintenance type breakdown
    type_breakdown = MaintenanceRecord.objects.filter(
        scheduled_date__gte=month_ago
    ).values('maintenance_type').annotate(count=Count('id'))
    
    # Overdue maintenance
    overdue_maintenance = MaintenanceRecord.objects.filter(
        status='scheduled',
        scheduled_date__lt=today
    ).count()
    
    return Response({
        'pending_maintenance': pending_maintenance,
        'completed_this_month': completed_this_month,
        'monthly_cost': float(monthly_cost),
        'overdue_maintenance': overdue_maintenance,
        'type_breakdown': list(type_breakdown)
    })

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def ambulance_utilization_report(request):
    """Get ambulance utilization report"""
    from dispatch.models import Trip
    from ambulances.models import Ambulance
    
    today = timezone.now().date()
    month_ago = today - timedelta(days=30)
    
    ambulances = Ambulance.objects.all()
    utilization_data = []
    
    for ambulance in ambulances:
        # Calculate trips in the last month
        trips_count = Trip.objects.filter(
            ambulance=ambulance,
            start_time__date__gte=month_ago
        ).count()
        
        # Calculate total distance
        total_distance = Trip.objects.filter(
            ambulance=ambulance,
            start_time__date__gte=month_ago
        ).aggregate(total=Sum('distance'))['total'] or 0
        
        # Calculate revenue
        total_revenue = Trip.objects.filter(
            ambulance=ambulance,
            start_time__date__gte=month_ago
        ).aggregate(total=Sum('cost'))['total'] or 0
        
        utilization_data.append({
            'ambulance_id': ambulance.id,
            'vehicle_number': ambulance.vehicle_number,
            'model': ambulance.model,
            'status': ambulance.status,
            'trips_count': trips_count,
            'total_distance': float(total_distance),
            'total_revenue': float(total_revenue)
        })
    
    return Response(utilization_data)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def overdue_maintenance_alerts(request):
    """Get overdue maintenance alerts"""
    today = timezone.now().date()
    
    # Overdue scheduled maintenance
    overdue_records = MaintenanceRecord.objects.filter(
        status='scheduled',
        scheduled_date__lt=today
    ).select_related('ambulance')
    
    # Ambulances due for maintenance based on next_maintenance date
    ambulances_due = []
    from ambulances.models import Ambulance
    
    for ambulance in Ambulance.objects.all():
        if ambulance.next_maintenance <= today:
            ambulances_due.append({
                'ambulance_id': ambulance.id,
                'vehicle_number': ambulance.vehicle_number,
                'next_maintenance': ambulance.next_maintenance,
                'days_overdue': (today - ambulance.next_maintenance).days
            })
    
    overdue_data = []
    for record in overdue_records:
        overdue_data.append({
            'maintenance_id': record.id,
            'ambulance_id': record.ambulance.id,
            'vehicle_number': record.ambulance.vehicle_number,
            'maintenance_type': record.maintenance_type,
            'scheduled_date': record.scheduled_date,
            'days_overdue': (today - record.scheduled_date).days,
            'description': record.description
        })
    
    return Response({
        'overdue_maintenance_records': overdue_data,
        'ambulances_due_for_maintenance': ambulances_due
    })

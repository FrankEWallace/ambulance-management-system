from django.urls import path
from . import views

urlpatterns = [
    # Driver Inspections
    path('driver-inspections/', views.DriverInspectionListCreateView.as_view(), name='driver-inspection-list-create'),
    path('driver-inspections/<int:pk>/', views.DriverInspectionDetailView.as_view(), name='driver-inspection-detail'),
    
    # Paramedic Inspections
    path('paramedic-inspections/', views.ParamedicInspectionListCreateView.as_view(), name='paramedic-inspection-list-create'),
    path('paramedic-inspections/<int:pk>/', views.ParamedicInspectionDetailView.as_view(), name='paramedic-inspection-detail'),
    
    # Maintenance Records
    path('maintenance-records/', views.MaintenanceRecordListCreateView.as_view(), name='maintenance-record-list-create'),
    path('maintenance-records/<int:pk>/', views.MaintenanceRecordDetailView.as_view(), name='maintenance-record-detail'),
    
    # Report Views
    path('reports/inspection-summary/', views.inspection_summary, name='inspection-summary'),
    path('reports/maintenance-summary/', views.maintenance_summary, name='maintenance-summary'),
    path('reports/ambulance-utilization/', views.ambulance_utilization_report, name='ambulance-utilization'),
    path('reports/overdue-maintenance/', views.overdue_maintenance_alerts, name='overdue-maintenance-alerts'),
]

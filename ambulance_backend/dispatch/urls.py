from django.urls import path
from . import views

urlpatterns = [
    # Emergency Calls
    path('emergency-calls/', views.EmergencyCallListCreateView.as_view(), name='emergency-call-list-create'),
    path('emergency-calls/<int:pk>/', views.EmergencyCallDetailView.as_view(), name='emergency-call-detail'),
    path('emergency-calls/<int:call_id>/assign/', views.assign_ambulance_to_call, name='assign-ambulance'),
    path('emergency-calls/<int:call_id>/status/', views.update_call_status, name='update-call-status'),
    path('emergency-calls/pending/', views.pending_calls, name='pending-calls'),
    
    # Trips
    path('trips/', views.TripListCreateView.as_view(), name='trip-list-create'),
    path('trips/<int:pk>/', views.TripDetailView.as_view(), name='trip-detail'),
    path('trips/<int:trip_id>/complete/', views.complete_trip, name='complete-trip'),
    path('trips/active/', views.active_trips, name='active-trips'),
]

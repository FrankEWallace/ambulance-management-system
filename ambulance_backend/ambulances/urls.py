from django.urls import path
from . import views

urlpatterns = [
    path('ambulances/', views.AmbulanceListCreateView.as_view(), name='ambulance-list-create'),
    path('ambulances/<int:pk>/', views.AmbulanceDetailView.as_view(), name='ambulance-detail'),
    path('ambulances/<int:pk>/location/', views.update_ambulance_location, name='ambulance-location-update'),
    path('ambulances/available/', views.available_ambulances, name='available-ambulances'),
]

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Truck, 
  Phone, 
  User, 
  AlertTriangle,
  Route,
  RefreshCw
} from 'lucide-react';
import { mockAmbulances, mockEmergencyCalls } from '../data/mockData';
import { Ambulance, EmergencyCall } from '../types';

const LiveTracking: React.FC = () => {
  const [selectedAmbulance, setSelectedAmbulance] = useState<string>('all');
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Simulate real-time location updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAmbulances(prev => prev.map(amb => ({
        ...amb,
        location: {
          // Simulate small movements for active ambulances
          lat: amb.location.lat + (Math.random() - 0.5) * 0.001,
          lng: amb.location.lng + (Math.random() - 0.5) * 0.001
        }
      })));
      setLastUpdate(new Date());
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'en_route': return 'bg-blue-500';
      case 'at_scene': return 'bg-yellow-500';
      case 'transporting': return 'bg-orange-500';
      case 'at_hospital': return 'bg-purple-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const activeAmbulances = ambulances.filter(amb => 
    ['en_route', 'at_scene', 'transporting'].includes(amb.status)
  );

  const filteredAmbulances = selectedAmbulance === 'all' 
    ? ambulances 
    : ambulances.filter(amb => amb.id === selectedAmbulance);

  const getAssignedCall = (ambulanceId: string): EmergencyCall | undefined => {
    return mockEmergencyCalls.find(call => call.assignedAmbulanceId === ambulanceId);
  };

  const calculateETA = (ambulance: Ambulance): string => {
    const assignedCall = getAssignedCall(ambulance.id);
    if (!assignedCall) return 'N/A';
    
    // Simulate ETA calculation based on distance and traffic
    const baseTime = Math.floor(Math.random() * 15) + 5; // 5-20 minutes
    return `${baseTime} min`;
  };

  const calculateDistance = (ambulance: Ambulance): string => {
    const assignedCall = getAssignedCall(ambulance.id);
    if (!assignedCall) return 'N/A';
    
    // Simulate distance calculation
    const distance = (Math.random() * 10 + 1).toFixed(1);
    return `${distance} km`;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Live Tracking</h1>
          <p className="text-gray-600">Real-time ambulance location monitoring</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4 text-green-500" />
            <span className="text-sm text-gray-600">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
          <Select value={selectedAmbulance} onValueChange={setSelectedAmbulance}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ambulances</SelectItem>
              {ambulances.map((ambulance) => (
                <SelectItem key={ambulance.id} value={ambulance.id}>
                  {ambulance.vehicleNumber}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Map</CardTitle>
              <CardDescription>Real-time ambulance positions and routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
                {/* Simulated Map Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
                
                {/* Road Lines */}
                <div className="absolute inset-0">
                  <div className="absolute top-20 left-0 right-0 h-1 bg-gray-300"></div>
                  <div className="absolute top-40 left-0 right-0 h-1 bg-gray-300"></div>
                  <div className="absolute top-60 left-0 right-0 h-1 bg-gray-300"></div>
                  <div className="absolute top-20 bottom-20 left-20 w-1 bg-gray-300"></div>
                  <div className="absolute top-20 bottom-20 left-40 w-1 bg-gray-300"></div>
                  <div className="absolute top-20 bottom-20 right-20 w-1 bg-gray-300"></div>
                </div>

                {/* Ambulance Markers */}
                {filteredAmbulances.map((ambulance, index) => (
                  <div 
                    key={ambulance.id}
                    className="absolute animate-pulse"
                    style={{
                      left: `${20 + (index * 15)}%`,
                      top: `${30 + (index * 10)}%`
                    }}
                  >
                    <div className="relative">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(ambulance.status)} border-2 border-white shadow-lg`}></div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                        {ambulance.vehicleNumber}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Emergency Location Markers */}
                {mockEmergencyCalls.filter(call => call.status !== 'completed').map((call, index) => (
                  <div 
                    key={call.id}
                    className="absolute"
                    style={{
                      right: `${20 + (index * 15)}%`,
                      bottom: `${30 + (index * 10)}%`
                    }}
                  >
                    <div className="relative">
                      <AlertTriangle className="w-6 h-6 text-red-500 animate-bounce" />
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-red-100 px-2 py-1 rounded shadow text-xs whitespace-nowrap">
                        Emergency
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Interactive Map with Real-time Tracking</p>
                  <p className="text-sm text-gray-400 mt-1">
                    In production, this would integrate with Google Maps or Mapbox
                  </p>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Route className="h-4 w-4 mr-1" />
                    Show Routes
                  </Button>
                  <Button variant="outline" size="sm">
                    <Navigation className="h-4 w-4 mr-1" />
                    Center Map
                  </Button>
                </div>
                <div className="text-sm text-gray-600">
                  {ambulances.length} ambulances • {activeAmbulances.length} active
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ambulance Status Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Ambulances</CardTitle>
              <CardDescription>Currently deployed units</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeAmbulances.map((ambulance) => {
                const assignedCall = getAssignedCall(ambulance.id);
                return (
                  <div key={ambulance.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{ambulance.vehicleNumber}</h3>
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(ambulance.status)}`}></div>
                    </div>
                    <Badge variant="secondary" className="mb-2">
                      {ambulance.status.replace('_', ' ')}
                    </Badge>
                    
                    {assignedCall && (
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {assignedCall.callerName}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {calculateDistance(ambulance)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          ETA: {calculateETA(ambulance)}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-1 mt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Navigation className="h-3 w-3 mr-1" />
                        Navigate
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Available Fleet</CardTitle>
              <CardDescription>Ready for dispatch</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {ambulances.filter(amb => amb.status === 'available').map((ambulance) => (
                <div key={ambulance.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="font-medium">{ambulance.vehicleNumber}</span>
                  </div>
                  <Badge variant="outline">Available</Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fleet Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Fleet:</span>
                <span className="font-medium">{ambulances.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Available:</span>
                <span className="font-medium text-green-600">
                  {ambulances.filter(a => a.status === 'available').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active:</span>
                <span className="font-medium text-blue-600">{activeAmbulances.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Maintenance:</span>
                <span className="font-medium text-gray-600">
                  {ambulances.filter(a => a.status === 'maintenance').length}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;
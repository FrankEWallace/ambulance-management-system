import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Phone, 
  Navigation,
  User,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { mockEmergencyCalls, mockAmbulances } from '../data/mockData';
import { EmergencyCall, CallStatus } from '../types';
import { useAuth } from '../contexts/AuthContext';

const DriverAssignments: React.FC = () => {
  const { currentUser } = useAuth();
  const [assignments, setAssignments] = useState<EmergencyCall[]>(mockEmergencyCalls);

  // Get ambulance assigned to current driver (in real app, this would be based on driver ID)
  const driverAmbulance = mockAmbulances[0]; // Simplified for demo
  
  // Filter calls assigned to driver's ambulance
  const driverCalls = assignments.filter(call => 
    call.assignedAmbulanceId === driverAmbulance.id
  );

  const activeCall = driverCalls.find(call => 
    ['assigned', 'en_route', 'at_scene', 'transporting'].includes(call.status)
  );

  const completedCalls = driverCalls.filter(call => call.status === 'completed');

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusColor = (status: CallStatus) => {
    switch (status) {
      case 'assigned': return 'secondary';
      case 'en_route': return 'default';
      case 'at_scene': return 'default';
      case 'transporting': return 'default';
      case 'completed': return 'outline';
      default: return 'outline';
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const callTime = new Date(dateString);
    const diffMs = now.getTime() - callTime.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const updateCallStatus = (callId: string, newStatus: CallStatus) => {
    setAssignments(prev => prev.map(call => 
      call.id === callId ? { ...call, status: newStatus } : call
    ));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>My Assignments</h1>
          <p className="text-gray-600">Current and recent emergency calls assigned to you</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Vehicle: {driverAmbulance.vehicleNumber}</p>
          <p className="text-sm text-gray-600">{driverAmbulance.model}</p>
        </div>
      </div>

      {/* Driver Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {activeCall ? 1 : 0}
            </div>
            <div className="text-sm text-gray-600">Active Assignment</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {completedCalls.length}
            </div>
            <div className="text-sm text-gray-600">Completed Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {driverCalls.filter(c => c.priority === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical Calls</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Assignment */}
      {activeCall && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-blue-600" />
              <span>Active Assignment</span>
            </CardTitle>
            <CardDescription>Your current priority call</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant={getPriorityColor(activeCall.priority)}>
                      {activeCall.priority.toUpperCase()}
                    </Badge>
                    <Badge variant={getStatusColor(activeCall.status)}>
                      {activeCall.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    {activeCall.priority === 'critical' && (
                      <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{activeCall.callerName}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-600">{activeCall.callerPhone}</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">{activeCall.location.address}</p>
                        <p className="text-sm text-gray-600">Lat: {activeCall.location.lat}, Lng: {activeCall.location.lng}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Dispatched {getTimeAgo(activeCall.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded border">
                    <p className="text-sm font-medium text-gray-900 mb-1">Emergency Details:</p>
                    <p className="text-sm text-gray-700">{activeCall.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button size="sm">
                  <Navigation className="h-4 w-4 mr-2" />
                  Navigate
                </Button>
                <Button variant="outline" size="sm">
                  <Phone className="h-4 w-4 mr-2" />
                  Call Patient
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="h-4 w-4 mr-2" />
                  Share Location
                </Button>
              </div>
              
              {/* Status Update */}
              <div className="flex flex-wrap gap-2 pt-2">
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => updateCallStatus(activeCall.id, 'en_route')}
                  disabled={activeCall.status !== 'assigned'}
                >
                  Mark En Route
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => updateCallStatus(activeCall.id, 'at_scene')}
                  disabled={activeCall.status !== 'en_route'}
                >
                  Arrived at Scene
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => updateCallStatus(activeCall.id, 'transporting')}
                  disabled={activeCall.status !== 'at_scene'}
                >
                  Transporting
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => updateCallStatus(activeCall.id, 'completed')}
                  disabled={!['transporting', 'at_hospital'].includes(activeCall.status)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Complete Call
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Assignment */}
      {!activeCall && (
        <Card>
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Assignment</h3>
            <p className="text-gray-600">You're currently available for dispatch. Stay ready!</p>
          </CardContent>
        </Card>
      )}

      {/* Recent Completed Calls */}
      {completedCalls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Completed Calls</CardTitle>
            <CardDescription>Your recently completed assignments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedCalls.slice(0, 3).map((call) => (
                <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getPriorityColor(call.priority)} className="text-xs">
                        {call.priority}
                      </Badge>
                      <span className="text-sm font-medium">{call.callerName}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{call.description}</p>
                    <div className="flex items-center text-xs text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      {call.location.address}
                      <span className="mx-2">•</span>
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(call.createdAt)}
                      {call.responseTime && (
                        <>
                          <span className="mx-2">•</span>
                          Response: {call.responseTime}m
                        </>
                      )}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DriverAssignments;
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Phone, 
  Plus, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Truck,
  User,
  Navigation,
  Building2,
  PhoneCall,
  Smartphone,
  Monitor,
  Globe,
  Filter,
  Bell
} from 'lucide-react';
import { mockEmergencyCalls, mockAmbulances } from '../data/mockData';
import { EmergencyCall, EmergencyPriority, CallStatus, RequestSource, RequesterType } from '../types';

const EmergencyCalls: React.FC = () => {
  const [calls, setCalls] = useState<EmergencyCall[]>(mockEmergencyCalls);
  const [isNewCallDialogOpen, setIsNewCallDialogOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<EmergencyCall | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSource, setFilterSource] = useState<string>('all');
  const [filterRequester, setFilterRequester] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getPriorityColor = (priority: EmergencyPriority) => {
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
      case 'pending': return 'destructive';
      case 'assigned': return 'secondary';
      case 'en_route': return 'default';
      case 'at_scene': return 'default';
      case 'transporting': return 'default';
      case 'completed': return 'outline';
      case 'cancelled': return 'destructive';
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

  const availableAmbulances = mockAmbulances.filter(amb => amb.status === 'available');

  // Helper functions for categorization
  const getSourceIcon = (source: RequestSource) => {
    switch (source) {
      case 'phone_call': return PhoneCall;
      case 'system': return Monitor;
      case 'mobile_app': return Smartphone;
      case 'web_portal': return Globe;
      default: return Phone;
    }
  };

  const getRequesterIcon = (requester: RequesterType) => {
    switch (requester) {
      case 'individual': return User;
      case 'hospital': return Building2;
      case 'clinic': return Building2;
      case 'nursing_home': return Building2;
      case 'emergency_services': return AlertTriangle;
      default: return User;
    }
  };

  const getSourceLabel = (source: RequestSource) => {
    switch (source) {
      case 'phone_call': return 'Phone Call';
      case 'system': return 'System';
      case 'mobile_app': return 'Mobile App';
      case 'web_portal': return 'Web Portal';
      default: return source;
    }
  };

  const getRequesterLabel = (requester: RequesterType) => {
    switch (requester) {
      case 'individual': return 'Individual';
      case 'hospital': return 'Hospital';
      case 'clinic': return 'Clinic';
      case 'nursing_home': return 'Nursing Home';
      case 'emergency_services': return 'Emergency Services';
      default: return requester;
    }
  };

  // Enhanced filtering
  const filteredCalls = calls.filter(call => {
    if (filterStatus !== 'all' && call.status !== filterStatus) return false;
    if (filterSource !== 'all' && call.requestSource !== filterSource) return false;
    if (filterRequester !== 'all' && call.requesterType !== filterRequester) return false;
    return true;
  });

  // Categorized calls for statistics
  const callsBySource = {
    phone_call: calls.filter(c => c.requestSource === 'phone_call').length,
    system: calls.filter(c => c.requestSource === 'system').length,
    mobile_app: calls.filter(c => c.requestSource === 'mobile_app').length,
    web_portal: calls.filter(c => c.requestSource === 'web_portal').length,
  };

  const callsByRequester = {
    individual: calls.filter(c => c.requesterType === 'individual').length,
    hospital: calls.filter(c => c.requesterType === 'hospital').length,
    clinic: calls.filter(c => c.requesterType === 'clinic').length,
    nursing_home: calls.filter(c => c.requesterType === 'nursing_home').length,
    emergency_services: calls.filter(c => c.requesterType === 'emergency_services').length,
  };

  const assignAmbulance = (callId: string, ambulanceId: string) => {
    setCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, status: 'assigned' as CallStatus, assignedAmbulanceId: ambulanceId } : call
    ));
    // Here we would normally notify the driver
    alert('Driver has been notified and needs to accept the assignment!');
  };

  const updateCallStatus = (callId: string, newStatus: CallStatus) => {
    setCalls(prev => prev.map(call => 
      call.id === callId ? { ...call, status: newStatus } : call
    ));
  };

  const renderCallCard = (call: EmergencyCall) => {
    const SourceIcon = getSourceIcon(call.requestSource);
    const RequesterIcon = getRequesterIcon(call.requesterType);
    
    return (
      <div key={call.id} className="p-4 border rounded-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant={getPriorityColor(call.priority)}>
                {call.priority}
              </Badge>
              <Badge variant={getStatusColor(call.status)}>
                {call.status.replace('_', ' ')}
              </Badge>
              <div className="flex items-center space-x-1">
                <SourceIcon className="h-3 w-3 text-blue-600" />
                <span className="text-xs text-gray-500">{getSourceLabel(call.requestSource)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <RequesterIcon className="h-3 w-3 text-green-600" />
                <span className="text-xs text-gray-500">{getRequesterLabel(call.requesterType)}</span>
              </div>
              {call.priority === 'critical' && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </div>
            <h3 className="font-medium">{call.callerName}</h3>
            <p className="text-sm text-gray-600 mb-1">{call.description}</p>
            {call.requesterDetails && (
              <p className="text-xs text-blue-600 mb-1">
                {call.requesterDetails.organizationName} - {call.requesterDetails.departmentName}
                {call.requesterDetails.referenceNumber && ` (Ref: ${call.requesterDetails.referenceNumber})`}
              </p>
            )}
            <div className="flex items-center text-sm text-gray-500">
              <MapPin className="h-3 w-3 mr-1" />
              {call.location.address}
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-3 w-3 mr-1" />
              {getTimeAgo(call.createdAt)}
            </div>
            {call.assignedAmbulanceId && (
              <div className="flex items-center text-sm text-gray-500">
                <Truck className="h-3 w-3 mr-1" />
                Ambulance: {mockAmbulances.find(a => a.id === call.assignedAmbulanceId)?.vehicleNumber}
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <Button variant="outline" size="sm">
              <MapPin className="h-4 w-4 mr-1" />
              Track
            </Button>
            <Button variant="outline" size="sm">
              <Phone className="h-4 w-4 mr-1" />
              Call
            </Button>
            {call.status !== 'completed' && call.status !== 'cancelled' && (
              <Select
                value={call.status}
                onValueChange={(value: CallStatus) => updateCallStatus(call.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="en_route">En Route</SelectItem>
                  <SelectItem value="at_scene">At Scene</SelectItem>
                  <SelectItem value="transporting">Transporting</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Emergency Calls</h1>
          <p className="text-gray-600">Manage emergency calls and dispatch ambulances</p>
        </div>
        <Dialog open={isNewCallDialogOpen} onOpenChange={setIsNewCallDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Emergency Call
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Emergency Call</DialogTitle>
              <DialogDescription>Record a new emergency call and notify appropriate personnel</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="caller-name">Caller Name</Label>
                  <Input id="caller-name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caller-phone">Phone Number</Label>
                  <Input id="caller-phone" placeholder="+1234567890" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="requester-type">Requester Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select requester type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="clinic">Clinic</SelectItem>
                      <SelectItem value="nursing_home">Nursing Home</SelectItem>
                      <SelectItem value="emergency_services">Emergency Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="request-source">Request Source</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="phone_call">Phone Call</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                      <SelectItem value="mobile_app">Mobile App</SelectItem>
                      <SelectItem value="web_portal">Web Portal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization Name (if applicable)</Label>
                <Input id="organization" placeholder="Hospital/Clinic/Organization name" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="123 Main St, City, State" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Describe the emergency..." />
              </div>
              
              <Button className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Create Emergency Call & Notify Driver
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-sm font-medium mb-2 block">Status Filter</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="en_route">En Route</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Request Source</Label>
              <Select value={filterSource} onValueChange={setFilterSource}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sources</SelectItem>
                  <SelectItem value="phone_call">Phone Call</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="mobile_app">Mobile App</SelectItem>
                  <SelectItem value="web_portal">Web Portal</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Requester Type</Label>
              <Select value={filterRequester} onValueChange={setFilterRequester}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="hospital">Hospital</SelectItem>
                  <SelectItem value="clinic">Clinic</SelectItem>
                  <SelectItem value="nursing_home">Nursing Home</SelectItem>
                  <SelectItem value="emergency_services">Emergency Services</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-sm font-medium mb-2 block">Category View</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="source">By Source</SelectItem>
                  <SelectItem value="requester">By Requester</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="cursor-pointer" onClick={() => setFilterStatus('all')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{calls.length}</div>
            <div className="text-sm text-gray-600">Total Calls</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setFilterStatus('pending')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {calls.filter(c => c.status === 'pending').length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setFilterStatus('assigned')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {calls.filter(c => ['assigned', 'en_route', 'at_scene', 'transporting'].includes(c.status)).length}
            </div>
            <div className="text-sm text-gray-600">Active</div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer" onClick={() => setFilterStatus('completed')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {calls.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {calls.filter(c => c.priority === 'critical').length}
            </div>
            <div className="text-sm text-gray-600">Critical</div>
          </CardContent>
        </Card>
      </div>

      {/* Category Statistics */}
      {selectedCategory === 'source' && (
        <Card>
          <CardHeader>
            <CardTitle>Requests by Source</CardTitle>
            <CardDescription>Distribution of emergency requests by their source</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(callsBySource).map(([source, count]) => {
                const SourceIcon = getSourceIcon(source as RequestSource);
                return (
                  <div 
                    key={source} 
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setFilterSource(source)}
                  >
                    <SourceIcon className="h-8 w-8 text-blue-600" />
                    <div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-gray-600">{getSourceLabel(source as RequestSource)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {selectedCategory === 'requester' && (
        <Card>
          <CardHeader>
            <CardTitle>Requests by Requester Type</CardTitle>
            <CardDescription>Distribution of emergency requests by requester type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(callsByRequester).map(([requester, count]) => {
                const RequesterIcon = getRequesterIcon(requester as RequesterType);
                return (
                  <div 
                    key={requester} 
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setFilterRequester(requester)}
                  >
                    <RequesterIcon className="h-8 w-8 text-green-600" />
                    <div>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm text-gray-600">{getRequesterLabel(requester as RequesterType)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Calls</TabsTrigger>
          <TabsTrigger value="pending">Pending Dispatch</TabsTrigger>
          <TabsTrigger value="history">Call History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Emergency Calls</CardTitle>
              <CardDescription>
                Calls currently being handled by ambulances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCalls.filter(call => 
                  ['assigned', 'en_route', 'at_scene', 'transporting'].includes(call.status)
                ).map(renderCallCard)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Dispatch</CardTitle>
              <CardDescription>
                Emergency calls waiting for ambulance assignment and driver notification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCalls.filter(call => call.status === 'pending').map((call) => (
                  <div key={call.id} className="p-4 border rounded-lg border-red-200 bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={getPriorityColor(call.priority)}>
                            {call.priority}
                          </Badge>
                          <Badge variant="destructive">PENDING</Badge>
                          <div className="flex items-center space-x-1">
                            {React.createElement(getSourceIcon(call.requestSource), { className: "h-3 w-3 text-blue-600" })}
                            <span className="text-xs text-gray-500">{getSourceLabel(call.requestSource)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {React.createElement(getRequesterIcon(call.requesterType), { className: "h-3 w-3 text-green-600" })}
                            <span className="text-xs text-gray-500">{getRequesterLabel(call.requesterType)}</span>
                          </div>
                          {call.priority === 'critical' && (
                            <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" />
                          )}
                        </div>
                        <h3 className="font-medium">{call.callerName}</h3>
                        <p className="text-sm text-gray-600 mb-1">{call.description}</p>
                        {call.requesterDetails && (
                          <p className="text-xs text-blue-600 mb-1">
                            {call.requesterDetails.organizationName} - {call.requesterDetails.departmentName}
                            {call.requesterDetails.referenceNumber && ` (Ref: ${call.requesterDetails.referenceNumber})`}
                          </p>
                        )}
                        <div className="flex items-center text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {call.location.address}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {getTimeAgo(call.createdAt)}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>
                              <Truck className="h-4 w-4 mr-1" />
                              Assign & Notify
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Assign Ambulance & Notify Driver</DialogTitle>
                              <DialogDescription>
                                Select an available ambulance. The driver will be notified and must accept the assignment.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label>Available Ambulances</Label>
                                <div className="space-y-2">
                                  {availableAmbulances.map((ambulance) => (
                                    <div 
                                      key={ambulance.id} 
                                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                                      onClick={() => {
                                        assignAmbulance(call.id, ambulance.id);
                                        setIsNewCallDialogOpen(false);
                                      }}
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="font-medium">{ambulance.vehicleNumber}</div>
                                          <div className="text-sm text-gray-600">
                                            {ambulance.model} • {ambulance.equipment.length} equipment
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          <div className="text-sm">Distance: 2.3 km</div>
                                          <div className="text-sm text-green-600">ETA: 8 min</div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm">
                          <Navigation className="h-4 w-4 mr-1" />
                          Auto-Assign
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>
                Previous emergency calls and their outcomes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredCalls.filter(call => 
                  ['completed', 'cancelled'].includes(call.status)
                ).map(renderCallCard)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EmergencyCalls;
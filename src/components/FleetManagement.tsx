import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { 
  Plus, 
  Edit, 
  MapPin, 
  Calendar, 
  Shield, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  User,
  Car,
  FileText
} from 'lucide-react';
import { mockAmbulances, mockUsers } from '../data/mockData';
import { Ambulance, AmbulanceStatus } from '../types';

interface DetailedVehicleInfo {
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  ownershipStatus: 'owned' | 'leased' | 'rented';
  lastServiceDate: string;
  driverName: string;
  driverLicense: string;
  insurancePolicy: string;
  insuranceExpiry: string;
}

const FleetManagement: React.FC = () => {
  const [ambulances, setAmbulances] = useState<Ambulance[]>(mockAmbulances);
  const [selectedVehicle, setSelectedVehicle] = useState<Ambulance | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Extended vehicle details (in real app, this would come from API)
  const getVehicleDetails = (ambulance: Ambulance): DetailedVehicleInfo => {
    const driver = mockUsers.find(u => u.id === ambulance.assignedDriverId);
    return {
      make: ambulance.model.split(' ')[0] || 'Mercedes',
      model: ambulance.model || 'Sprinter 319 CDI',
      year: ambulance.year || 2023,
      licensePlate: ambulance.licenseNumber || 'AMB-001-NY',
      ownershipStatus: 'owned',
      lastServiceDate: ambulance.lastMaintenance || '2024-01-15',
      driverName: driver?.name || 'John Smith',
      driverLicense: 'DL-123456789',
      insurancePolicy: 'POL-AMB-2024-001',
      insuranceExpiry: ambulance.insuranceExpiry || '2024-12-31'
    };
  };

  const getStatusColor = (status: AmbulanceStatus) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'assigned': return 'bg-blue-500';
      case 'en_route': return 'bg-blue-600';
      case 'at_scene': return 'bg-yellow-500';
      case 'transporting': return 'bg-orange-500';
      case 'at_hospital': return 'bg-purple-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBadgeVariant = (status: AmbulanceStatus) => {
    switch (status) {
      case 'available': return 'default';
      case 'maintenance': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredAmbulances = filterStatus === 'all' 
    ? ambulances 
    : ambulances.filter(amb => amb.status === filterStatus);

  const statusCounts = ambulances.reduce((acc, amb) => {
    acc[amb.status] = (acc[amb.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const handleVehicleClick = (ambulance: Ambulance) => {
    setSelectedVehicle(ambulance);
    setIsDetailDialogOpen(true);
    setIsEditMode(false);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleSave = () => {
    setIsEditMode(false);
    // In real app, save changes to backend
  };

  const handleDelete = () => {
    if (selectedVehicle) {
      setAmbulances(prev => prev.filter(amb => amb.id !== selectedVehicle.id));
      setIsDetailDialogOpen(false);
      setSelectedVehicle(null);
    }
  };

  const renderDetailDialog = () => {
    if (!selectedVehicle) return null;
    
    const details = getVehicleDetails(selectedVehicle);
    
    return (
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Vehicle Details - {selectedVehicle.vehicleNumber}</span>
              <Badge variant={getStatusBadgeVariant(selectedVehicle.status)}>
                {selectedVehicle.status.replace('_', ' ')}
              </Badge>
            </DialogTitle>
            <DialogDescription>
              Complete vehicle information and management
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Vehicle Information */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Car className="h-5 w-5 mr-2" />
                Vehicle Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Make</Label>
                  {isEditMode ? (
                    <Input defaultValue={details.make} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{details.make}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  {isEditMode ? (
                    <Input defaultValue={details.model} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{details.model}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  {isEditMode ? (
                    <Input type="number" defaultValue={details.year} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{details.year}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>License Plate Number</Label>
                  {isEditMode ? (
                    <Input defaultValue={details.licensePlate} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{details.licensePlate}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Ownership Status</Label>
                  {isEditMode ? (
                    <Select defaultValue={details.ownershipStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owned">Owned</SelectItem>
                        <SelectItem value="leased">Leased</SelectItem>
                        <SelectItem value="rented">Rented</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border capitalize">{details.ownershipStatus}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Last Service Date</Label>
                  {isEditMode ? (
                    <Input type="date" defaultValue={details.lastServiceDate} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">
                      {new Date(details.lastServiceDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Driver Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Driver Name</Label>
                  {isEditMode ? (
                    <Input defaultValue={details.driverName} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{details.driverName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Driver License Info</Label>
                  {isEditMode ? (
                    <Input defaultValue={details.driverLicense} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{details.driverLicense}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Insurance Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Insurance Policy</Label>
                  {isEditMode ? (
                    <Input defaultValue={details.insurancePolicy} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">{details.insurancePolicy}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Insurance Expiry Date</Label>
                  {isEditMode ? (
                    <Input type="date" defaultValue={details.insuranceExpiry} />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded border">
                      {new Date(details.insuranceExpiry).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Equipment Information */}
            <div>
              <h3 className="text-lg font-medium mb-3 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Equipment & Status
              </h3>
              <div className="space-y-2">
                <Label>Medical Equipment</Label>
                {isEditMode ? (
                  <Textarea defaultValue={selectedVehicle.equipment.join(', ')} />
                ) : (
                  <p className="p-2 bg-gray-50 rounded border">
                    {selectedVehicle.equipment.join(', ')}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <Label>Current Status</Label>
                  {isEditMode ? (
                    <Select defaultValue={selectedVehicle.status}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="available">Available</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="en_route">En Route</SelectItem>
                        <SelectItem value="at_scene">At Scene</SelectItem>
                        <SelectItem value="transporting">Transporting</SelectItem>
                        <SelectItem value="at_hospital">At Hospital</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor(selectedVehicle.status)}`}></div>
                      <span className="capitalize">{selectedVehicle.status.replace('_', ' ')}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Current Location</Label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Downtown Station</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t">
              <div className="space-x-2">
                {isEditMode ? (
                  <>
                    <Button onClick={handleSave}>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditMode(false)}>
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={handleEdit}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Vehicle
                  </Button>
                )}
              </div>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Vehicle
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Fleet Management</h1>
          <p className="text-gray-600">Manage vehicle information and fleet operations</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
              <DialogDescription>Register a new ambulance to the fleet</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle-number">Vehicle Number</Label>
                <Input id="vehicle-number" placeholder="AMB-004" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="license">License Plate</Label>
                <Input id="license" placeholder="ABC123NY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="Mercedes" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="Sprinter 319 CDI" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" placeholder="2024" />
              </div>
              <Button className="w-full">Add Vehicle</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Fleet Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card className="cursor-pointer" onClick={() => setFilterStatus('all')}>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{ambulances.length}</div>
            <div className="text-sm text-gray-600">Total Fleet</div>
          </CardContent>
        </Card>
        
        {Object.entries(statusCounts).map(([status, count]) => (
          <Card 
            key={status} 
            className={`cursor-pointer ${filterStatus === status ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setFilterStatus(status)}
          >
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(status as AmbulanceStatus)}`}></div>
              </div>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-sm text-gray-600 capitalize">{status.replace('_', ' ')}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Vehicles</CardTitle>
          <CardDescription>
            Click on any vehicle to view detailed information and manage settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredAmbulances.map((ambulance) => {
              const details = getVehicleDetails(ambulance);
              return (
                <div 
                  key={ambulance.id} 
                  className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleVehicleClick(ambulance)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`h-4 w-4 rounded-full ${getStatusColor(ambulance.status)}`}></div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium">{ambulance.vehicleNumber}</h3>
                          <Badge variant={getStatusBadgeVariant(ambulance.status)}>
                            {ambulance.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {details.make} {details.model} ({details.year}) • {details.licensePlate}
                        </p>
                        <p className="text-xs text-gray-500">
                          Driver: {details.driverName} • Last Service: {new Date(details.lastServiceDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <MapPin className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {renderDetailDialog()}
    </div>
  );
};

export default FleetManagement;
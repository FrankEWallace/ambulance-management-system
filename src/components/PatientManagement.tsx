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
import { Separator } from './ui/separator';
import { 
  User, 
  Plus, 
  Edit, 
  Phone, 
  MapPin, 
  Heart, 
  AlertTriangle, 
  FileText,
  Hospital,
  Clock,
  UserCheck
} from 'lucide-react';
import { mockPatients, mockEmergencyCalls, mockAmbulances } from '../data/mockData';
import { Patient } from '../types';

const PatientManagement: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatients = patients.filter(patient => 
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalCondition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPatientCall = (patientId: string) => {
    return mockEmergencyCalls.find(call => call.patientId === patientId);
  };

  const getAssignedAmbulance = (callId: string) => {
    const call = mockEmergencyCalls.find(c => c.id === callId);
    if (call?.assignedAmbulanceId) {
      return mockAmbulances.find(amb => amb.id === call.assignedAmbulanceId);
    }
    return null;
  };

  const getGenderColor = (gender: string) => {
    switch (gender) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionSeverity = (condition: string) => {
    const criticalConditions = ['cardiac arrest', 'heart attack', 'stroke'];
    const highConditions = ['chest pain', 'difficulty breathing', 'severe injury'];
    
    if (criticalConditions.some(c => condition.toLowerCase().includes(c))) {
      return { level: 'Critical', color: 'destructive' };
    }
    if (highConditions.some(c => condition.toLowerCase().includes(c))) {
      return { level: 'High', color: 'destructive' };
    }
    return { level: 'Stable', color: 'secondary' };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Patient Management</h1>
          <p className="text-gray-600">Manage patient records and medical information</p>
        </div>
        <Dialog open={isNewPatientDialogOpen} onOpenChange={setIsNewPatientDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Patient Record
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>New Patient Record</DialogTitle>
              <DialogDescription>Add a new patient to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-name">Full Name</Label>
                  <Input id="patient-name" placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-age">Age</Label>
                  <Input id="patient-age" type="number" placeholder="65" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patient-gender">Gender</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patient-phone">Phone Number</Label>
                  <Input id="patient-phone" placeholder="+1234567890" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="medical-condition">Medical Condition</Label>
                <Textarea id="medical-condition" placeholder="Describe the medical condition..." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input id="allergies" placeholder="Penicillin, Nuts, etc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Input id="medications" placeholder="Aspirin, Metoprolol, etc." />
              </div>
              <Separator />
              <h3 className="font-medium">Emergency Contact</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Contact Name</Label>
                  <Input id="contact-name" placeholder="Jane Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-phone">Contact Phone</Label>
                  <Input id="contact-phone" placeholder="+1234567890" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-relation">Relationship</Label>
                <Input id="contact-relation" placeholder="Spouse, Child, etc." />
              </div>
              <Button className="w-full">Create Patient Record</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search patients by name or condition..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </CardContent>
      </Card>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Cases</TabsTrigger>
          <TabsTrigger value="all">All Patients</TabsTrigger>
          <TabsTrigger value="transferred">Transferred</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Patient Cases</CardTitle>
              <CardDescription>
                Patients currently being transported or treated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.filter(patient => {
                  const call = getPatientCall(patient.id);
                  return call && ['assigned', 'en_route', 'at_scene', 'transporting'].includes(call.status);
                }).map((patient) => {
                  const call = getPatientCall(patient.id);
                  const ambulance = call ? getAssignedAmbulance(call.id) : null;
                  const severity = getConditionSeverity(patient.medicalCondition);
                  
                  return (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{patient.name}</h3>
                            <Badge className={getGenderColor(patient.gender)}>
                              {patient.gender}, {patient.age}
                            </Badge>
                            <Badge variant={severity.color as any}>
                              {severity.level}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Heart className="h-3 w-3 mr-2 text-red-500" />
                              <span className="font-medium">Condition:</span>
                              <span className="ml-1">{patient.medicalCondition}</span>
                            </div>
                            
                            {patient.allergies.length > 0 && (
                              <div className="flex items-center">
                                <AlertTriangle className="h-3 w-3 mr-2 text-yellow-500" />
                                <span className="font-medium">Allergies:</span>
                                <span className="ml-1">{patient.allergies.join(', ')}</span>
                              </div>
                            )}
                            
                            <div className="flex items-center">
                              <MapPin className="h-3 w-3 mr-2" />
                              <span className="font-medium">Pickup:</span>
                              <span className="ml-1">{patient.pickupLocation.address}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Hospital className="h-3 w-3 mr-2" />
                              <span className="font-medium">Destination:</span>
                              <span className="ml-1">{patient.destination.hospitalName}</span>
                            </div>
                            
                            {ambulance && (
                              <div className="flex items-center">
                                <UserCheck className="h-3 w-3 mr-2" />
                                <span className="font-medium">Ambulance:</span>
                                <span className="ml-1">{ambulance.vehicleNumber}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileText className="h-4 w-4 mr-1" />
                                Medical Report
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Medical Report - {patient.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Patient Information</Label>
                                    <div className="text-sm space-y-1">
                                      <div>Name: {patient.name}</div>
                                      <div>Age: {patient.age}</div>
                                      <div>Gender: {patient.gender}</div>
                                      <div>Phone: {patient.phone || 'N/A'}</div>
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Emergency Contact</Label>
                                    <div className="text-sm space-y-1">
                                      <div>Name: {patient.emergencyContact.name}</div>
                                      <div>Phone: {patient.emergencyContact.phone}</div>
                                      <div>Relation: {patient.emergencyContact.relation}</div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Medical Condition</Label>
                                  <p className="text-sm bg-gray-50 p-2 rounded">
                                    {patient.medicalCondition}
                                  </p>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Allergies</Label>
                                    <div className="text-sm">
                                      {patient.allergies.length > 0 ? patient.allergies.join(', ') : 'None reported'}
                                    </div>
                                  </div>
                                  <div>
                                    <Label>Current Medications</Label>
                                    <div className="text-sm">
                                      {patient.medications.length > 0 ? patient.medications.join(', ') : 'None reported'}
                                    </div>
                                  </div>
                                </div>
                                
                                <div>
                                  <Label>Treatment Notes</Label>
                                  <Textarea placeholder="Add treatment notes..." className="mt-2" />
                                </div>
                                
                                <Button className="w-full">Send Report to Hospital</Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          
                          <Button variant="outline" size="sm">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Patient Records</CardTitle>
              <CardDescription>
                Complete patient database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.map((patient) => {
                  const severity = getConditionSeverity(patient.medicalCondition);
                  
                  return (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{patient.name}</h3>
                            <Badge className={getGenderColor(patient.gender)}>
                              {patient.gender}, {patient.age}
                            </Badge>
                            <Badge variant={severity.color as any}>
                              {severity.level}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-1">{patient.medicalCondition}</p>
                          
                          {patient.allergies.length > 0 && (
                            <div className="flex items-center text-sm text-yellow-600">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Allergies: {patient.allergies.join(', ')}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transferred" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transferred Patients</CardTitle>
              <CardDescription>
                Patients successfully transferred to hospitals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredPatients.filter(patient => {
                  const call = getPatientCall(patient.id);
                  return call && call.status === 'completed';
                }).map((patient) => {
                  const call = getPatientCall(patient.id);
                  
                  return (
                    <div key={patient.id} className="p-4 border rounded-lg bg-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-medium">{patient.name}</h3>
                            <Badge className={getGenderColor(patient.gender)}>
                              {patient.gender}, {patient.age}
                            </Badge>
                            <Badge variant="outline" className="text-green-600">
                              Transferred
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>{patient.medicalCondition}</div>
                            <div className="flex items-center">
                              <Hospital className="h-3 w-3 mr-1" />
                              {patient.destination.hospitalName}
                            </div>
                            {call && (
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Completed {new Date(call.createdAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4 mr-1" />
                          Report
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientManagement;
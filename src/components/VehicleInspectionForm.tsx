import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { AlertTriangle, CheckCircle, Wrench, Save } from 'lucide-react';
import { VehicleInspectionItem, DriverInspection } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'sonner@2.0.3';

const VehicleInspectionForm: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedAmbulance, setSelectedAmbulance] = useState('');
  const [selectedShift, setSelectedShift] = useState<'morning' | 'afternoon' | 'night'>('morning');
  const [mileage, setMileage] = useState('');
  const [fuelLevel, setFuelLevel] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const defaultInspectionItems: VehicleInspectionItem[] = [
    // Engine
    { name: 'Engine Oil Level', category: 'engine', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Coolant Level', category: 'engine', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Engine Performance', category: 'engine', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Air Filter', category: 'engine', condition: 'good', needsAttention: false, notes: '' },
    
    // Fluids
    { name: 'Brake Fluid', category: 'fluids', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Power Steering Fluid', category: 'fluids', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Windshield Washer Fluid', category: 'fluids', condition: 'good', needsAttention: false, notes: '' },
    
    // Brakes
    { name: 'Brake Pads', category: 'brakes', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Brake Performance', category: 'brakes', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Parking Brake', category: 'brakes', condition: 'good', needsAttention: false, notes: '' },
    
    // Tires
    { name: 'Front Tire Condition', category: 'tires', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Rear Tire Condition', category: 'tires', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Tire Pressure', category: 'tires', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Spare Tire', category: 'tires', condition: 'good', needsAttention: false, notes: '' },
    
    // Lights
    { name: 'Headlights', category: 'lights', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Tail Lights', category: 'lights', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Emergency Lights', category: 'lights', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Turn Signals', category: 'lights', condition: 'good', needsAttention: false, notes: '' },
    
    // Safety
    { name: 'Seat Belts', category: 'safety', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Mirrors', category: 'safety', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Windshield', category: 'safety', condition: 'good', needsAttention: false, notes: '' },
    
    // Electrical
    { name: 'Battery', category: 'electrical', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Alternator', category: 'electrical', condition: 'good', needsAttention: false, notes: '' },
    { name: 'Radio/Communication', category: 'electrical', condition: 'good', needsAttention: false, notes: '' }
  ];

  const [inspectionItems, setInspectionItems] = useState<VehicleInspectionItem[]>(defaultInspectionItems);

  const mockAmbulances = [
    { id: 'amb-001', vehicleNumber: 'AMB-001', model: 'Ford Transit' },
    { id: 'amb-002', vehicleNumber: 'AMB-002', model: 'Mercedes Sprinter' },
    { id: 'amb-003', vehicleNumber: 'AMB-003', model: 'Ford E-Series' }
  ];

  const conditionColors = {
    excellent: 'bg-green-100 text-green-800',
    good: 'bg-blue-100 text-blue-800',
    fair: 'bg-yellow-100 text-yellow-800',
    poor: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800'
  };

  const updateInspectionItem = (index: number, field: keyof VehicleInspectionItem, value: any) => {
    const updated = [...inspectionItems];
    updated[index] = { ...updated[index], [field]: value };
    setInspectionItems(updated);
  };

  const getOverallStatus = () => {
    const criticalItems = inspectionItems.filter(item => item.condition === 'critical');
    const needsAttentionItems = inspectionItems.filter(item => item.needsAttention);
    
    if (criticalItems.length > 0) return 'out_of_service';
    if (needsAttentionItems.length > 0) return 'needs_attention';
    return 'ready';
  };

  const handleSubmit = () => {
    if (!selectedAmbulance) {
      toast.error('Please select an ambulance');
      return;
    }

    if (!mileage || !fuelLevel) {
      toast.error('Please fill in mileage and fuel level');
      return;
    }

    const inspection: DriverInspection = {
      id: `insp-${Date.now()}`,
      driverId: currentUser?.id || '',
      ambulanceId: selectedAmbulance,
      date: new Date().toISOString().split('T')[0],
      shift: selectedShift,
      vehicleInspection: inspectionItems,
      mileage: parseInt(mileage),
      fuelLevel: parseInt(fuelLevel),
      overallStatus: getOverallStatus(),
      additionalNotes,
      submittedAt: new Date().toISOString()
    };

    // In a real app, this would be saved to the backend
    console.log('Vehicle Inspection Submitted:', inspection);
    toast.success('Vehicle inspection submitted successfully');
    
    // Reset form
    setInspectionItems(defaultInspectionItems);
    setMileage('');
    setFuelLevel('');
    setAdditionalNotes('');
  };

  const categoryGroups = inspectionItems.reduce((groups, item, index) => {
    if (!groups[item.category]) {
      groups[item.category] = [];
    }
    groups[item.category].push({ ...item, index });
    return groups;
  }, {} as Record<string, Array<VehicleInspectionItem & { index: number }>>);

  const overallStatus = getOverallStatus();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Daily Vehicle Inspection</h1>
          <p className="text-muted-foreground">
            Complete your daily vehicle inspection to ensure ambulance readiness
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {overallStatus === 'ready' && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="h-3 w-3 mr-1" />
              Ready for Service
            </Badge>
          )}
          {overallStatus === 'needs_attention' && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Needs Attention
            </Badge>
          )}
          {overallStatus === 'out_of_service' && (
            <Badge className="bg-red-100 text-red-800">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Out of Service
            </Badge>
          )}
        </div>
      </div>

      {/* Form Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Wrench className="h-5 w-5 mr-2" />
            Inspection Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Select Ambulance</Label>
              <Select value={selectedAmbulance} onValueChange={setSelectedAmbulance}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose ambulance" />
                </SelectTrigger>
                <SelectContent>
                  {mockAmbulances.map((amb) => (
                    <SelectItem key={amb.id} value={amb.id}>
                      {amb.vehicleNumber} - {amb.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Shift</Label>
              <Select value={selectedShift} onValueChange={(value: any) => setSelectedShift(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (6:00-14:00)</SelectItem>
                  <SelectItem value="afternoon">Afternoon (14:00-22:00)</SelectItem>
                  <SelectItem value="night">Night (22:00-6:00)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Current Date</Label>
              <Input value={new Date().toLocaleDateString()} disabled />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Current Mileage</Label>
              <Input
                type="number"
                placeholder="Enter current mileage"
                value={mileage}
                onChange={(e) => setMileage(e.target.value)}
              />
            </div>
            
            <div>
              <Label>Fuel Level (%)</Label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="Enter fuel percentage"
                value={fuelLevel}
                onChange={(e) => setFuelLevel(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inspection Categories */}
      {Object.entries(categoryGroups).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="capitalize">{category.replace('_', ' ')} Inspection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.index} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4>{item.name}</h4>
                    <Badge className={conditionColors[item.condition]}>
                      {item.condition}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Condition</Label>
                      <Select
                        value={item.condition}
                        onValueChange={(value) => updateInspectionItem(item.index, 'condition', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`attention-${item.index}`}
                        checked={item.needsAttention}
                        onCheckedChange={(checked) => 
                          updateInspectionItem(item.index, 'needsAttention', checked)
                        }
                      />
                      <Label htmlFor={`attention-${item.index}`}>Needs Immediate Attention</Label>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Notes</Label>
                    <Textarea
                      placeholder="Add any notes or observations..."
                      value={item.notes}
                      onChange={(e) => updateInspectionItem(item.index, 'notes', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Additional Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Any additional observations, concerns, or recommendations..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button onClick={handleSubmit} className="flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Submit Inspection
        </Button>
      </div>
    </div>
  );
};

export default VehicleInspectionForm;
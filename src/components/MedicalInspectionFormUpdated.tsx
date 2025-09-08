import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { 
  Plus, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Edit,
  Trash2,
  Search,
  Filter
} from 'lucide-react';

interface EquipmentItem {
  id: string;
  name: string;
  category: 'monitoring' | 'respiratory' | 'cardiac' | 'trauma' | 'medication' | 'diagnostic';
  status: 'operational' | 'needs_maintenance' | 'out_of_service';
  expiryDate?: string;
  lastChecked: string;
  serialNumber: string;
  notes?: string;
}

const MedicalInspectionForm: React.FC = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([
    {
      id: '1',
      name: 'Defibrillator',
      category: 'cardiac',
      status: 'operational',
      lastChecked: '2024-01-15',
      serialNumber: 'DEF-001'
    },
    {
      id: '2',
      name: 'Oxygen Tank',
      category: 'respiratory',
      status: 'operational',
      expiryDate: '2024-12-31',
      lastChecked: '2024-01-15',
      serialNumber: 'OXY-001'
    },
    {
      id: '3',
      name: 'Blood Pressure Monitor',
      category: 'monitoring',
      status: 'needs_maintenance',
      lastChecked: '2024-01-10',
      serialNumber: 'BPM-001',
      notes: 'Display flickering'
    },
    {
      id: '4',
      name: 'Morphine 10mg',
      category: 'medication',
      status: 'operational',
      expiryDate: '2024-06-30',
      lastChecked: '2024-01-15',
      serialNumber: 'MED-001'
    }
  ]);

  const [inspectionResults, setInspectionResults] = useState<Record<string, any>>({});
  const [isAddEquipmentOpen, setIsAddEquipmentOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'default';
      case 'needs_maintenance': return 'secondary';
      case 'out_of_service': return 'destructive';
      default: return 'outline';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'cardiac': return 'bg-red-100 text-red-800';
      case 'respiratory': return 'bg-blue-100 text-blue-800';
      case 'monitoring': return 'bg-green-100 text-green-800';
      case 'trauma': return 'bg-orange-100 text-orange-800';
      case 'medication': return 'bg-purple-100 text-purple-800';
      case 'diagnostic': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getExpiryWarning = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { level: 'expired', color: 'destructive' };
    if (diffDays <= 30) return { level: 'expiring_soon', color: 'destructive' };
    if (diffDays <= 90) return { level: 'expires_soon', color: 'secondary' };
    return null;
  };

  const handleInspectionChange = (equipmentId: string, field: string, value: any) => {
    setInspectionResults(prev => ({
      ...prev,
      [equipmentId]: {
        ...prev[equipmentId],
        [field]: value
      }
    }));
  };

  const addNewEquipment = (newEquipment: Omit<EquipmentItem, 'id'>) => {
    const id = `eq_${Date.now()}`;
    setEquipment(prev => [...prev, { ...newEquipment, id }]);
    setIsAddEquipmentOpen(false);
  };

  const removeEquipment = (id: string) => {
    setEquipment(prev => prev.filter(item => item.id !== id));
  };

  const updateEquipmentStatus = (id: string, status: EquipmentItem['status']) => {
    setEquipment(prev => prev.map(item => 
      item.id === id ? { ...item, status, lastChecked: new Date().toISOString().split('T')[0] } : item
    ));
  };

  const submitInspection = () => {
    const report = {
      date: new Date().toISOString(),
      inspectedBy: 'Current Paramedic', // In real app, get from auth context
      equipment: filteredEquipment.map(item => ({
        ...item,
        inspection: inspectionResults[item.id] || {}
      }))
    };
    
    console.log('Inspection Report:', report);
    alert('Medical equipment inspection completed and logged!');
    
    // Reset inspection results
    setInspectionResults({});
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Medical Equipment Inspection</h1>
          <p className="text-gray-600">Inspect and manage medical equipment inventory</p>
        </div>
        <Dialog open={isAddEquipmentOpen} onOpenChange={setIsAddEquipmentOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
              <DialogDescription>Add a new piece of medical equipment to the inventory</DialogDescription>
            </DialogHeader>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              addNewEquipment({
                name: formData.get('name') as string,
                category: formData.get('category') as EquipmentItem['category'],
                status: 'operational',
                serialNumber: formData.get('serialNumber') as string,
                expiryDate: formData.get('expiryDate') as string || undefined,
                lastChecked: new Date().toISOString().split('T')[0],
                notes: formData.get('notes') as string || undefined
              });
            }}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Equipment Name</Label>
                  <Input id="name" name="name" placeholder="Defibrillator" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monitoring">Monitoring</SelectItem>
                      <SelectItem value="respiratory">Respiratory</SelectItem>
                      <SelectItem value="cardiac">Cardiac</SelectItem>
                      <SelectItem value="trauma">Trauma</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="diagnostic">Diagnostic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input id="serialNumber" name="serialNumber" placeholder="SN123456" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date (if applicable)</Label>
                  <Input id="expiryDate" name="expiryDate" type="date" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" name="notes" placeholder="Additional notes..." />
                </div>
                
                <Button type="submit" className="w-full">Add Equipment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Equipment Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {equipment.filter(e => e.status === 'operational').length}
            </div>
            <div className="text-sm text-gray-600">Operational</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {equipment.filter(e => e.status === 'needs_maintenance').length}
            </div>
            <div className="text-sm text-gray-600">Needs Maintenance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">
              {equipment.filter(e => e.status === 'out_of_service').length}
            </div>
            <div className="text-sm text-gray-600">Out of Service</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {equipment.filter(e => {
                const warning = getExpiryWarning(e.expiryDate);
                return warning && ['expired', 'expiring_soon'].includes(warning.level);
              }).length}
            </div>
            <div className="text-sm text-gray-600">Expired/Expiring</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search Equipment</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or serial number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Filter by Category</Label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="respiratory">Respiratory</SelectItem>
                  <SelectItem value="cardiac">Cardiac</SelectItem>
                  <SelectItem value="trauma">Trauma</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Filter by Status</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="operational">Operational</SelectItem>
                  <SelectItem value="needs_maintenance">Needs Maintenance</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Equipment Inspection List */}
      <Card>
        <CardHeader>
          <CardTitle>Equipment Inspection Checklist</CardTitle>
          <CardDescription>
            Review and inspect each piece of medical equipment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEquipment.map((item) => {
              const expiryWarning = getExpiryWarning(item.expiryDate);
              const inspection = inspectionResults[item.id] || {};
              
              return (
                <div key={item.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status.replace('_', ' ')}
                        </Badge>
                        {expiryWarning && (
                          <Badge variant={expiryWarning.color as any}>
                            {expiryWarning.level === 'expired' ? 'EXPIRED' : 'EXPIRING SOON'}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>Serial: {item.serialNumber}</div>
                        {item.expiryDate && (
                          <div>Expires: {new Date(item.expiryDate).toLocaleDateString()}</div>
                        )}
                        <div>Last Checked: {new Date(item.lastChecked).toLocaleDateString()}</div>
                        {item.notes && <div>Notes: {item.notes}</div>}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateEquipmentStatus(item.id, 'operational')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Operational
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateEquipmentStatus(item.id, 'needs_maintenance')}
                      >
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Maintenance
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeEquipment(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Inspection Checklist */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item.id}-physical`}
                          checked={inspection.physicalCondition || false}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item.id, 'physicalCondition', checked)
                          }
                        />
                        <Label htmlFor={`${item.id}-physical`}>Physical condition good</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item.id}-functional`}
                          checked={inspection.functional || false}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item.id, 'functional', checked)
                          }
                        />
                        <Label htmlFor={`${item.id}-functional`}>Functional test passed</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item.id}-calibrated`}
                          checked={inspection.calibrated || false}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item.id, 'calibrated', checked)
                          }
                        />
                        <Label htmlFor={`${item.id}-calibrated`}>Properly calibrated</Label>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item.id}-clean`}
                          checked={inspection.clean || false}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item.id, 'clean', checked)
                          }
                        />
                        <Label htmlFor={`${item.id}-clean`}>Clean and sanitized</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item.id}-accessories`}
                          checked={inspection.accessories || false}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item.id, 'accessories', checked)
                          }
                        />
                        <Label htmlFor={`${item.id}-accessories`}>All accessories present</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${item.id}-expiry`}
                          checked={inspection.expiry || false}
                          onCheckedChange={(checked) => 
                            handleInspectionChange(item.id, 'expiry', checked)
                          }
                        />
                        <Label htmlFor={`${item.id}-expiry`}>Expiry dates checked</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <Label htmlFor={`${item.id}-notes`}>Inspection Notes</Label>
                    <Textarea
                      id={`${item.id}-notes`}
                      placeholder="Add any inspection notes or issues found..."
                      value={inspection.notes || ''}
                      onChange={(e) => 
                        handleInspectionChange(item.id, 'notes', e.target.value)
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              );
            })}
          </div>
          
          {filteredEquipment.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <Button onClick={submitInspection} className="w-full">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Equipment Inspection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicalInspectionForm;
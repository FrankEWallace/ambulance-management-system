import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  ClipboardCheck, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  FileText,
  Download,
  Filter,
  Package,
  Shield,
  Activity
} from 'lucide-react';
import { ParamedicInspection, MedicalEquipmentItem } from '../types';

const MedicalInspectionDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedAmbulance, setSelectedAmbulance] = useState('all');

  // Mock data for demonstration
  const mockInspections: ParamedicInspection[] = [
    {
      id: 'med-insp-001',
      paramedicId: 'paramedic-001',
      ambulanceId: 'amb-001',
      date: '2024-01-20',
      shift: 'morning',
      medicalEquipment: [
        { name: 'Defibrillator/AED', category: 'life_support', isWorking: true, needsReplacement: false },
        { name: 'Epinephrine Auto-Injector', category: 'medication', isWorking: true, needsReplacement: true, expiryDate: '2024-02-15' },
        { name: 'ECG Monitor', category: 'monitoring', isWorking: false, needsReplacement: true }
      ],
      overallStatus: 'needs_attention',
      additionalNotes: 'ECG monitor display flickering',
      submittedAt: '2024-01-20T08:00:00Z'
    },
    {
      id: 'med-insp-002',
      paramedicId: 'paramedic-002',
      ambulanceId: 'amb-002',
      date: '2024-01-20',
      shift: 'afternoon',
      medicalEquipment: [
        { name: 'Oxygen Tank (Primary)', category: 'life_support', isWorking: true, needsReplacement: false },
        { name: 'Nitroglycerin', category: 'medication', isWorking: true, needsReplacement: false, expiryDate: '2023-12-20' },
        { name: 'Stethoscope', category: 'diagnostic', isWorking: true, needsReplacement: false }
      ],
      overallStatus: 'out_of_service',
      additionalNotes: 'Nitroglycerin expired',
      submittedAt: '2024-01-20T16:00:00Z'
    }
  ];

  const mockAmbulances = [
    { id: 'amb-001', vehicleNumber: 'AMB-001', model: 'Ford Transit' },
    { id: 'amb-002', vehicleNumber: 'AMB-002', model: 'Mercedes Sprinter' },
    { id: 'amb-003', vehicleNumber: 'AMB-003', model: 'Ford E-Series' }
  ];

  // Generate statistics
  const getStatusCounts = () => {
    const statusCounts = { ready: 0, needs_attention: 0, out_of_service: 0 };
    mockInspections.forEach(inspection => {
      statusCounts[inspection.overallStatus]++;
    });
    return statusCounts;
  };

  const getCategoryIssues = () => {
    const categoryIssues: Record<string, number> = {};
    mockInspections.forEach(inspection => {
      inspection.medicalEquipment.forEach(item => {
        if (!item.isWorking || item.needsReplacement) {
          categoryIssues[item.category] = (categoryIssues[item.category] || 0) + 1;
        }
      });
    });
    return Object.entries(categoryIssues).map(([category, count]) => ({
      category: category.replace('_', ' ').toUpperCase(),
      issues: count
    }));
  };

  const getEquipmentStatus = () => {
    let workingCount = 0;
    let notWorkingCount = 0;
    let needsReplacementCount = 0;
    
    mockInspections.forEach(inspection => {
      inspection.medicalEquipment.forEach(item => {
        if (item.isWorking) workingCount++;
        else notWorkingCount++;
        if (item.needsReplacement) needsReplacementCount++;
      });
    });
    
    return { workingCount, notWorkingCount, needsReplacementCount };
  };

  const getExpiryAlerts = () => {
    const alerts: Array<{
      ambulance: string;
      equipmentName: string;
      expiryDate: string;
      status: 'expired' | 'expiring_soon';
      inspection: ParamedicInspection;
    }> = [];
    
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    mockInspections.forEach(inspection => {
      const ambulance = mockAmbulances.find(amb => amb.id === inspection.ambulanceId)?.vehicleNumber || 'Unknown';
      
      inspection.medicalEquipment.forEach(item => {
        if (item.expiryDate) {
          const expiryDate = new Date(item.expiryDate);
          if (expiryDate < now) {
            alerts.push({
              ambulance,
              equipmentName: item.name,
              expiryDate: item.expiryDate,
              status: 'expired',
              inspection
            });
          } else if (expiryDate <= thirtyDaysFromNow) {
            alerts.push({
              ambulance,
              equipmentName: item.name,
              expiryDate: item.expiryDate,
              status: 'expiring_soon',
              inspection
            });
          }
        }
      });
    });
    
    return alerts;
  };

  const getCriticalAlerts = () => {
    return mockInspections.filter(inspection => 
      inspection.overallStatus === 'needs_attention' || 
      inspection.overallStatus === 'out_of_service'
    ).map(inspection => ({
      ...inspection,
      ambulance: mockAmbulances.find(amb => amb.id === inspection.ambulanceId)?.vehicleNumber || 'Unknown',
      criticalEquipment: inspection.medicalEquipment.filter(item => 
        !item.isWorking || item.needsReplacement || 
        (item.expiryDate && new Date(item.expiryDate) < new Date())
      )
    }));
  };

  const statusCounts = getStatusCounts();
  const categoryIssues = getCategoryIssues();
  const equipmentStatus = getEquipmentStatus();
  const expiryAlerts = getExpiryAlerts();
  const criticalAlerts = getCriticalAlerts();

  const statusData = [
    { name: 'Ready', value: statusCounts.ready, color: '#10B981' },
    { name: 'Needs Attention', value: statusCounts.needs_attention, color: '#F59E0B' },
    { name: 'Out of Service', value: statusCounts.out_of_service, color: '#EF4444' }
  ];

  const equipmentStatusData = [
    { name: 'Working', value: equipmentStatus.workingCount, color: '#10B981' },
    { name: 'Not Working', value: equipmentStatus.notWorkingCount, color: '#EF4444' },
    { name: 'Needs Replacement', value: equipmentStatus.needsReplacementCount, color: '#F59E0B' }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Medical Equipment Analytics</h1>
          <p className="text-muted-foreground">
            Monitor and analyze medical equipment inspection data and maintenance needs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Period</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Ambulance</label>
              <Select value={selectedAmbulance} onValueChange={setSelectedAmbulance}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ambulances</SelectItem>
                  {mockAmbulances.map((amb) => (
                    <SelectItem key={amb.id} value={amb.id}>
                      {amb.vehicleNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Category</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="life_support">Life Support</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="surgical">Surgical</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="safety">Safety</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Inspections</p>
                <p className="text-2xl font-bold">{mockInspections.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Equipment Ready</p>
                <p className="text-2xl font-bold text-green-600">{statusCounts.ready}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold text-yellow-600">{statusCounts.needs_attention}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Out of Service</p>
                <p className="text-2xl font-bold text-red-600">{statusCounts.out_of_service}</p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expiry Alerts</p>
                <p className="text-2xl font-bold text-orange-600">{expiryAlerts.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expiry" className="space-y-4">
        <TabsList>
          <TabsTrigger value="expiry">Expiry Management</TabsTrigger>
          <TabsTrigger value="alerts">Critical Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="expiry" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Expiry Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiryAlerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No expiry alerts</p>
                ) : (
                  expiryAlerts.map((alert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4>{alert.equipmentName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {alert.ambulance} - Expires: {new Date(alert.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge className={
                          alert.status === 'expired' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-orange-100 text-orange-800'
                        }>
                          {alert.status === 'expired' ? 'Expired' : 'Expiring Soon'}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Critical Equipment Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {criticalAlerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No critical alerts</p>
                ) : (
                  criticalAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4>{alert.ambulance}</h4>
                          <p className="text-sm text-muted-foreground">
                            Inspected on {new Date(alert.date).toLocaleDateString()} - {alert.shift} shift
                          </p>
                        </div>
                        <Badge className={
                          alert.overallStatus === 'out_of_service' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }>
                          {alert.overallStatus.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">Critical Equipment:</p>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {alert.criticalEquipment.map((equipment, idx) => (
                            <li key={idx} className="text-red-600">
                              {equipment.name} - 
                              {!equipment.isWorking && ' Not Working'}
                              {equipment.needsReplacement && ' Needs Replacement'}
                              {equipment.expiryDate && new Date(equipment.expiryDate) < new Date() && ' Expired'}
                            </li>
                          ))}
                        </ul>
                        {alert.additionalNotes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Notes: {alert.additionalNotes}
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default MedicalInspectionDashboard;
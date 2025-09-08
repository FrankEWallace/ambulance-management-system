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
  Wrench, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp, 
  Calendar,
  FileText,
  Download,
  Filter
} from 'lucide-react';
import { DriverInspection, VehicleInspectionItem } from '../types';

const VehicleInspectionDashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedAmbulance, setSelectedAmbulance] = useState('all');

  // Mock data for demonstration
  const mockInspections: DriverInspection[] = [
    {
      id: 'insp-001',
      driverId: 'driver-001',
      ambulanceId: 'amb-001',
      date: '2024-01-20',
      shift: 'morning',
      vehicleInspection: [
        { name: 'Engine Oil Level', category: 'engine', condition: 'good', needsAttention: false },
        { name: 'Brake Fluid', category: 'fluids', condition: 'fair', needsAttention: true },
        { name: 'Tire Pressure', category: 'tires', condition: 'excellent', needsAttention: false }
      ],
      mileage: 85420,
      fuelLevel: 75,
      overallStatus: 'needs_attention',
      additionalNotes: 'Brake fluid level low',
      submittedAt: '2024-01-20T08:00:00Z'
    },
    {
      id: 'insp-002',
      driverId: 'driver-002',
      ambulanceId: 'amb-002',
      date: '2024-01-20',
      shift: 'afternoon',
      vehicleInspection: [
        { name: 'Engine Oil Level', category: 'engine', condition: 'excellent', needsAttention: false },
        { name: 'Brake Fluid', category: 'fluids', condition: 'good', needsAttention: false },
        { name: 'Headlights', category: 'lights', condition: 'poor', needsAttention: true }
      ],
      mileage: 92150,
      fuelLevel: 60,
      overallStatus: 'needs_attention',
      additionalNotes: 'Left headlight dim',
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
      inspection.vehicleInspection.forEach(item => {
        if (item.needsAttention) {
          categoryIssues[item.category] = (categoryIssues[item.category] || 0) + 1;
        }
      });
    });
    return Object.entries(categoryIssues).map(([category, count]) => ({
      category: category.replace('_', ' ').toUpperCase(),
      issues: count
    }));
  };

  const getConditionDistribution = () => {
    const conditionCounts: Record<string, number> = {};
    mockInspections.forEach(inspection => {
      inspection.vehicleInspection.forEach(item => {
        conditionCounts[item.condition] = (conditionCounts[item.condition] || 0) + 1;
      });
    });
    return Object.entries(conditionCounts).map(([condition, count]) => ({
      condition: condition.charAt(0).toUpperCase() + condition.slice(1),
      count,
      percentage: Math.round((count / mockInspections.length) * 100)
    }));
  };

  const getMaintenanceAlerts = () => {
    return mockInspections.filter(inspection => 
      inspection.overallStatus === 'needs_attention' || 
      inspection.overallStatus === 'out_of_service'
    ).map(inspection => ({
      ...inspection,
      ambulance: mockAmbulances.find(amb => amb.id === inspection.ambulanceId)?.vehicleNumber || 'Unknown',
      criticalIssues: inspection.vehicleInspection.filter(item => 
        item.needsAttention || item.condition === 'critical' || item.condition === 'poor'
      )
    }));
  };

  const statusCounts = getStatusCounts();
  const categoryIssues = getCategoryIssues();
  const conditionDistribution = getConditionDistribution();
  const maintenanceAlerts = getMaintenanceAlerts();

  const statusData = [
    { name: 'Ready', value: statusCounts.ready, color: '#10B981' },
    { name: 'Needs Attention', value: statusCounts.needs_attention, color: '#F59E0B' },
    { name: 'Out of Service', value: statusCounts.out_of_service, color: '#EF4444' }
  ];

  const conditionColors = {
    excellent: '#10B981',
    good: '#3B82F6',
    fair: '#F59E0B',
    poor: '#F97316',
    critical: '#EF4444'
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Vehicle Inspection Analytics</h1>
          <p className="text-muted-foreground">
            Monitor and analyze vehicle inspection data and maintenance needs
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
              <label className="text-sm font-medium mb-2 block">Status</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="ready">Ready</SelectItem>
                  <SelectItem value="needs_attention">Needs Attention</SelectItem>
                  <SelectItem value="out_of_service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <p className="text-sm font-medium text-muted-foreground">Vehicles Ready</p>
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
              <Wrench className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Maintenance Alerts</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Maintenance Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {maintenanceAlerts.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No active maintenance alerts</p>
                ) : (
                  maintenanceAlerts.map((alert) => (
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
                        <p className="text-sm font-medium mb-2">Critical Issues:</p>
                        <ul className="text-sm list-disc list-inside space-y-1">
                          {alert.criticalIssues.map((issue, idx) => (
                            <li key={idx} className="text-red-600">
                              {issue.name} - {issue.condition} 
                              {issue.needsAttention && ' (Needs immediate attention)'}
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

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inspection Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={[
                    { date: '2024-01-15', ready: 8, needsAttention: 2, outOfService: 0 },
                    { date: '2024-01-16', ready: 7, needsAttention: 3, outOfService: 0 },
                    { date: '2024-01-17', ready: 9, needsAttention: 1, outOfService: 0 },
                    { date: '2024-01-18', ready: 6, needsAttention: 3, outOfService: 1 },
                    { date: '2024-01-19', ready: 8, needsAttention: 2, outOfService: 0 },
                    { date: '2024-01-20', ready: 7, needsAttention: 3, outOfService: 0 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ready" stroke="#10B981" name="Ready" />
                    <Line type="monotone" dataKey="needsAttention" stroke="#F59E0B" name="Needs Attention" />
                    <Line type="monotone" dataKey="outOfService" stroke="#EF4444" name="Out of Service" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VehicleInspectionDashboard;
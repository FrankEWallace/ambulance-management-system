import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Truck, 
  Phone, 
  DollarSign,
  Calendar,
  Users,
  AlertTriangle
} from 'lucide-react';
import { mockEmergencyCalls, mockAmbulances, mockTrips } from '../data/mockData';

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [reportType, setReportType] = useState('overview');

  // Mock data for charts
  const responseTimeData = [
    { day: 'Mon', avgTime: 8.5, target: 10 },
    { day: 'Tue', avgTime: 7.2, target: 10 },
    { day: 'Wed', avgTime: 9.1, target: 10 },
    { day: 'Thu', avgTime: 6.8, target: 10 },
    { day: 'Fri', avgTime: 8.9, target: 10 },
    { day: 'Sat', avgTime: 7.5, target: 10 },
    { day: 'Sun', avgTime: 8.3, target: 10 }
  ];

  const callVolumeData = [
    { hour: '00:00', calls: 2 },
    { hour: '04:00', calls: 1 },
    { hour: '08:00', calls: 8 },
    { hour: '12:00', calls: 12 },
    { hour: '16:00', calls: 15 },
    { hour: '20:00', calls: 10 },
    { hour: '24:00', calls: 5 }
  ];

  const priorityDistribution = [
    { name: 'Critical', value: 15, color: '#ef4444' },
    { name: 'High', value: 25, color: '#f97316' },
    { name: 'Medium', value: 35, color: '#eab308' },
    { name: 'Low', value: 25, color: '#22c55e' }
  ];

  const fleetUtilizationData = [
    { vehicle: 'AMB-001', utilization: 85 },
    { vehicle: 'AMB-002', utilization: 92 },
    { vehicle: 'AMB-003', utilization: 45 },
    { vehicle: 'AMB-004', utilization: 78 },
    { vehicle: 'AMB-005', utilization: 67 }
  ];

  // Calculate metrics
  const totalCalls = mockEmergencyCalls.length;
  const completedCalls = mockEmergencyCalls.filter(c => c.status === 'completed').length;
  const avgResponseTime = 8.5;
  const totalRevenue = mockTrips.reduce((sum, trip) => sum + trip.cost, 0);
  const activeAmbulances = mockAmbulances.filter(a => ['en_route', 'at_scene', 'transporting'].includes(a.status)).length;

  const criticalCalls = mockEmergencyCalls.filter(c => c.priority === 'critical').length;
  const successRate = ((completedCalls / totalCalls) * 100).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-gray-600">Performance metrics and system analytics</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Calls</p>
                <p className="text-2xl font-bold">{totalCalls}</p>
              </div>
              <Phone className="h-8 w-8 text-blue-500" />
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% vs last week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response</p>
                <p className="text-2xl font-bold">{avgResponseTime}m</p>
              </div>
              <Clock className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              15% faster
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">{successRate}%</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex items-center text-sm text-red-600 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -2% vs target
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Fleet</p>
                <p className="text-2xl font-bold">{activeAmbulances}</p>
              </div>
              <Truck className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              of {mockAmbulances.length} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Calls</p>
                <p className="text-2xl font-bold text-red-600">{criticalCalls}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Urgent priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <div className="flex items-center text-sm text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% vs last week
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="fleet">Fleet Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Response Time Trends</CardTitle>
                <CardDescription>Average response time over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={responseTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="avgTime" stroke="#3b82f6" strokeWidth={2} name="Avg Time (min)" />
                    <Line type="monotone" dataKey="target" stroke="#ef4444" strokeDasharray="5 5" name="Target (min)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call Priority Distribution</CardTitle>
                <CardDescription>Emergency call priorities for this period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={priorityDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {priorityDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Call Volume by Hour</CardTitle>
                <CardDescription>Emergency calls throughout the day</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={callVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="calls" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Targets</CardTitle>
                <CardDescription>Achievement against set targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Time (&lt;10 min)</span>
                    <span>85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Call Completion Rate</span>
                    <span>94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fleet Availability</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Patient Satisfaction</span>
                    <span>92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Operations Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Dispatches</span>
                  <Badge variant="secondary">24</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Successful Transfers</span>
                  <Badge variant="secondary">22</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cancelled Calls</span>
                  <Badge variant="destructive">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Average Trip Duration</span>
                  <Badge variant="outline">42 min</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Morning Rush (8-10 AM)</span>
                    <span>18 calls</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Afternoon Peak (2-4 PM)</span>
                    <span>22 calls</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Evening Rush (6-8 PM)</span>
                    <span>15 calls</span>
                  </div>
                  <Progress value={63} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Geographic Distribution</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Downtown</span>
                  <Badge variant="secondary">35%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Suburbs</span>
                  <Badge variant="secondary">28%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Industrial</span>
                  <Badge variant="secondary">20%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Rural</span>
                  <Badge variant="secondary">17%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Analysis</CardTitle>
                <CardDescription>Financial performance overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Avg Trip Cost</p>
                    <p className="text-xl font-bold text-blue-600">${(totalRevenue / mockTrips.length).toFixed(0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Breakdown</CardTitle>
                <CardDescription>Operating expenses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fuel & Maintenance</span>
                    <span>35%</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Staff Salaries</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Equipment & Supplies</span>
                    <span>15%</span>
                  </div>
                  <Progress value={15} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Other Expenses</span>
                    <span>5%</span>
                  </div>
                  <Progress value={5} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fleet Utilization</CardTitle>
              <CardDescription>Vehicle usage and efficiency metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fleetUtilizationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="vehicle" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="utilization" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Due This Week</span>
                  <Badge variant="destructive">2</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Due Next Week</span>
                  <Badge variant="secondary">1</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Overdue</span>
                  <Badge variant="destructive">0</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Vehicle Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Available</span>
                  <Badge variant="outline">{mockAmbulances.filter(a => a.status === 'available').length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Active</span>
                  <Badge variant="secondary">{activeAmbulances}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Maintenance</span>
                  <Badge variant="destructive">{mockAmbulances.filter(a => a.status === 'maintenance').length}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Avg Speed</span>
                  <Badge variant="outline">45 km/h</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Fuel Efficiency</span>
                  <Badge variant="outline">12 L/100km</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span>Uptime</span>
                  <Badge variant="outline">94.5%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
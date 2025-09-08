import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  Truck, 
  Phone, 
  User, 
  Clock, 
  TrendingUp, 
  MapPin,
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Users
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { mockAmbulances, mockEmergencyCalls, mockPatients, mockTrips, mockUsers } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { currentUser } = useAuth();

  // Calculate key metrics
  const availableAmbulances = mockAmbulances.filter(a => a.status === 'available').length;
  const activeAmbulances = mockAmbulances.filter(a => ['en_route', 'at_scene', 'transporting'].includes(a.status)).length;
  const pendingCalls = mockEmergencyCalls.filter(c => c.status === 'pending').length;
  const activeCalls = mockEmergencyCalls.filter(c => ['assigned', 'en_route', 'at_scene', 'transporting'].includes(c.status)).length;
  const criticalCalls = mockEmergencyCalls.filter(c => c.priority === 'critical').length;
  const completedCalls = mockEmergencyCalls.filter(c => c.status === 'completed').length;
  const totalUsers = mockUsers.length;
  const activePatients = mockPatients.filter(p => p.status === 'active').length;
  const avgResponseTime = 8.5; // minutes
  const fleetUtilization = (activeAmbulances / mockAmbulances.length) * 100;

  // Analytics data
  const callTrendData = [
    { month: 'Jan', calls: 145, completed: 138, cancelled: 7 },
    { month: 'Feb', calls: 162, completed: 155, cancelled: 7 },
    { month: 'Mar', calls: 178, completed: 169, cancelled: 9 },
    { month: 'Apr', calls: 156, completed: 148, cancelled: 8 },
    { month: 'May', calls: 189, completed: 180, cancelled: 9 },
    { month: 'Jun', calls: 203, completed: 194, cancelled: 9 }
  ];

  const responseTimeData = [
    { day: 'Mon', avgTime: 7.2, target: 8.0 },
    { day: 'Tue', avgTime: 8.5, target: 8.0 },
    { day: 'Wed', avgTime: 6.8, target: 8.0 },
    { day: 'Thu', avgTime: 9.1, target: 8.0 },
    { day: 'Fri', avgTime: 8.9, target: 8.0 },
    { day: 'Sat', avgTime: 7.3, target: 8.0 },
    { day: 'Sun', avgTime: 6.9, target: 8.0 }
  ];

  const fleetStatusData = [
    { name: 'Available', value: availableAmbulances, color: '#10B981' },
    { name: 'Active', value: activeAmbulances, color: '#3B82F6' },
    { name: 'Maintenance', value: mockAmbulances.filter(a => a.status === 'maintenance').length, color: '#F59E0B' }
  ];

  const callPriorityData = [
    { name: 'Critical', value: mockEmergencyCalls.filter(c => c.priority === 'critical').length, color: '#EF4444' },
    { name: 'High', value: mockEmergencyCalls.filter(c => c.priority === 'high').length, color: '#F97316' },
    { name: 'Medium', value: mockEmergencyCalls.filter(c => c.priority === 'medium').length, color: '#EAB308' },
    { name: 'Low', value: mockEmergencyCalls.filter(c => c.priority === 'low').length, color: '#22C55E' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'en_route': return 'bg-blue-500';
      case 'at_scene': return 'bg-yellow-500';
      case 'transporting': return 'bg-orange-500';
      case 'maintenance': return 'bg-gray-500';
      default: return 'bg-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Dashboard & Analytics</h1>
          <p className="text-gray-600">Comprehensive overview of system operations and performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-2 w-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-600">System Online</span>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Calls Today</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockEmergencyCalls.length}</div>
            <p className="text-xs text-green-600">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              +12% from yesterday
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fleet Utilization</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetUtilization.toFixed(0)}%</div>
            <Progress value={fleetUtilization} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{avgResponseTime}m</div>
            <p className="text-xs text-green-600">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Within target (8m)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-gray-600">
              {mockUsers.filter(u => u.role === 'driver').length} drivers, {mockUsers.filter(u => u.role === 'paramedic').length} paramedics
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Critical Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Critical Status Overview</CardTitle>
                <CardDescription>Immediate attention required</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg border-red-200 bg-red-50">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-800">Critical Calls Pending</p>
                        <p className="text-sm text-red-600">{criticalCalls} calls need immediate dispatch</p>
                      </div>
                    </div>
                    <Badge variant="destructive">{criticalCalls}</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium">Available Ambulances</p>
                        <p className="text-sm text-gray-600">Ready for dispatch</p>
                      </div>
                    </div>
                    <Badge variant="secondary">{availableAmbulances}</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Activity className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Active Operations</p>
                        <p className="text-sm text-gray-600">Currently in progress</p>
                      </div>
                    </div>
                    <Badge variant="default">{activeCalls}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>Overall system performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Call Success Rate</span>
                    <span className="text-sm text-green-600">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Fleet Availability</span>
                    <span className="text-sm text-blue-600">{((availableAmbulances / mockAmbulances.length) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(availableAmbulances / mockAmbulances.length) * 100} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">User Activity</span>
                    <span className="text-sm text-purple-600">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Emergency Calls</CardTitle>
              <CardDescription>Latest emergency requests and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockEmergencyCalls.slice(0, 5).map((call) => (
                  <div key={call.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getPriorityColor(call.priority)}>
                          {call.priority}
                        </Badge>
                        <span className="text-sm font-medium">{call.callerName}</span>
                        {call.priority === 'critical' && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{call.description}</p>
                      <p className="text-xs text-gray-500">{call.location.address}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant={call.status === 'pending' ? 'destructive' : 'secondary'}>
                        {call.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(call.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Average Response Time */}
            <Card>
              <CardHeader>
                <CardTitle>Average Response Time</CardTitle>
                <CardDescription>Daily response time performance vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={responseTimeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="avgTime" stroke="#3B82F6" name="Avg Response Time (min)" strokeWidth={3} />
                      <Line type="monotone" dataKey="target" stroke="#EF4444" name="Target (8min)" strokeDasharray="5 5" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ambulance Availability */}
            <Card>
              <CardHeader>
                <CardTitle>Ambulance Availability %</CardTitle>
                <CardDescription>Fleet availability over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { day: 'Mon', availability: 85 },
                      { day: 'Tue', availability: 78 },
                      { day: 'Wed', availability: 92 },
                      { day: 'Thu', availability: 67 },
                      { day: 'Fri', availability: 73 },
                      { day: 'Sat', availability: 89 },
                      { day: 'Sun', availability: 94 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="availability" fill="#10B981" name="Availability %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Number of Emergencies Served */}
            <Card>
              <CardHeader>
                <CardTitle>Number of Emergencies Served</CardTitle>
                <CardDescription>Monthly emergency call volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={callTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="calls" fill="#3B82F6" name="Total Emergencies" />
                      <Bar dataKey="completed" fill="#10B981" name="Successfully Served" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Breakdown Rate */}
            <Card>
              <CardHeader>
                <CardTitle>Breakdown Rate</CardTitle>
                <CardDescription>Vehicle breakdown incidents per month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', breakdowns: 2, vehicles: 12 },
                      { month: 'Feb', breakdowns: 1, vehicles: 12 },
                      { month: 'Mar', breakdowns: 3, vehicles: 12 },
                      { month: 'Apr', breakdowns: 1, vehicles: 12 },
                      { month: 'May', breakdowns: 2, vehicles: 12 },
                      { month: 'Jun', breakdowns: 0, vehicles: 12 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="breakdowns" stroke="#EF4444" name="Breakdown Count" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Paramedic Response Time */}
            <Card>
              <CardHeader>
                <CardTitle>Paramedic Response Time</CardTitle>
                <CardDescription>Average time from call to paramedic arrival</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={[
                      { day: 'Mon', paramedicTime: 12.5, overallTime: 8.2 },
                      { day: 'Tue', paramedicTime: 14.1, overallTime: 8.5 },
                      { day: 'Wed', paramedicTime: 11.8, overallTime: 6.8 },
                      { day: 'Thu', paramedicTime: 15.2, overallTime: 9.1 },
                      { day: 'Fri', paramedicTime: 13.6, overallTime: 8.9 },
                      { day: 'Sat', paramedicTime: 10.9, overallTime: 7.3 },
                      { day: 'Sun', paramedicTime: 11.4, overallTime: 6.9 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="overallTime" fill="#3B82F6" name="Overall Response (min)" />
                      <Bar dataKey="paramedicTime" fill="#F59E0B" name="Paramedic Response (min)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Case Outcome Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Case Outcome Trends</CardTitle>
                <CardDescription>Treatment outcomes over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[
                      { month: 'Jan', transported: 118, treated: 27 },
                      { month: 'Feb', transported: 125, treated: 30 },
                      { month: 'Mar', transported: 142, treated: 27 },
                      { month: 'Apr', transported: 119, treated: 29 },
                      { month: 'May', transported: 151, treated: 29 },
                      { month: 'Jun', transported: 163, transported: 31 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="transported" stroke="#3B82F6" name="Transported to Hospital" strokeWidth={3} />
                      <Line type="monotone" dataKey="treated" stroke="#10B981" name="Treat & Release" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Equipment Status */}
            <Card>
              <CardHeader>
                <CardTitle>Equipment Status</CardTitle>
                <CardDescription>Medical equipment condition across fleet</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Operational', value: 85, color: '#10B981' },
                          { name: 'Needs Maintenance', value: 12, color: '#F59E0B' },
                          { name: 'Out of Service', value: 3, color: '#EF4444' }
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {[
                          { name: 'Operational', value: 85, color: '#10B981' },
                          { name: 'Needs Maintenance', value: 12, color: '#F59E0B' },
                          { name: 'Out of Service', value: 3, color: '#EF4444' }
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Daily/Monthly Reports Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Daily/Monthly Reports</CardTitle>
                <CardDescription>Key performance indicators summary</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{avgResponseTime}m</div>
                      <p className="text-sm text-gray-600">Avg Response Time</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{fleetUtilization.toFixed(0)}%</div>
                      <p className="text-sm text-gray-600">Fleet Availability</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{mockEmergencyCalls.length}</div>
                      <p className="text-sm text-gray-600">Emergencies Served</p>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">1.2%</div>
                      <p className="text-sm text-gray-600">Breakdown Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>


      </Tabs>
    </div>
  );
};

export default Dashboard;
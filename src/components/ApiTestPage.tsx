import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { usersApi, ambulancesApi, patientsApi, authApi } from '../services/apiService';
import { User, Ambulance, Patient } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
}

const ApiTestPage: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([
    { name: 'Authentication Token', status: 'pending' },
    { name: 'User Profile', status: 'pending' },
    { name: 'Users List', status: 'pending' },
    { name: 'Ambulances List', status: 'pending' },
    { name: 'Patients List', status: 'pending' },
  ]);

  const [allData, setAllData] = useState<{
    users: User[];
    ambulances: Ambulance[];
    patients: Patient[];
  }>({
    users: [],
    ambulances: [],
    patients: []
  });

  const [isRunning, setIsRunning] = useState(false);
  const { currentUser } = useAuth();

  const updateTestResult = (index: number, status: 'success' | 'error', data?: any, error?: string) => {
    setTests(prev => prev.map((test, i) => 
      i === index ? { ...test, status, data, error } : test
    ));
  };

  const runAllTests = async () => {
    setIsRunning(true);
    
    try {
      // Test 1: Check if we have a token
      const token = localStorage.getItem('auth_token');
      if (token) {
        updateTestResult(0, 'success', { token: token.substring(0, 20) + '...' });
      } else {
        updateTestResult(0, 'error', null, 'No authentication token found');
      }

      // Test 2: Get user profile
      try {
        const profile = await authApi.getProfile();
        updateTestResult(1, 'success', profile);
      } catch (error) {
        updateTestResult(1, 'error', null, error instanceof Error ? error.message : 'Failed to get profile');
      }

      // Test 3: Get users list
      try {
        const usersResponse = await usersApi.getUsers();
        updateTestResult(2, 'success', { count: usersResponse.count });
        setAllData(prev => ({ ...prev, users: usersResponse.results }));
      } catch (error) {
        updateTestResult(2, 'error', null, error instanceof Error ? error.message : 'Failed to get users');
      }

      // Test 4: Get ambulances list
      try {
        const ambulancesResponse = await ambulancesApi.getAmbulances();
        updateTestResult(3, 'success', { count: ambulancesResponse.count });
        setAllData(prev => ({ ...prev, ambulances: ambulancesResponse.results }));
      } catch (error) {
        updateTestResult(3, 'error', null, error instanceof Error ? error.message : 'Failed to get ambulances');
      }

      // Test 5: Get patients list
      try {
        const patientsResponse = await patientsApi.getPatients();
        updateTestResult(4, 'success', { count: patientsResponse.count });
        setAllData(prev => ({ ...prev, patients: patientsResponse.results }));
      } catch (error) {
        updateTestResult(4, 'error', null, error instanceof Error ? error.message : 'Failed to get patients');
      }

    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusBadge = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Frontend-Backend Integration Test</h1>
          <p className="text-gray-600 mt-2">
            Testing connection between React frontend and Django backend
          </p>
          {currentUser && (
            <p className="text-sm text-blue-600 mt-1">
              Logged in as: {currentUser.first_name} {currentUser.last_name} ({currentUser.role})
            </p>
          )}
        </div>
        <Button onClick={runAllTests} disabled={isRunning} size="lg">
          {isRunning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Running Tests...
            </>
          ) : (
            'Run All Tests'
          )}
        </Button>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>API Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(test.status)}
                  <span className="font-medium">{test.name}</span>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(test.status)}
                  {test.data && (
                    <span className="text-sm text-gray-500">
                      {typeof test.data === 'object' ? JSON.stringify(test.data) : test.data}
                    </span>
                  )}
                  {test.error && (
                    <span className="text-sm text-red-500">{test.error}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      {(allData.users.length > 0 || allData.ambulances.length > 0 || allData.patients.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Users */}
          {allData.users.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Users ({allData.users.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allData.users.map(user => (
                    <div key={user.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{user.first_name} {user.last_name}</div>
                      <div className="text-sm text-gray-600">{user.username} - {user.role}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                      <Badge variant={user.active ? 'default' : 'secondary'} className="mt-1">
                        {user.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Ambulances */}
          {allData.ambulances.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Ambulances ({allData.ambulances.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allData.ambulances.map(ambulance => (
                    <div key={ambulance.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{ambulance.vehicleNumber}</div>
                      <div className="text-sm text-gray-600">
                        {ambulance.model} ({ambulance.year})
                      </div>
                      <div className="text-sm text-gray-500">
                        License: {ambulance.licenseNumber}
                      </div>
                      <Badge 
                        variant={ambulance.status === 'available' ? 'default' : 'secondary'}
                        className="mt-1"
                      >
                        {ambulance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Patients */}
          {allData.patients.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Patients ({allData.patients.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {allData.patients.map(patient => (
                    <div key={patient.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium">{patient.name}</div>
                      <div className="text-sm text-gray-600">
                        Age: {patient.age}, {patient.gender}
                      </div>
                      <div className="text-sm text-gray-500">
                        {patient.medicalCondition}
                      </div>
                      {patient.phone && (
                        <div className="text-sm text-gray-500">{patient.phone}</div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Backend Info */}
      <Card>
        <CardHeader>
          <CardTitle>Backend Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Backend URL:</span> http://127.0.0.1:8000/api
            </div>
            <div>
              <span className="font-medium">Frontend URL:</span> http://localhost:3001
            </div>
            <div>
              <span className="font-medium">Authentication:</span> Token-based
            </div>
            <div>
              <span className="font-medium">CORS:</span> Enabled for localhost:3001
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiTestPage;

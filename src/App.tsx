import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import FleetManagement from './components/FleetManagement';
import EmergencyCalls from './components/EmergencyCalls';
import PatientManagement from './components/PatientManagement';
import LiveTracking from './components/LiveTracking';
import Reports from './components/Reports';
import VehicleInspectionForm from './components/VehicleInspectionForm';
import MedicalInspectionForm from './components/MedicalInspectionForm';
import VehicleInspectionDashboard from './components/VehicleInspectionDashboard';
import MedicalInspectionDashboard from './components/MedicalInspectionDashboard';
import DriverAssignments from './components/DriverAssignments';

const AppContent: React.FC = () => {
  const { currentUser } = useAuth();
  
  // Set default tab based on role
  const getDefaultTab = () => {
    if (!currentUser) return 'dashboard';
    switch (currentUser.role) {
      case 'admin':
        return 'dashboard';
      case 'dispatcher':
        return 'calls';
      case 'driver':
        return 'calls';
      case 'paramedic':
        return 'patients';
      default:
        return 'dashboard';
    }
  };
  
  const [activeTab, setActiveTab] = useState(getDefaultTab());
  
  // Update active tab when user role changes
  React.useEffect(() => {
    setActiveTab(getDefaultTab());
  }, [currentUser?.role]);

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'fleet':
        return <FleetManagement />;
      case 'calls':
        // Use different components based on role
        if (currentUser?.role === 'driver') {
          return <DriverAssignments />;
        }
        return <EmergencyCalls />;
      case 'patients':
        return <PatientManagement />;
      case 'tracking':
        return <LiveTracking />;
      case 'reports':
        return <Reports />;
      case 'vehicle-inspection':
        return <VehicleInspectionForm />;
      case 'medical-inspection':
        return <MedicalInspectionForm />;
      case 'vehicle-inspections':
        return <VehicleInspectionDashboard />;
      case 'medical-inspections':
        return <MedicalInspectionDashboard />;
      default:
        // Default based on role
        if (currentUser?.role === 'driver') return <DriverAssignments />;
        if (currentUser?.role === 'paramedic') return <PatientManagement />;
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
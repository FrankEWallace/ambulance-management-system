import React from 'react';
import { 
  Users, 
  Truck, 
  Phone, 
  User, 
  MapPin, 
  BarChart3, 
  LogOut,
  Shield,
  Radio,
  UserCheck,
  ClipboardCheck,
  Wrench
} from 'lucide-react';
import { Button } from './ui/button';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, logout } = useAuth();

  const roleIcons = {
    admin: Shield,
    dispatcher: Radio,
    driver: Truck,
    paramedic: UserCheck
  };

  const getRoleMenuItems = (role: UserRole) => {
    const roleSpecificItems = {
      admin: [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
        { id: 'api-test', label: 'API Test', icon: Shield },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'fleet', label: 'Fleet Management', icon: Truck },
        { id: 'patients', label: 'Patient Records', icon: User },
        { id: 'tracking', label: 'Live Tracking', icon: MapPin },
        { id: 'vehicle-inspections', label: 'Vehicle Inspections', icon: Wrench },
        { id: 'medical-inspections', label: 'Medical Inspections', icon: ClipboardCheck }
      ],
      dispatcher: [
        { id: 'calls', label: 'Emergency Dispatch', icon: Phone },
        { id: 'fleet', label: 'Fleet Status', icon: Truck },
        { id: 'tracking', label: 'Live Tracking', icon: MapPin },
        { id: 'patients', label: 'Patient Records', icon: User }
      ],
      driver: [
        { id: 'calls', label: 'My Assignments', icon: Phone },
        { id: 'vehicle-inspection', label: 'Vehicle Inspection', icon: Wrench }
      ],
      paramedic: [
        { id: 'calls', label: 'Emergency Calls', icon: Phone },
        { id: 'patients', label: 'Patient Records', icon: User },
        { id: 'medical-inspection', label: 'Medical Inspection', icon: ClipboardCheck }
      ]
    };

    return roleSpecificItems[role];
  };

  const menuItems = currentUser ? getRoleMenuItems(currentUser.role) : [];
  const RoleIcon = currentUser ? roleIcons[currentUser.role] : Shield;

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h1 className="font-semibold text-lg">AMS Dashboard</h1>
      </div>

      {/* User Info */}
      {currentUser && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                <RoleIcon className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{currentUser.first_name} {currentUser.last_name}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {currentUser.role}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>
      </div>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;

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
  const { currentUser, logout, switchRole } = useAuth();

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
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'fleet', label: 'Fleet Management', icon: Truck },
        { id: 'patients', label: 'Patient Records', icon: User },
        { id: 'tracking', label: 'Live Tracking', icon: MapPin },
        { id: 'vehicle-inspections', label: 'Vehicle Inspections', icon: Wrench },
        { id: 'medical-inspections', label: 'Medical Inspections', icon: ClipboardCheck }
      ],
      dispatcher: [
        { id: 'calls', label: 'Emergency Dispatch', icon: Phone },
        { id: 'tracking', label: 'Unit Tracking', icon: MapPin },
        { id: 'patients', label: 'Patient Info', icon: User }
      ],
      driver: [
        { id: 'calls', label: 'My Assignments', icon: Phone },
        { id: 'tracking', label: 'Navigation', icon: MapPin },
        { id: 'vehicle-inspection', label: 'Vehicle Inspection', icon: Wrench }
      ],
      paramedic: [
        { id: 'patients', label: 'Patient Care', icon: User },
        { id: 'medical-inspection', label: 'Equipment Inspection', icon: ClipboardCheck }
      ]
    };

    return roleSpecificItems[role];
  };

  const menuItems = currentUser ? getRoleMenuItems(currentUser.role) : [];
  const RoleIcon = currentUser ? roleIcons[currentUser.role] : Shield;

  const handleRoleSwitch = (newRole: UserRole) => {
    switchRole(newRole);
  };

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
                <RoleIcon className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{currentUser.name}</p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs">
                  {currentUser.role.replace('_', ' ')}
                </Badge>
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="h-4 w-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>

      {/* Role Switcher (Demo) */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 mb-2">Switch Role (Demo):</p>
        <div className="grid grid-cols-2 gap-1">
          {(['admin', 'dispatcher', 'driver', 'paramedic'] as UserRole[]).map((role) => (
            <Button
              key={role}
              variant="outline"
              size="sm"
              className="text-xs p-1 h-7"
              onClick={() => handleRoleSwitch(role)}
            >
              {role}
            </Button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Avatar, AvatarFallback } from './ui/avatar';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Radio, 
  Truck, 
  UserCheck,
  Search,
  Mail,
  Phone
} from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { User, UserRole } from '../types';

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNewUserDialogOpen, setIsNewUserDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');

  const roleIcons = {
    admin: Shield,
    dispatcher: Radio,
    driver: Truck,
    paramedic: UserCheck
  };

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    dispatcher: 'bg-blue-100 text-blue-800',
    driver: 'bg-green-100 text-green-800',
    paramedic: 'bg-red-100 text-red-800'
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, active: !user.active } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const getRoleDisplayName = (role: UserRole) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const roleStats = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>User Management</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <Dialog open={isNewUserDialogOpen} onOpenChange={setIsNewUserDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">Full Name</Label>
                <Input id="new-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-email">Email</Label>
                <Input id="new-email" type="email" placeholder="john@ams.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-phone">Phone Number</Label>
                <Input id="new-phone" placeholder="+1234567890" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-role">Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                    <SelectItem value="paramedic">Paramedic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password</Label>
                <Input id="new-password" type="password" placeholder="Enter password" />
              </div>
              <Button className="w-full">Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* User Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{users.length}</div>
            <div className="text-sm text-gray-600">Total Users</div>
          </CardContent>
        </Card>
        {Object.entries(roleStats).map(([role, count]) => {
          const Icon = roleIcons[role as UserRole];
          return (
            <Card key={role}>
              <CardContent className="p-4 text-center">
                <Icon className="h-5 w-5 mx-auto mb-1 text-gray-600" />
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm text-gray-600">{getRoleDisplayName(role as UserRole)}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Administrator</SelectItem>
                <SelectItem value="dispatcher">Dispatcher</SelectItem>
                <SelectItem value="driver">Driver</SelectItem>
                <SelectItem value="paramedic">Paramedic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => {
              const RoleIcon = roleIcons[user.role];
              
              return (
                <div key={user.id} className={`p-4 border rounded-lg ${!user.active ? 'bg-gray-50 opacity-75' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>
                          <RoleIcon className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium">{user.name}</h3>
                          <Badge className={roleColors[user.role]}>
                            {getRoleDisplayName(user.role)}
                          </Badge>
                          {!user.active && (
                            <Badge variant="destructive">Inactive</Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-2" />
                            {user.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="h-3 w-3 mr-2" />
                            {user.phone}
                          </div>
                          <div className="text-xs text-gray-500">
                            Created: {new Date(user.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Label htmlFor={`switch-${user.id}`} className="text-sm">Active</Label>
                        <Switch
                          id={`switch-${user.id}`}
                          checked={user.active}
                          onCheckedChange={() => toggleUserStatus(user.id)}
                        />
                      </div>
                      
                      <Dialog open={isEditDialogOpen && selectedUser?.id === user.id} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Edit User</DialogTitle>
                            <DialogDescription>Update user information</DialogDescription>
                          </DialogHeader>
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label htmlFor="edit-name">Full Name</Label>
                                <Input id="edit-name" defaultValue={selectedUser.name} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-email">Email</Label>
                                <Input id="edit-email" defaultValue={selectedUser.email} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-phone">Phone Number</Label>
                                <Input id="edit-phone" defaultValue={selectedUser.phone} />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="edit-role">Role</Label>
                                <Select defaultValue={selectedUser.role}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="admin">Administrator</SelectItem>
                                    <SelectItem value="dispatcher">Dispatcher</SelectItem>
                                    <SelectItem value="driver">Driver</SelectItem>
                                    <SelectItem value="paramedic">Paramedic</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch defaultChecked={selectedUser.active} />
                                <Label>Account Active</Label>
                              </div>
                              <Button className="w-full">Update User</Button>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(user.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>Default permissions for each user role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(roleIcons).map(([role, Icon]) => (
              <div key={role} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div>
                    <h4 className="font-medium">{getRoleDisplayName(role as UserRole)}</h4>
                    <p className="text-sm text-gray-600">
                      {role === 'admin' && 'System administration, user management, analytics'}
                      {role === 'dispatcher' && 'Emergency dispatch, fleet coordination, call management'}
                      {role === 'driver' && 'Vehicle operation, navigation, transport logistics'}
                      {role === 'paramedic' && 'Medical care, patient treatment, clinical documentation'}
                    </p>
                  </div>
                </div>
                <Badge className={roleColors[role as UserRole]}>
                  {roleStats[role] || 0} users
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
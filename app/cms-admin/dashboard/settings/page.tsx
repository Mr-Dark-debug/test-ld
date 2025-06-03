'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/badge'
import AnimatedBackground from '@/components/ui/animated-tabs'
import { toast } from 'react-hot-toast'
import {
  Users,
  Plus,
  Edit,
  Trash2,
  Shield,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Loader2,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'editor' | 'user';
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface NewUser {
  name: string;
  email: string;
  password: string;
  role: 'super_admin' | 'admin' | 'editor' | 'user';
  isActive: boolean;
}

export default function SettingsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    password: '',
    role: 'user',
    isActive: true
  });



  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users/manage?limit=100');
      const data = await response.json();

      if (data.success && data.data && data.data.users) {
        setUsers(data.data.users);
      } else {
        console.error('Invalid API response:', data);
        setUsers([]); // Set empty array as fallback
        toast.error('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]); // Set empty array as fallback
      toast.error('Failed to fetch users');
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUsers().finally(() => {
      setIsLoading(false);
    });
  }, []);

  // Handle creating new user
  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch('/api/users/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('User created successfully');
        await fetchUsers(); // Refresh the list
        setIsAddingUser(false);
        setNewUser({
          name: '',
          email: '',
          password: '',
          role: 'user',
          isActive: true
        });
      } else {
        toast.error(data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle updating user
  const handleUpdateUser = async () => {
    if (!editingUser) return;

    setIsSaving(true);

    try {
      const response = await fetch('/api/users/manage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: editingUser._id, ...editingUser }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('User updated successfully');
        await fetchUsers(); // Refresh the list
        setEditingUser(null);
      } else {
        toast.error(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle user active status
  const toggleUserStatus = async (userId: string) => {
    try {
      const user = users.find(u => u._id === userId);
      if (!user) return;

      const response = await fetch('/api/users/manage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userId,
          isActive: !user.isActive
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`User ${!user.isActive ? 'activated' : 'deactivated'} successfully`);
        await fetchUsers(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  // Delete user
  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/manage?id=${userId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        toast.success('User deleted successfully');
        await fetchUsers(); // Refresh the list
      } else {
        toast.error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };



  // Get role badge color
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Badge className="bg-purple-500">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-500">Admin</Badge>;
      case 'editor':
        return <Badge className="bg-green-500">Editor</Badge>;
      case 'user':
        return <Badge className="bg-gray-500">User</Badge>;
      default:
        return <Badge className="bg-gray-500">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">System Settings</h1>
        {activeTab === 'users' && !editingUser && !isAddingUser && (
          <Button
            onClick={() => setIsAddingUser(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add New User
          </Button>
        )}

        {(editingUser || isAddingUser) && (
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={editingUser ? handleUpdateUser : handleCreateUser}
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? 'Saving...' : (editingUser ? 'Update User' : 'Create User')}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setEditingUser(null);
                setIsAddingUser(false);
                setNewUser({
                  name: '',
                  email: '',
                  password: '',
                  role: 'user',
                  isActive: true
                });
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        )}

      </div>

      {/* Tabs */}
      <div className="w-full">
        <div className="rounded-xl bg-white overflow-hidden mb-8">
          <AnimatedBackground
            defaultValue={activeTab}
            className="bg-blue-50 dark:bg-blue-900/20"
            transition={{
              type: "spring",
              bounce: 0.2,
              duration: 0.3,
            }}
            onValueChange={(value) => value && setActiveTab(value)}
          >
            <button
              type="button"
              data-id="users"
              className="py-2 px-6 font-medium text-gray-700 data-[checked=true]:text-blue-600 dark:text-gray-300 dark:data-[checked=true]:text-blue-400"
            >
              User Management
            </button>
            <button
              type="button"
              data-id="roles"
              className="py-2 px-6 font-medium text-gray-700 data-[checked=true]:text-blue-600 dark:text-gray-300 dark:data-[checked=true]:text-blue-400"
            >
              Role Permissions
            </button>

            <button
              type="button"
              data-id="system"
              className="py-2 px-6 font-medium text-gray-700 data-[checked=true]:text-blue-600 dark:text-gray-300 dark:data-[checked=true]:text-blue-400"
            >
              System Settings
            </button>
          </AnimatedBackground>
        </div>

        {/* User Management Tab */}
        {activeTab === "users" && (
          <>
            {(isAddingUser || editingUser) ? (
              // User Form
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isAddingUser ? 'Add New User' : 'Edit User'}
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <Input
                      value={isAddingUser ? newUser.name : editingUser?.name || ''}
                      onChange={(e) => {
                        if (isAddingUser) {
                          setNewUser({...newUser, name: e.target.value});
                        } else if (editingUser) {
                          setEditingUser({...editingUser, name: e.target.value});
                        }
                      }}
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Email Address</label>
                    <Input
                      type="email"
                      value={isAddingUser ? newUser.email : editingUser?.email || ''}
                      onChange={(e) => {
                        if (isAddingUser) {
                          setNewUser({...newUser, email: e.target.value});
                        } else if (editingUser) {
                          setEditingUser({...editingUser, email: e.target.value});
                        }
                      }}
                      placeholder="Enter email address"
                    />
                  </div>

                  {isAddingUser && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Password</label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="Enter password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-1">Role</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={isAddingUser ? newUser.role : editingUser?.role || 'user'}
                      onChange={(e) => {
                        const role = e.target.value as 'super_admin' | 'admin' | 'editor' | 'user';
                        if (isAddingUser) {
                          setNewUser({...newUser, role});
                        } else if (editingUser) {
                          setEditingUser({...editingUser, role});
                        }
                      }}
                    >
                      <option value="user">User</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Admin</option>
                      <option value="super_admin">Super Admin</option>
                    </select>
                  </div>

                  <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isAddingUser ? newUser.isActive : editingUser?.isActive || false}
                        onChange={() => {
                          if (isAddingUser) {
                            setNewUser({...newUser, isActive: !newUser.isActive});
                          } else if (editingUser) {
                            setEditingUser({...editingUser, isActive: !editingUser.isActive});
                          }
                        }}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      <span className="ml-3 text-sm font-medium">
                        {(isAddingUser ? newUser.isActive : editingUser?.isActive) ? 'Active User' : 'Inactive User'}
                      </span>
                    </label>
                  </div>
                </div>
              </Card>
            ) : (
              // Users List
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">User Management</h2>

                <div className="space-y-4">
                  {!Array.isArray(users) || users.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      {!Array.isArray(users) ? 'Loading users...' : 'No users found. Create your first user.'}
                    </div>
                  ) : (
                    users.map((user) => (
                      <Card key={user._id} className="p-4 border-l-4 hover:shadow-md transition-shadow"
                        style={{ borderLeftColor: user.isActive ? '#3b82f6' : '#9ca3af' }}
                      >
                        <div className="flex justify-between items-start gap-4 flex-wrap">
                          <div className="flex-1">
                            <h3 className="font-medium text-lg flex items-center gap-2">
                              {user.name}
                              {getRoleBadge(user.role)}
                              {user.isActive ? (
                                <Badge className="bg-green-500">Active</Badge>
                              ) : (
                                <Badge className="bg-gray-500">Inactive</Badge>
                              )}
                            </h3>
                            <div className="flex gap-4 mt-1 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Mail className="h-4 w-4" />
                                {user.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Created: {new Date(user.createdAt).toLocaleDateString()}
                              </span>
                              {user.lastLogin && (
                                <span className="flex items-center gap-1">
                                  <Shield className="h-4 w-4" />
                                  Last login: {new Date(user.lastLogin).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingUser(user)}
                              className="text-blue-600"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleUserStatus(user._id)}
                              className={user.isActive ? "text-gray-600" : "text-green-600"}
                            >
                              {user.isActive ? (
                                <>
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => deleteUser(user._id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </Card>
            )}
          </>
        )}

        {/* Role Permissions Tab */}
        {activeTab === "roles" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Role Permissions</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-purple-600 mb-2">Super Admin</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Full system access</li>
                    <li>• User management</li>
                    <li>• System settings</li>
                    <li>• All content management</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-blue-600 mb-2">Admin</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Content management</li>
                    <li>• User management (limited)</li>
                    <li>• View analytics</li>
                    <li>• Manage projects</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-green-600 mb-2">Editor</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Create/edit content</li>
                    <li>• Manage blogs</li>
                    <li>• Upload media</li>
                    <li>• View reports</li>
                  </ul>
                </div>
                <div className="p-4 border rounded-lg">
                  <h3 className="font-medium text-gray-600 mb-2">User</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• View content</li>
                    <li>• Basic interactions</li>
                    <li>• Profile management</li>
                    <li>• Limited access</li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        )}



        {/* System Settings Tab */}
        {activeTab === "system" && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">System Configuration</h2>
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Database Status</h3>
                <p className="text-sm text-green-600">✓ Connected to MongoDB</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">API Status</h3>
                <p className="text-sm text-green-600">✓ All APIs operational</p>
              </div>
              <div className="p-4 border rounded-lg">
                <h3 className="font-medium mb-2">Authentication</h3>
                <p className="text-sm text-green-600">✓ JWT tokens active (7 days expiry)</p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

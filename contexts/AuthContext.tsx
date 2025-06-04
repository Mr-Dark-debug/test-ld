'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authApi, getAuthToken, removeAuthToken } from '@/lib/api';
import { logActivity } from '@/lib/activity';

interface User {
  _id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'editor' | 'user';
  isActive: boolean;
  phone?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roles: string[]) => boolean;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authApi.me();
      if (response.success && response.data?.user) {
        setUser(response.data.user);
      } else {
        console.log('Auth check failed, removing token');
        removeAuthToken();
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only remove token if it's actually invalid, not just a network error
      if (error instanceof Error && error.message.includes('401')) {
        removeAuthToken();
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authApi.login(email, password);
      
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        
        // Log login activity
        if (response.data.user) {
          try {
            await logActivity({
              type: 'user',
              action: 'login',
              title: 'User logged in',
              userId: response.data.user._id,
              userName: response.data.user.name
            });
          } catch (error) {
            console.error('Failed to log login activity:', error);
          }
        }
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Login failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    // Log logout activity before removing the user
    if (user) {
      try {
        await logActivity({
          type: 'user',
          action: 'logout',
          title: 'User logged out',
          userId: user._id,
          userName: user.name
        });
      } catch (error) {
        console.error('Failed to log logout activity:', error);
      }
    }
    
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      setUser(null);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }
    
    try {
      const response = await authApi.updateProfile(data);
      
      if (response.success && response.data?.user) {
        // Update the user in state
        setUser({
          ...user,
          ...response.data.user
        });
        
        // Log profile update activity
        try {
          await logActivity({
            type: 'user',
            action: 'update',
            title: 'User profile updated',
            userId: user._id,
            userName: user.name
          });
        } catch (error) {
          console.error('Failed to log profile update activity:', error);
        }
        
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to update profile' };
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update profile. Please try again.'
      };
    }
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login,
    logout,
    checkAuth,
    isAuthenticated,
    hasRole,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protecting routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading, isAuthenticated, hasRole } = useAuth();

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Authentication Required
            </h1>
            <p className="text-gray-600">
              Please log in to access this page.
            </p>
          </div>
        </div>
      );
    }

    if (allowedRoles && !hasRole(allowedRoles)) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h1>
            <p className="text-gray-600">
              You don't have permission to access this page.
            </p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

import { useState, useEffect, useCallback } from 'react';

export interface Activity {
  _id: string;
  type: 'project' | 'blog' | 'lead' | 'testimonial' | 'user' | 'amenity' | 'system';
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'approve' | 'feature' | 'other';
  title: string;
  description?: string;
  userId: string;
  userName: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface UseActivitiesOptions {
  type?: string;
  userId?: string;
  entityId?: string;
  entityType?: string;
  limit?: number;
  autoRefresh?: boolean; // Auto refresh every minute
}

export interface UseActivitiesReturn {
  activities: Activity[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useActivities(options: UseActivitiesOptions = {}): UseActivitiesReturn {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Build query string from options
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    
    if (options.type) {
      params.append('type', options.type);
    }
    
    if (options.userId) {
      params.append('userId', options.userId);
    }
    
    if (options.entityId && options.entityType) {
      params.append('entityId', options.entityId);
      params.append('entityType', options.entityType);
    }
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    return params.toString();
  }, [options.type, options.userId, options.entityId, options.entityType, options.limit]);
  
  // Fetch activities
  const fetchActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryString = buildQueryString();
      const url = `/api/activities${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success && data.data) {
        setActivities(data.data);
      } else {
        setError(data.error || 'Failed to fetch activities');
      }
    } catch (err: any) {
      console.error('Error fetching activities:', err);
      setError(err.message || 'Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  }, [buildQueryString]);
  
  // Initial fetch and setup auto-refresh if enabled
  useEffect(() => {
    fetchActivities();
    
    // Set up auto-refresh if enabled
    if (options.autoRefresh) {
      const intervalId = setInterval(fetchActivities, 60000); // Refresh every minute
      
      return () => clearInterval(intervalId);
    }
  }, [fetchActivities, options.autoRefresh]);
  
  return {
    activities,
    loading,
    error,
    refetch: fetchActivities
  };
} 
// Activity logging utility functions

interface LogActivityParams {
  type: 'project' | 'blog' | 'lead' | 'testimonial' | 'user' | 'amenity' | 'system';
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'approve' | 'feature' | 'other';
  title: string;
  description?: string;
  userId: string;
  userName: string;
  entityId?: string;
  entityType?: string;
  metadata?: Record<string, any>;
}

/**
 * Log an activity to the database
 */
export async function logActivity(params: LogActivityParams): Promise<boolean> {
  try {
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data.success === true;
  } catch (error) {
    console.error('Failed to log activity:', error);
    return false;
  }
}

/**
 * Generate standard activity titles based on type and action
 */
export function generateActivityTitle(
  type: LogActivityParams['type'],
  action: LogActivityParams['action'],
  entityName: string
): string {
  const actions = {
    create: 'created',
    update: 'updated',
    delete: 'deleted',
    login: 'logged in',
    logout: 'logged out',
    approve: 'approved',
    feature: 'featured',
    other: 'modified',
  };

  const types = {
    project: 'project',
    blog: 'blog post',
    lead: 'lead',
    testimonial: 'testimonial',
    user: 'user',
    amenity: 'amenity',
    system: 'system',
  };

  if (action === 'login') return `User ${actions[action]}`;
  if (action === 'logout') return `User ${actions[action]}`;
  
  return `${types[type]} "${entityName}" ${actions[action]}`;
} 
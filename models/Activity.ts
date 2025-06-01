import mongoose, { Document, Schema } from 'mongoose';

export interface IActivity extends Document {
  _id: string;
  type: 'project' | 'blog' | 'lead' | 'testimonial' | 'user' | 'amenity' | 'system';
  action: 'create' | 'update' | 'delete' | 'login' | 'logout' | 'approve' | 'feature' | 'other';
  title: string;
  description?: string;
  userId: mongoose.Types.ObjectId;
  userName: string;
  entityId?: mongoose.Types.ObjectId;
  entityType?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const ActivitySchema = new Schema<IActivity>({
  type: {
    type: String,
    enum: ['project', 'blog', 'lead', 'testimonial', 'user', 'amenity', 'system'],
    required: [true, 'Activity type is required']
  },
  action: {
    type: String,
    enum: ['create', 'update', 'delete', 'login', 'logout', 'approve', 'feature', 'other'],
    required: [true, 'Activity action is required']
  },
  title: {
    type: String,
    required: [true, 'Activity title is required'],
    maxlength: [200, 'Activity title cannot exceed 200 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Activity description cannot exceed 500 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required']
  },
  entityId: {
    type: Schema.Types.ObjectId
  },
  entityType: {
    type: String
  },
  metadata: {
    type: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes
ActivitySchema.index({ type: 1 });
ActivitySchema.index({ action: 1 });
ActivitySchema.index({ userId: 1 });
ActivitySchema.index({ createdAt: -1 });
ActivitySchema.index({ entityId: 1, entityType: 1 });

// Static methods
ActivitySchema.statics.getRecentActivities = function(limit = 10) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit);
};

ActivitySchema.statics.getActivitiesByUser = function(userId: string, limit = 20) {
  return this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

ActivitySchema.statics.getActivitiesByType = function(type: string, limit = 20) {
  return this.find({ type })
    .sort({ createdAt: -1 })
    .limit(limit);
};

ActivitySchema.statics.getActivitiesByEntity = function(entityId: string, entityType: string, limit = 20) {
  return this.find({ entityId, entityType })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Ensure model is not re-compiled in development
const Activity = mongoose.models.Activity || mongoose.model<IActivity>('Activity', ActivitySchema);

export default Activity; 
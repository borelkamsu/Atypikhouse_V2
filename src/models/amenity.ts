import mongoose, { Schema, Document } from 'mongoose';

export interface IAmenity extends Document {
  name: string;
  icon?: string;
  category?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const amenitySchema = new Schema<IAmenity>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['basic', 'comfort', 'luxury', 'outdoor', 'safety', 'accessibility'],
    default: 'basic'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
amenitySchema.index({ name: 1 });
amenitySchema.index({ category: 1, isActive: 1 });

export const Amenity = mongoose.models.Amenity || mongoose.model<IAmenity>('Amenity', amenitySchema);



import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  propertyId: mongoose.Types.ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  guests: number;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  guests: {
    type: Number,
    required: true,
    min: 1
  },
  specialRequests: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ propertyId: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ status: 1, createdAt: -1 });

// Méthode pour vérifier si une réservation chevauche une période
bookingSchema.methods.overlaps = function(startDate: Date, endDate: Date): boolean {
  return this.startDate < endDate && this.endDate > startDate;
};

export const Booking = mongoose.models.Booking || mongoose.model<IBooking>('Booking', bookingSchema);



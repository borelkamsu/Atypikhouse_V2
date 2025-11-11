import mongoose from 'mongoose';

export interface IReview extends mongoose.Document {
  property: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new mongoose.Schema<IReview>({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'La propriété est requise']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'L\'utilisateur est requis']
  },
  rating: {
    type: Number,
    required: [true, 'La note est requise'],
    min: [1, 'La note doit être au moins 1'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  comment: {
    type: String,
    required: [true, 'Le commentaire est requis'],
    trim: true,
    maxlength: [1000, 'Le commentaire ne peut pas dépasser 1000 caractères']
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances
reviewSchema.index({ property: 1 });
reviewSchema.index({ user: 1 });
reviewSchema.index({ rating: -1 });

// Empêcher un utilisateur de poster plusieurs avis pour la même propriété
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);



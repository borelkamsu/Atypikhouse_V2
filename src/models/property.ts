import mongoose from 'mongoose';

export interface IProperty extends mongoose.Document {
  title: string;
  description: string;
  type: 'cabin' | 'yurt' | 'floating' | 'dome' | 'caravan' | 'igloo' | 'other';
  location: {
    address: string;
    city: string;
    country: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  price: {
    perNight: number;
    currency: string;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
  };
  amenities: string[];
  images: string[];
  owner: mongoose.Types.ObjectId;
  isAvailable: boolean;
  rating: number;
  reviews: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new mongoose.Schema<IProperty>({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  type: {
    type: String,
    enum: ['cabin', 'yurt', 'floating', 'dome', 'caravan', 'igloo', 'other'],
    required: [true, 'Le type de logement est requis']
  },
  location: {
    address: {
      type: String,
      required: [true, 'L\'adresse est requise']
    },
    city: {
      type: String,
      required: [true, 'La ville est requise']
    },
    country: {
      type: String,
      required: [true, 'Le pays est requis']
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  price: {
    perNight: {
      type: Number,
      required: [true, 'Le prix par nuit est requis'],
      min: [0, 'Le prix ne peut pas être négatif']
    },
    currency: {
      type: String,
      default: 'EUR',
      enum: ['EUR', 'USD', 'GBP']
    }
  },
  capacity: {
    guests: {
      type: Number,
      required: [true, 'Le nombre de voyageurs est requis'],
      min: [1, 'Le nombre de voyageurs doit être au moins 1']
    },
    bedrooms: {
      type: Number,
      required: [true, 'Le nombre de chambres est requis'],
      min: [0, 'Le nombre de chambres ne peut pas être négatif']
    },
    bathrooms: {
      type: Number,
      required: [true, 'Le nombre de salles de bain est requis'],
      min: [0, 'Le nombre de salles de bain ne peut pas être négatif']
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    type: String,
    required: [true, 'Au moins une image est requise']
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Le propriétaire est requis']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, 'La note ne peut pas être négative'],
    max: [5, 'La note ne peut pas dépasser 5']
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

// Index pour améliorer les performances
propertySchema.index({ type: 1 });
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ owner: 1 });
propertySchema.index({ isAvailable: 1 });
propertySchema.index({ rating: -1 });

export const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', propertySchema);



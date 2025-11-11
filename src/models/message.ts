import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index pour optimiser les requêtes
messageSchema.index({ createdAt: -1 });

export const Message = mongoose.model<IMessage>('Message', messageSchema);



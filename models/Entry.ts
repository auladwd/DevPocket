// Mongoose model for a DevPocket entry
import mongoose, { Schema, Document } from 'mongoose';

export interface IEntry extends Document {
  userId: string;
  title: string;
  content: string;
  url?: string;
  password?: string; // stored encrypted
  tags: string[];
  pinned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const EntrySchema = new Schema<IEntry>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    url: { type: String, default: '' },
    password: { type: String, default: '' }, // encrypted
    tags: { type: [String], default: [] },
    pinned: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Prevent model re-compilation during hot reloads
export default mongoose.models.Entry ??
  mongoose.model<IEntry>('Entry', EntrySchema);

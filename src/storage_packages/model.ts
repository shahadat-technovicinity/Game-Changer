import mongoose, { Document, Schema } from "mongoose";

export interface IStoragePackage extends Document  {
  name: string;
  description: string;
  storage_size: number; // in GB
  price: number;
  currency: string;
  billing_cycle: 'monthly' | 'yearly';
  properties: {
    max_files?: number;
    max_file_size?: number; // in MB
    sharing_enabled?: boolean;
    collaboration_enabled?: boolean;
    priority_support?: boolean;
    [key: string]: any; // for additional properties
  };
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const StoragePackageSchema = new Schema<IStoragePackage>({
  name: { type: String, required: true, unique: true },
  description: { type: String},
  storage_size: { type: Number, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  billing_cycle: { type: String, enum: ['monthly', 'yearly'], required: true },
  properties: { type: Schema.Types.Mixed, default: {} },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const StoragePackage = mongoose.model<IStoragePackage>('StoragePackage', StoragePackageSchema);

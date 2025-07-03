import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

// Role options
export enum UserRole {
  SUPER_ADMIN = 'Super Admin',
  ADMIN = 'Admin',
  PLAYER = 'Player',
  COACH = 'Coach'
}

// Interface for User document
export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  image: string;
  password: string;
  role: UserRole;
  device_token?: string;
  access_token?: string;
  refresh_token?: string;
  forget_password_code?: string;
  forget_password_code_time?: Date;
  team_id: mongoose.Types.ObjectId;
  is_deleted?: boolean;
  admin_teams: mongoose.Types.ObjectId[];
  jersey_no: string,
  
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define schema
const userSchema = new Schema<IUser>(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String, default:null },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.ADMIN
    },
    device_token: { type: String },
    access_token: { type: String },
    refresh_token: { type: String },
    jersey_no: {type: String, default: null},
    is_deleted: { type: Boolean, default: false },
    forget_password_code: { type: String },
    forget_password_code_time: { type: Date },
    team_id: { type: Schema.Types.ObjectId, ref: 'Team' },
    admin_teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  },
  {
    timestamps: true
  }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err as Error);
  }
});

// Compare candidate password with stored hashed password
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', userSchema);
export {User};

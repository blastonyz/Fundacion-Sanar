import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string; // Opcional para usuarios OAuth
  role: 'admin' | 'user' | 'editor' | 'moderator';
  image?: string; // Para fotos de perfil (Google, etc.)
  provider?: 'credentials' | 'google'; // Cómo se registró el usuario
  providerId?: string; // ID del proveedor OAuth
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    password: {
      type: String,
      required: false, // Siempre opcional, validaremos en el helper
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    },
    role: {
      type: String,
      enum: ['admin', 'user', 'editor', 'moderator'],
      default: 'user',
    },
    image: {
      type: String,
      required: false,
    },
    provider: {
      type: String,
      enum: ['credentials', 'google'],
      default: 'credentials',
    },
    providerId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para optimizar búsquedas (email ya es unique en schema)
UserSchema.index({ providerId: 1, provider: 1 });

// Middleware para debug en desarrollo
if (process.env.NODE_ENV === 'development') {
  UserSchema.pre('save', function() {
    console.log('💾 Guardando usuario:', { 
      email: this.email, 
      provider: this.provider,
      hasPassword: !!this.password 
    });
  });
}

// Prevenir re-compilación del modelo en desarrollo
const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;

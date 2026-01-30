import mongoose from 'mongoose';
import User, { IUser } from '@/models/User';

// Helper para crear usuario OAuth de manera segura
export async function createOAuthUser({
  email,
  name,
  image,
  provider,
  providerId,
  role = 'user'
}: {
  email: string;
  name: string;
  image?: string;
  provider: string;
  providerId: string;
  role?: string;
}) {
  try {
    console.log('🔧 Creando usuario OAuth con datos:', { email, name, provider, providerId, role });
    
    // Validación específica para provider
    if (provider === 'credentials' && !role) {
      throw new Error('Role es requerido para usuarios credentials');
    }
    
    // Asegurarse de que el role es válido
    const validRoles = ['admin', 'user', 'editor', 'moderator'];
    if (!validRoles.includes(role)) {
      throw new Error(`Role inválido: ${role}. Debe ser uno de: ${validRoles.join(', ')}`);
    }
    
    // Crear el usuario sin contraseña para OAuth
    const userData = {
      email: email.toLowerCase().trim(),
      name: name.trim(),
      image: image || undefined,
      provider: provider as 'google' | 'credentials',
      providerId: providerId,
      role: role as 'admin' | 'user' | 'editor' | 'moderator',
      // No incluir password para usuarios OAuth - esto es clave
    };
    
    console.log('📝 Datos del usuario a crear:', userData);
    
    const newUser = new User(userData);
    
    // Validar antes de guardar
    const validationError = newUser.validateSync();
    if (validationError) {
      console.error('❌ Error de validación:', validationError.message);
      throw new Error(`Validation failed: ${validationError.message}`);
    }
    
    // Guardar el usuario
    const savedUser = await newUser.save();
    console.log('✅ Usuario OAuth creado exitosamente:', savedUser._id);
    
    return savedUser;
  } catch (error) {
    console.error('❌ Error creando usuario OAuth:', error);
    
    // Manejar errores específicos de MongoDB
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new Error(`Errores de validación: ${messages.join(', ')}`);
    }
    
    if (error instanceof mongoose.Error && 'code' in error && error.code === 11000) {
      throw new Error('El email ya está registrado');
    }
    
    throw error;
  }
}

// Helper para buscar usuario de manera segura
export async function findUserByEmail(email: string) {
  try {
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).lean();
    
    return user;
  } catch (error) {
    console.error('❌ Error buscando usuario:', error);
    throw error;
  }
}

// Helper para actualizar imagen de usuario
export async function updateUserImage(userId: string, imageUrl: string) {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: imageUrl },
      { new: true }
    );
    
    return updatedUser;
  } catch (error) {
    console.error('❌ Error actualizando imagen:', error);
    throw error;
  }
}
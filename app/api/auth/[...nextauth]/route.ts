import NextAuth from "next-auth"
import type { AuthOptions, User as NextAuthUser } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import { MongoClient } from "mongodb"
import connectDB from '@/lib/mongodb'
import { createOAuthUser, findUserByEmail, updateUserImage } from '@/lib/user-helpers'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

// Extender los tipos de NextAuth para incluir nuestros campos personalizados
declare module "next-auth" {
  interface User {
    id: string
    email: string
    name: string
    role: string
    image?: string
  }

  interface Session {
    user: User
    accessToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    accessToken?: string
  }
}

// MongoDB client para el adapter con configuración personalizada
const client = new MongoClient(process.env.MONGODB_URI!)
const clientPromise = client.connect()

export const authOptions: AuthOptions = {
  // Para uso interno, JWT es más flexible que database sessions
  // y evita problemas de vinculación de cuentas OAuth
  // adapter: MongoDBAdapter(clientPromise), // Deshabilitado temporalmente
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          await connectDB()
          
          // Find user by email
          const user = await User.findOne({ email: credentials.email })
          
          if (!user || !user.password) {
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          
          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role || 'user',
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    })
  ],
  session: {
    strategy: "jwt", // Vuelta a JWT para evitar problemas de vinculación OAuth
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  // Eventos para depuración
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('🎉 Evento signIn exitoso:', { 
        email: user.email,
        provider: account?.provider,
        isNewUser 
      })
    }
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // Si es la primera vez que se inicia sesión, agregar datos del usuario al token
      if (user) {
        token.role = user.role
        token.sub = user.id // Asegurar que el ID esté en el token
      }
      
      // Si hay una cuenta (OAuth), guardar el access token
      if (account?.access_token) {
        token.accessToken = account.access_token
      }
      
      return token
    },
    async session({ session, token }) {
      // Agregar información del token a la sesión
      if (session.user && token.sub) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      
      if (token.accessToken) {
        session.accessToken = token.accessToken
      }
      
      return session
    },
    async signIn({ user, account, profile }) {
      try {
        console.log('🔍 SignIn callback iniciado:', { 
          provider: account?.provider, 
          userEmail: user.email,
          userName: user.name 
        })

        // Para proveedores OAuth como Google
        if (account?.provider === "google") {
          console.log('🔍 Iniciando proceso OAuth para Google...');
          await connectDB()
          console.log('📊 Conectado a MongoDB para OAuth')
          
          // Verificar si el usuario ya existe usando helper
          const existingUser = await findUserByEmail(user.email!)
          console.log('👤 Usuario existente:', existingUser ? 'SÍ' : 'NO')
          
          if (!existingUser) {
            console.log('🆕 Creando nuevo usuario para Google OAuth')
            
            try {
              // Crear nuevo usuario usando helper
              const newUser = await createOAuthUser({
                email: user.email!,
                name: user.name!,
                image: user.image,
                provider: 'google',
                providerId: account.providerAccountId!,
                role: 'user',
              })
              
              // Actualizar el objeto user con los datos del nuevo usuario
              user.role = newUser.role
              user.id = newUser._id.toString()
              console.log('✅ Usuario creado con ID:', user.id)
            } catch (createError) {
              console.error('❌ Error específico al crear usuario:', createError);
              throw createError;
            }
          } else {
            console.log('♻️ Usuario existente encontrado - permitiendo OAuth')
            // Usuario existente, usar sus datos y permitir OAuth
            user.role = existingUser.role || 'user'
            user.id = existingUser._id.toString()
            user.email = existingUser.email // Asegurar email
            user.name = existingUser.name // Usar nombre existente
            
            // Actualizar imagen si cambió usando helper
            if (user.image && existingUser.image !== user.image) {
              console.log('🖼️ Actualizando imagen de usuario');
              await updateUserImage(existingUser._id.toString(), user.image)
              console.log('🖼️ Imagen actualizada')
            }
            
            // ✅ Permitir OAuth para usuario existente forzando el éxito
            console.log('🔗 Permitiendo OAuth para usuario existente con credentials')
          }
          
          console.log('✅ SignIn OAuth exitoso para:', user.email)
          console.log('📋 Datos finales del usuario:', { id: user.id, role: user.role, email: user.email });
          return true
        }
        
        // Para credentials provider, el role ya viene del authorize
        console.log('✅ SignIn credentials exitoso')
        return true
      } catch (error) {
        console.error('❌ Error en signIn callback:', error)
        
        // Log más detallado del error
        if (error instanceof Error) {
          console.error('Error name:', error.name)
          console.error('Error message:', error.message)
          console.error('Error stack:', error.stack)
        }
        
        // En desarrollo, permitir más detalles
        if (process.env.NODE_ENV === 'development') {
          console.error('🔍 Datos completos del error:', error)
        }
        
        return false
      }
    },
    async redirect({ url, baseUrl }) {
      console.log('🔄 Redirect callback ejecutado:', { url, baseUrl });
      
      // Si es un callback de Google OAuth sin error, redirigir al panel correcto
      if (url.includes('/api/auth/callback/google')) {
        console.log('🎯 Callback de Google detectado, redirigiendo a user-panel por defecto');
        return `${baseUrl}/usuario/user-panel`;
      }
      
      // Si es un signin exitoso, también redirigir al panel
      if (url.includes('/api/auth/signin')) {
        console.log('🎯 SignIn exitoso, redirigiendo a user-panel por defecto');
        return `${baseUrl}/usuario/user-panel`;
      }
      
      // Si viene del home sin URL específica (después de login exitoso)
      if (url === baseUrl || url === `${baseUrl}/`) {
        console.log('🎯 Redirect desde home después de login - enviando a user-panel');
        return `${baseUrl}/usuario/user-panel`;
      }
      
      // Permitir URLs relativas
      if (url.startsWith("/")) {
        console.log('🔗 URL relativa detectada:', url);
        return `${baseUrl}${url}`;
      }
      
      // Permitir URLs del mismo origen
      if (url.startsWith(baseUrl)) {
        console.log('🔗 URL del mismo origen:', url);
        return url;
      }
      
      // Por defecto, redirigir al panel del usuario
      console.log('🔄 Redirect por defecto a usuario/user-panel');
      return `${baseUrl}/usuario/user-panel`;
    },
  },
  pages: {
    signIn: '/acceso',
    error: '/acceso/error', // Error code passed in query string as ?error=
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
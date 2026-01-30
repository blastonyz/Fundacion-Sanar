'use client'

import { SessionProvider } from "next-auth/react"
import { AuthProvider as AuthContextProvider } from '@/contexts/auth-context'
import type { ReactNode } from 'react'

interface AuthProviderProps {
  children: ReactNode
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <AuthContextProvider>
        {children}
      </AuthContextProvider>
    </SessionProvider>
  )
}
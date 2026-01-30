'use client'

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LogOut, Settings } from "lucide-react"

export default function AuthButton() {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    userName, 
    userEmail 
  } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
    )
  }

  if (isAuthenticated && user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.image || ""} alt={userName || ""} />
              <AvatarFallback>
                {userName
                  ? userName.split(' ').map(n => n[0]).join('').toUpperCase()
                  : userEmail?.[0].toUpperCase()
                }
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {userName && (
                <p className="font-medium">{userName}</p>
              )}
              {userEmail && (
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {userEmail}
                </p>
              )}
              {user.role && (
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {user.role}
                </span>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="cursor-pointer"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Cerrar sesión</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" onClick={() => login()}>
        Iniciar sesión
      </Button>
      <Button onClick={() => window.location.href = '/auth/signup'}>
        Registrarse
      </Button>
    </div>
  )
}
"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSelector } from 'react-redux'
import { selectCurrentAdmin } from '@/lib/redux/admin/adminSlice'
import { selectCurrentUser } from '@/lib/redux/user/userSlice'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
  requireUser?: boolean
  redirectTo?: string
}

export const ProtectedRoute = ({ 
  children, 
  requireAdmin = false, 
  requireUser = false,
  redirectTo 
}: ProtectedRouteProps) => {
  const router = useRouter()
  const currentAdmin = useSelector(selectCurrentAdmin)
  const currentUser = useSelector(selectCurrentUser)
  const [isChecking, setIsChecking] = useState(true)
  
  useEffect(() => {
    // Check admin requirement
    if (requireAdmin && !currentAdmin) {
      router.push(redirectTo || '/admin/login')
      return
    }
    
    // Check user requirement
    if (requireUser && !currentUser) {
      router.push(redirectTo || '/login')
      return
    }
    
    // If user tries to access admin route
    if (requireAdmin && currentUser && !currentAdmin) {
      router.push('/')
      return
    }
    
    setIsChecking(false)
  }, [requireAdmin, requireUser, currentAdmin, currentUser, router, redirectTo])
  
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }
  
  // Render children if all checks pass
  if (requireAdmin && !currentAdmin) return null
  if (requireUser && !currentUser) return null
  
  return <>{children}</>
}

// HOC for easier use
export const withAdminAuth = (Component: React.ComponentType) => {
  return (props: any) => (
    <ProtectedRoute requireAdmin>
      <Component {...props} />
    </ProtectedRoute>
  )
}

export const withUserAuth = (Component: React.ComponentType) => {
  return (props: any) => (
    <ProtectedRoute requireUser>
      <Component {...props} />
    </ProtectedRoute>
  )
}
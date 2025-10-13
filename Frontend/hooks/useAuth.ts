import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/lib/redux/user/userSlice'
import { selectCurrentAdmin } from '@/lib/redux/admin/adminSlice'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export const useAuth = () => {
  const currentUser = useSelector(selectCurrentUser)
  const currentAdmin = useSelector(selectCurrentAdmin)
   const router = useRouter()

    const requireUserAuth = (callback: () => void, message?: string) => {
        if (!currentUser) {
            toast.error(message || 'You must be logged in to perform this action.')
            router.push('/users/login')
            return false
        }
        callback()
        return true
    }

    const requireAdminAuth = (callback: () => void, message?: string) => {
        if (!currentAdmin) {
            toast.error(message || 'You must be logged in as an admin to perform this action.')
            router.push('/admin/login')
            return false
        }
        callback()
        return true
    }

  return {
    user: currentUser,
    admin: currentAdmin,
    isUserLoggedIn: !!currentUser,
    isAdminLoggedIn: !!currentAdmin,
    isLoggedIn: !!currentUser || !!currentAdmin,
    role: currentAdmin ? 'admin' : currentUser ? 'user' : null,
    requireUserAuth, 
    requireAdminAuth, 
  }
}

// Hook to protect admin routes
export const useAdminAuth = () => {
  const router = useRouter()
  const { admin, isAdminLoggedIn } = useAuth()

  useEffect(() => {
    if (!isAdminLoggedIn) {
      router.push('/admin/login')
    }
  }, [isAdminLoggedIn, router])

  return { admin, isAdminLoggedIn }
}

// Hook to protect user routes
export const useUserAuth = () => {
  const router = useRouter()
  const { user, isUserLoggedIn } = useAuth()

  useEffect(() => {
    if (!isUserLoggedIn) {
      router.push('users/login')
    }
  }, [isUserLoggedIn, router])

  return { user, isUserLoggedIn }
}

// Hook to redirect if already logged in
export const useRedirectIfAuth = (redirectTo: string = '/') => {
  const router = useRouter()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn) {
      router.push(redirectTo)
    }
  }, [isLoggedIn, router, redirectTo])
}
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '@/lib/redux/user/userSlice'
import { selectCurrentAdmin } from '@/lib/redux/admin/adminSlice'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useAuth = () => {
  const currentUser = useSelector(selectCurrentUser)
  const currentAdmin = useSelector(selectCurrentAdmin)

  return {
    user: currentUser,
    admin: currentAdmin,
    isUserLoggedIn: !!currentUser,
    isAdminLoggedIn: !!currentAdmin,
    isLoggedIn: !!currentUser || !!currentAdmin,
    role: currentAdmin ? 'admin' : currentUser ? 'user' : null
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
      router.push('/login')
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
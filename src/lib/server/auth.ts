import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

function getApiUrl(path: string): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
  return `${baseUrl}${path}`
}

export interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  role: 'user' | 'owner' | 'admin'
  avatar?: string
  isVerified: boolean
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    
    if (!token) return null

    const response = await fetch(getApiUrl('/api/auth/me'), {
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token.value}`
      }
    })

    if (!response.ok) return null

    return await response.json()
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(redirectTo: string = '/login'): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect(redirectTo)
  }
  return user
}

export async function requireRole(
  role: 'user' | 'owner' | 'admin',
  redirectTo: string = '/login'
): Promise<User> {
  const user = await requireAuth(redirectTo)
  if (user.role !== role && user.role !== 'admin') {
    redirect('/')
  }
  return user
}

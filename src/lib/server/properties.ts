import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

// Utiliser la variable d'environnement correcte
// En dev : http://localhost:5000 (selon .env.local)
// En prod : URL de déploiement Vercel
function getApiUrl(path: string): string {
  // En production (Vercel, etc), utiliser l'URL du déploiement  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}${path}`
  }
  
  // En développement, utiliser NEXT_PUBLIC_APP_URL depuis .env.local
  // qui pointe vers http://localhost:5000
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000'
  return `${baseUrl}${path}`
}

export interface Property {
  _id: string
  title: string
  description: string
  type: string
  location: {
    address: string
    city: string
    country: string
    coordinates?: {
      lat: number
      lng: number
    }
  }
  price: {
    perNight: number
    currency: string
  }
  capacity: {
    guests: number
    bedrooms: number
    bathrooms: number
  }
  amenities: string[]
  images: Array<{ url: string; publicId: string }>
  rating: number
  isAvailable: boolean
  owner: {
    _id: string
    firstName: string
    lastName: string
  }
}

export interface PropertiesResponse {
  properties: Property[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export async function getProperties(params?: {
  search?: string
  type?: string
  city?: string
  minPrice?: string
  maxPrice?: string
  page?: number
}): Promise<PropertiesResponse> {
  const searchParams = new URLSearchParams()
  if (params?.search) searchParams.append('search', params.search)
  if (params?.type) searchParams.append('type', params.type)
  if (params?.city) searchParams.append('city', params.city)
  if (params?.minPrice) searchParams.append('minPrice', params.minPrice)
  if (params?.maxPrice) searchParams.append('maxPrice', params.maxPrice)
  if (params?.page) searchParams.append('page', params.page.toString())

  const url = getApiUrl(`/api/properties?${searchParams.toString()}`)
  
  const response = await fetch(url, {
    next: { revalidate: 0 }, // Toujours avoir les données fraîches
    headers: {
      'Content-Type': 'application/json',
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to fetch properties: ${response.status}`)
  }

  const data = await response.json()
  return {
    properties: data.properties || [],
    pagination: data.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 }
  }
}

export async function getPropertyById(id: string): Promise<Property> {
  const url = getApiUrl(`/api/properties/${id}`)
  
  const response = await fetch(url, {
    next: { revalidate: 0 },
    headers: {
      'Content-Type': 'application/json',
    }
  })

  if (response.status === 404) {
    notFound()
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch property: ${response.status}`)
  }

  return await response.json()
}

export async function checkFavorite(propertyId: string): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')
    
    if (!token) return false

    const url = getApiUrl(`/api/favorites/${propertyId}/check`)
    
    const response = await fetch(url, {
      next: { revalidate: 0 },
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token.value}`
      }
    })

    if (!response.ok) return false

    const data = await response.json()
    return data.isFavorited || false
  } catch (error) {
    // Ne pas throw pour checkFavorite - c'est optionnel
    console.error('Error checking favorite:', error)
    return false
  }
}

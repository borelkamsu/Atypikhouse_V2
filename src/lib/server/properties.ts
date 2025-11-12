import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import connectDB from '@/lib/db/mongodb'
import { Property as PropertyModel } from '@/models/property'

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
  try {
    await connectDB()
    
    const page = params?.page || 1
    const limit = 10
    const skip = (page - 1) * limit

    // Construction du filtre MongoDB
    const filter: any = { isAvailable: true }
    
    if (params?.type) {
      filter.type = params.type
    }
    
    if (params?.city) {
      filter['location.city'] = new RegExp(params.city, 'i')
    }
    
    if (params?.search) {
      filter.$or = [
        { title: new RegExp(params.search, 'i') },
        { description: new RegExp(params.search, 'i') }
      ]
    }
    
    if (params?.minPrice || params?.maxPrice) {
      filter['price.perNight'] = {}
      if (params.minPrice) filter['price.perNight'].$gte = parseFloat(params.minPrice)
      if (params.maxPrice) filter['price.perNight'].$lte = parseFloat(params.maxPrice)
    }

    const [properties, total] = await Promise.all([
      PropertyModel.find(filter)
        .populate('owner', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      PropertyModel.countDocuments(filter)
    ])

    return {
      properties: properties.map((prop: any) => ({
        ...prop,
        _id: prop._id.toString(),
        owner: prop.owner ? {
          _id: prop.owner._id.toString(),
          firstName: prop.owner.firstName,
          lastName: prop.owner.lastName
        } : undefined
      })),
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    }
  } catch (error) {
    console.error('Error fetching properties:', error)
    return {
      properties: [],
      pagination: { total: 0, page: 1, limit: 10, totalPages: 0 }
    }
  }
}

export async function getPropertyById(id: string): Promise<Property> {
  try {
    await connectDB()
    
    const property: any = await PropertyModel.findById(id)
      .populate('owner', 'firstName lastName')
      .lean()

    if (!property) {
      notFound()
    }

    return {
      ...property,
      _id: property._id.toString(),
      owner: property.owner ? {
        _id: property.owner._id.toString(),
        firstName: property.owner.firstName,
        lastName: property.owner.lastName
      } : undefined
    }
  } catch (error) {
    console.error('Error fetching property:', error)
    notFound()
  }
}

export async function checkFavorite(propertyId: string): Promise<boolean> {
  try {
    // Pour l'instant, retourner false car checkFavorite nécessite l'authentification
    // qui est mieux gérée par le client component
    return false
  } catch (error) {
    return false
  }
}

'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';

export async function updatePropertyAction(propertyId: string, formData: FormData) {
  // Vérifier l'authentification
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    redirect('/login');
  }

  try {
    await dbConnect();

    // Vérifier que la propriété existe et appartient à l'utilisateur
    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) {
      throw new Error('Propriété non trouvée');
    }

    if (existingProperty.owner.toString() !== decoded.userId && decoded.role !== 'admin') {
      throw new Error('Non autorisé');
    }

    // Extraire les données du formulaire
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const address = formData.get('address') as string;
    const city = formData.get('city') as string;
    const country = formData.get('country') as string;
    const lat = parseFloat(formData.get('lat') as string) || 0;
    const lng = parseFloat(formData.get('lng') as string) || 0;
    const perNight = parseFloat(formData.get('perNight') as string);
    const guests = parseInt(formData.get('guests') as string);
    const bedrooms = parseInt(formData.get('bedrooms') as string);
    const bathrooms = parseInt(formData.get('bathrooms') as string);
    const isAvailable = formData.get('isAvailable') === 'true';

    // Récupérer les amenities (format: amenity-wifi=on, amenity-parking=on, etc.)
    const amenities: string[] = [];
    const amenityOptions = [
      'WiFi',
      'Parking',
      'Cuisine équipée',
      'Chauffage',
      'Climatisation',
      'Piscine',
      'Jardin',
      'Terrasse',
      'Balcon',
      'Cheminée',
      'Lave-linge',
      'Lave-vaisselle',
      'Télévision',
      'Animaux acceptés',
      'Non-fumeur',
      'Accessible PMR'
    ];

    amenityOptions.forEach(amenity => {
      const key = `amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`;
      if (formData.get(key) === 'on') {
        amenities.push(amenity);
      }
    });

    // Mettre à jour la propriété
    await Property.findByIdAndUpdate(
      propertyId,
      {
        title,
        description,
        type,
        location: {
          address,
          city,
          country,
          coordinates: {
            lat,
            lng
          }
        },
        price: {
          perNight,
          currency: 'EUR'
        },
        capacity: {
          guests,
          bedrooms,
          bathrooms
        },
        amenities,
        isAvailable
      },
      { runValidators: true }
    );

    redirect('/owner/dashboard');
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour:', error);
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    throw error;
  }
}

export async function deletePropertyAction(propertyId: string) {
  // Vérifier l'authentification
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/login');
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    redirect('/login');
  }

  try {
    await dbConnect();

    // Vérifier que la propriété existe et appartient à l'utilisateur
    const existingProperty = await Property.findById(propertyId);
    if (!existingProperty) {
      throw new Error('Propriété non trouvée');
    }

    if (existingProperty.owner.toString() !== decoded.userId && decoded.role !== 'admin') {
      throw new Error('Non autorisé');
    }

    await Property.findByIdAndDelete(propertyId);
    
    redirect('/owner/dashboard');
  } catch (error: any) {
    console.error('Erreur lors de la suppression:', error);
    if (error.message === 'NEXT_REDIRECT') {
      throw error;
    }
    throw error;
  }
}

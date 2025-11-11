import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { EditPropertyForm } from '@/components/owner/edit-property-form-ssr';
import { verifyToken } from '@/lib/auth/jwt';
import dbConnect from '@/lib/db/mongodb';
import { Property } from '@/models/property';

async function getProperty(id: string, userId: string) {
  try {
    await dbConnect();
    
    const property = await Property.findById(id).lean();
    
    if (!property) {
      return null;
    }

    // Vérifier que l'utilisateur est le propriétaire
    if (property.owner.toString() !== userId) {
      return null;
    }

    // Convertir _id en string pour la sérialisation JSON
    return {
      ...property,
      _id: property._id.toString(),
      owner: property.owner.toString(),
    };
  } catch (error) {
    console.error('Erreur lors du chargement de la propriété:', error);
    return null;
  }
}

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
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

  const property = await getProperty(params.id, decoded.userId);

  if (!property) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/owner/dashboard">
            <Button
              variant="outline"
              className="mb-4"
              data-testid="button-back"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Modifier la propriété</h1>
          <p className="text-gray-600 mt-2">
            Modifiez les informations de votre annonce
          </p>
        </div>

        <EditPropertyForm property={property} propertyId={params.id} />
      </div>
    </div>
  );
}

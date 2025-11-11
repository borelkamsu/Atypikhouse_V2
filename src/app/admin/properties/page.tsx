'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Property {
  _id: string;
  title: string;
  type: string;
  location: {
    city: string;
  };
  price: {
    perNight: number;
  };
}

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadProperties = async () => {
    try {
      const response = await fetch('/api/properties?limit=100');
      const data = await response.json();
      setProperties(data.properties || []);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les propriétés',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDeleteAll = async () => {
    if (!confirm('Voulez-vous vraiment supprimer TOUTES les propriétés ?')) {
      return;
    }

    try {
      const response = await fetch('/api/admin/clean-properties', {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Succès',
          description: `${result.deletedCount} propriétés supprimées`
        });
        loadProperties();
      } else {
        toast({
          title: 'Erreur',
          description: result.message,
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors de la suppression',
        variant: 'destructive'
      });
    }
  };

  if (isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Gestion des propriétés (Admin)</h1>
          <Button
            onClick={handleDeleteAll}
            className="bg-red-600 hover:bg-red-700 text-white"
            data-testid="button-delete-all"
          >
            Supprimer toutes les propriétés
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <p className="text-gray-600">
              Total : <strong>{properties.length}</strong> propriétés
            </p>
          </div>

          <div className="divide-y">
            {properties.length === 0 ? (
              <p className="p-8 text-center text-gray-500">Aucune propriété</p>
            ) : (
              properties.map((property) => (
                <div
                  key={property._id}
                  className="p-4 flex justify-between items-center hover:bg-gray-50"
                  data-testid={`property-${property._id}`}
                >
                  <div>
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-sm text-gray-600">
                      {property.type} • {property.location.city} • €{property.price.perNight}/nuit
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{property._id}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

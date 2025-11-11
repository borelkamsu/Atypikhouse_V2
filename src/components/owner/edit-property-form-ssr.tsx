'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload, MapPin, Euro, Users, Home, Bath, Bed } from 'lucide-react';
import { updatePropertyAction } from '@/app/owner/properties/[id]/edit/actions';

const propertyTypes = [
  { value: 'cabin', label: 'Cabane' },
  { value: 'yurt', label: 'Yourte' },
  { value: 'floating', label: 'Maison flottante' },
  { value: 'dome', label: 'Dôme' },
  { value: 'caravan', label: 'Caravane' },
  { value: 'igloo', label: 'Igloo' },
  { value: 'other', label: 'Autre' }
];

const amenities = [
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

interface EditPropertyFormProps {
  property: any;
  propertyId: string;
}

export function EditPropertyForm({ property, propertyId }: EditPropertyFormProps) {
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(property.amenities || []);

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  // Lier la Server Action avec le propertyId
  const boundAction = updatePropertyAction.bind(null, propertyId);

  return (
    <form action={boundAction} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Informations de base
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre de l'annonce *</Label>
            <Input
              id="title"
              name="title"
              required
              defaultValue={property.title}
              placeholder="Ex: Cabane dans les arbres avec vue sur la forêt"
              data-testid="input-title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              name="description"
              required
              defaultValue={property.description}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Décrivez votre propriété..."
              data-testid="input-description"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type de logement *</Label>
            <select
              id="type"
              name="type"
              required
              defaultValue={property.type}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="select-type"
            >
              <option value="">Sélectionnez le type</option>
              {propertyTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isAvailable">Disponibilité</Label>
            <select
              id="isAvailable"
              name="isAvailable"
              defaultValue={property.isAvailable ? 'true' : 'false'}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              data-testid="select-availability"
            >
              <option value="true">Disponible</option>
              <option value="false">Indisponible</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Localisation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Adresse complète *</Label>
            <Input
              id="address"
              name="address"
              required
              defaultValue={property.location?.address}
              placeholder="123 Rue de la Forêt"
              data-testid="input-address"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ville *</Label>
              <Input
                id="city"
                name="city"
                required
                defaultValue={property.location?.city}
                placeholder="Paris"
                data-testid="input-city"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Pays *</Label>
              <Input
                id="country"
                name="country"
                required
                defaultValue={property.location?.country}
                placeholder="France"
                data-testid="input-country"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitude (optionnel)</Label>
              <Input
                id="lat"
                name="lat"
                type="number"
                step="any"
                defaultValue={property.location?.coordinates?.lat}
                placeholder="48.8566"
                data-testid="input-lat"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitude (optionnel)</Label>
              <Input
                id="lng"
                name="lng"
                type="number"
                step="any"
                defaultValue={property.location?.coordinates?.lng}
                placeholder="2.3522"
                data-testid="input-lng"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="h-5 w-5" />
            Prix et capacité
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="perNight">Prix par nuit (€) *</Label>
            <Input
              id="perNight"
              name="perNight"
              type="number"
              required
              min="0"
              step="0.01"
              defaultValue={property.price?.perNight}
              placeholder="120"
              data-testid="input-price"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="guests" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Voyageurs *
              </Label>
              <Input
                id="guests"
                name="guests"
                type="number"
                required
                min="1"
                defaultValue={property.capacity?.guests}
                placeholder="4"
                data-testid="input-guests"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bedrooms" className="flex items-center gap-2">
                <Bed className="h-4 w-4" />
                Chambres *
              </Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                required
                min="0"
                defaultValue={property.capacity?.bedrooms}
                placeholder="2"
                data-testid="input-bedrooms"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bathrooms" className="flex items-center gap-2">
                <Bath className="h-4 w-4" />
                Salles de bain *
              </Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                required
                min="0"
                defaultValue={property.capacity?.bathrooms}
                placeholder="1"
                data-testid="input-bathrooms"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Équipements</CardTitle>
          <CardDescription>Sélectionnez les équipements disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {amenities.map((amenity) => (
              <label
                key={amenity}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  name={`amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                  checked={selectedAmenities.includes(amenity)}
                  onChange={() => handleAmenityToggle(amenity)}
                  className="rounded border-gray-300"
                  data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <span className="text-sm text-gray-700">{amenity}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {property.images && property.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Images actuelles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.images.map((image: any, index: number) => (
                <div key={index} className="relative">
                  <img
                    src={image.url}
                    alt={`Image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-4">
        <Button
          type="submit"
          className="flex-1"
          data-testid="button-submit"
        >
          Enregistrer les modifications
        </Button>
      </div>
    </form>
  );
}

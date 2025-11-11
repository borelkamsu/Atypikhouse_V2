'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Upload, MapPin, Euro, Users, Home, Bath, Bed } from 'lucide-react';

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

export default function NewPropertyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedImages(files);
    
    // Créer les prévisualisations
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleAmenityToggle = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    
    // Préparer les données de la propriété
    const propertyData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as string,
      location: {
        address: formData.get('address') as string,
        city: formData.get('city') as string,
        country: formData.get('country') as string,
        coordinates: {
          lat: parseFloat(formData.get('lat') as string) || 0,
          lng: parseFloat(formData.get('lng') as string) || 0
        }
      },
      price: {
        perNight: parseFloat(formData.get('perNight') as string),
        currency: 'EUR'
      },
      capacity: {
        guests: parseInt(formData.get('guests') as string),
        bedrooms: parseInt(formData.get('bedrooms') as string),
        bathrooms: parseInt(formData.get('bathrooms') as string)
      },
      amenities: selectedAmenities,
      isAvailable: true
    };

    try {
      // Créer la propriété
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      const result = await response.json();

      if (response.ok) {
        const propertyId = result.property._id;

        // Upload des images si il y en a
        if (selectedImages.length > 0) {
          const uploadFormData = new FormData();
          selectedImages.forEach(image => {
            uploadFormData.append('images', image);
          });

          try {
            await fetch(`/api/properties/${propertyId}/images`, {
              method: 'POST',
              body: uploadFormData,
            });
          } catch (uploadError) {
            console.error('Erreur lors de l\'upload des images:', uploadError);
            // On continue même si l'upload échoue
          }
        }

        toast({
          title: 'Propriété créée !',
          description: 'Votre propriété a été ajoutée avec succès.',
        });
        router.push('/owner/dashboard');
      } else {
        toast({
          title: 'Erreur',
          description: result.message || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la création',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ajouter une propriété</h1>
          <p className="text-gray-600 mt-2">
            Créez votre annonce de location insolite
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations de base */}
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
                  placeholder="Ex: Cabane dans les arbres avec vue sur la forêt"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  name="description"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Décrivez votre propriété, son charme, son environnement..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type de logement *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Localisation */}
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
                  placeholder="123 Rue de la Forêt, 75000 Paris"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ville *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="Paris"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Pays *</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    placeholder="France"
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
                    placeholder="48.8566"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lng">Longitude (optionnel)</Label>
                  <Input
                    id="lng"
                    name="lng"
                    type="number"
                    step="any"
                    placeholder="2.3522"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prix et capacité */}
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
                  placeholder="120"
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
                    placeholder="4"
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
                    placeholder="2"
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
                    placeholder="1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Équipements */}
          <Card>
            <CardHeader>
              <CardTitle>Équipements et commodités</CardTitle>
              <CardDescription>
                Sélectionnez les équipements disponibles dans votre propriété
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Photos de la propriété
              </CardTitle>
              <CardDescription>
                Ajoutez des photos attractives de votre propriété (minimum 1)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="images">Sélectionner des images</Label>
                  <Input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Création en cours...' : 'Créer la propriété'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

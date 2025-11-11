'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Upload, Image as ImageIcon, Plus, X, Home, Users, Bed, Bath } from "lucide-react";

// Types de propriétés disponibles
const PROPERTY_TYPES = [
  { value: 'treehouse', label: 'Cabane dans les arbres' },
  { value: 'cabin', label: 'Cabane' },
  { value: 'yurt', label: 'Yourte' },
  { value: 'tent', label: 'Tente de luxe' },
  { value: 'houseboat', label: 'Maison flottante' },
  { value: 'cave', label: 'Maison troglodyte' },
  { value: 'castle', label: 'Château' },
  { value: 'farmhouse', label: 'Ferme' },
  { value: 'villa', label: 'Villa' },
  { value: 'apartment', label: 'Appartement' },
  { value: 'other', label: 'Autre' },
];

// Équipements disponibles
const AMENITIES = [
  'WiFi',
  'Parking gratuit',
  'Cuisine équipée',
  'Chauffage',
  'Climatisation',
  'Jardin',
  'BBQ',
  'Piscine',
  'Jacuzzi',
  'Spa',
  'Sauna',
  'Tennis',
  'Golf',
  'Plage privée',
  'Vue sur mer',
  'Vue sur montagne',
  'Cheminée',
  'Animaux acceptés',
  'Non-fumeur',
  'Ascenseur',
  'Sécurisé',
  'Ménage inclus',
];

// Schéma de validation
const propertyFormSchema = z.object({
  name: z.string().min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  type: z.string().min(1, "Le type d'hébergement est requis"),
  price: z.coerce.number().min(1, "Le prix doit être supérieur à 0€"),
  location: z.string().min(3, "La localisation doit contenir au moins 3 caractères"),
  address: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  maxGuests: z.coerce.number().min(1, "Le nombre d'invités doit être au moins 1"),
  bedrooms: z.coerce.number().min(0, "Le nombre de chambres doit être au moins 0"),
  bathrooms: z.coerce.number().min(1, "Le nombre de salles de bain doit être au moins 1"),
  instantBooking: z.boolean().default(false),
});

type PropertyFormData = z.infer<typeof propertyFormSchema>;

interface PropertyCreationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function PropertyCreationForm({ onSuccess, onCancel }: PropertyCreationFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "",
      location: "",
      address: "",
      price: 0,
      maxGuests: 1,
      bedrooms: 1,
      bathrooms: 1,
      instantBooking: false,
    },
  });

  // Gestion des images
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const validFiles = files.filter(file => {
        const isValidType = file.type.startsWith('image/');
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
        return isValidType && isValidSize;
      });

      if (validFiles.length !== files.length) {
        toast({
          title: "Fichiers invalides",
          description: "Seules les images de moins de 10MB sont acceptées",
          variant: "destructive"
        });
      }

      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...validFiles]);
      setPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  // Gestion des équipements
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    if (newAmenity.trim() && !selectedAmenities.includes(newAmenity.trim())) {
      setSelectedAmenities(prev => [...prev, newAmenity.trim()]);
      setNewAmenity("");
    }
  };

  const removeAmenity = (amenity: string) => {
    setSelectedAmenities(prev => prev.filter(a => a !== amenity));
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    
    try {
      // Créer la propriété
      const propertyData = {
        ...data,
        amenities: selectedAmenities,
      };

      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      });

      const result = await response.json();

      if (response.ok) {
        const propertyId = result._id;

        // Upload des images si il y en a
        if (selectedImages.length > 0) {
          const formData = new FormData();
          selectedImages.forEach((image, index) => {
            formData.append('images', image);
          });

          try {
            const imageResponse = await fetch(`/api/properties/${propertyId}/images`, {
              method: 'POST',
              body: formData,
            });

            if (!imageResponse.ok) {
              console.warn('Erreur lors de l\'upload des images');
            }
          } catch (error) {
            console.warn('Erreur lors de l\'upload des images:', error);
          }
        }

        toast({
          title: "Propriété créée",
          description: "Votre hébergement a été créé avec succès !",
        });

        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/properties');
        }
      } else {
        toast({
          title: "Erreur de création",
          description: result.message || "Une erreur s'est produite lors de la création",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur de création",
        description: error.message || "Une erreur s'est produite lors de la création",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ajouter un hébergement
        </h1>
        <p className="text-gray-600">
          Créez votre annonce et commencez à accueillir des voyageurs
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informations de base */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Informations de base
              </CardTitle>
              <CardDescription>
                Les informations essentielles de votre hébergement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de l'hébergement</FormLabel>
                    <FormControl>
                      <Input placeholder="La Cabane Perchée" {...field} />
                    </FormControl>
                    <FormDescription>
                      Un nom attrayant qui décrit bien votre hébergement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type d'hébergement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PROPERTY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Sélectionnez la catégorie qui correspond le mieux à votre hébergement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez votre hébergement, son ambiance, ses particularités..."
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Une description détaillée aidera les voyageurs à se projeter
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Localisation */}
          <Card>
            <CardHeader>
              <CardTitle>Localisation</CardTitle>
              <CardDescription>
                Où se trouve votre hébergement ?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localisation</FormLabel>
                    <FormControl>
                      <Input placeholder="Ardèche, France" {...field} />
                    </FormControl>
                    <FormDescription>
                      La région ou la ville où se situe votre hébergement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse complète</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Route des Pins, 07200 Vals-les-Bains" {...field} />
                    </FormControl>
                    <FormDescription>
                      L'adresse exacte (visible seulement après réservation)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Capacité et équipements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Capacité et équipements
              </CardTitle>
              <CardDescription>
                Combien de personnes peuvent séjourner et quels équipements proposez-vous ?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="maxGuests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre d'invités</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chambres</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salles de bain</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <Label className="text-base font-medium">Équipements</Label>
                <p className="text-sm text-gray-600 mb-4">
                  Sélectionnez les équipements disponibles dans votre hébergement
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {AMENITIES.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={selectedAmenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm">
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>

                {/* Ajouter un équipement personnalisé */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="Ajouter un équipement..."
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())}
                  />
                  <Button type="button" onClick={addCustomAmenity} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Affichage des équipements sélectionnés */}
                {selectedAmenities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {selectedAmenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary" className="flex items-center">
                        {amenity}
                        <X 
                          className="w-3 h-3 ml-1 cursor-pointer" 
                          onClick={() => removeAmenity(amenity)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tarifs et disponibilité */}
          <Card>
            <CardHeader>
              <CardTitle>Tarifs et disponibilité</CardTitle>
              <CardDescription>
                Fixez vos tarifs et configurez les options de réservation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prix par nuit (€)</FormLabel>
                    <FormControl>
                      <Input type="number" min={1} placeholder="120" {...field} />
                    </FormControl>
                    <FormDescription>
                      Le prix que vous souhaitez facturer par nuit
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="instantBooking"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Réservation instantanée
                      </FormLabel>
                      <FormDescription>
                        Permettre aux voyageurs de réserver sans attendre votre confirmation
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Photos
              </CardTitle>
              <CardDescription>
                Ajoutez des photos attrayantes de votre hébergement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Zone de drop des images */}
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Cliquez pour sélectionner des images ou glissez-les ici
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, JPEG - Max 10MB par image
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />

                {/* Aperçu des images */}
                {previewUrls.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Aperçu ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Boutons d'action */}
          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={onCancel || (() => router.back())}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création en cours...' : 'Créer l\'hébergement'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

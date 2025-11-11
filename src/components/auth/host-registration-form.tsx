'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Upload, FileText, CheckCircle, AlertCircle, TreePine } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Schema pour l'inscription propriétaire
const hostRegistrationSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Adresse email invalide'),
  password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères'),
  phone: z.string().min(1, 'Le numéro de téléphone est requis'),
  siret: z.string().min(14, 'Le numéro SIRET doit comporter 14 chiffres').max(14, 'Le numéro SIRET doit comporter 14 chiffres'),
  companyName: z.string().min(1, 'Le nom de l\'entreprise est requis'),
  businessDescription: z.string().min(10, 'La description doit comporter au moins 10 caractères'),
});

type HostRegistrationFormData = z.infer<typeof hostRegistrationSchema>;

interface HostRegistrationFormProps {
  onSuccess?: () => void;
  onBack?: () => void;
}

export function HostRegistrationForm({ onSuccess, onBack }: HostRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<HostRegistrationFormData>({
    resolver: zodResolver(hostRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      siret: '',
      companyName: '',
      businessDescription: ''
    }
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      const isValidType = file.type.includes('pdf') || file.type.includes('image');
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      toast({
        title: "Fichiers invalides",
        description: "Seuls les fichiers PDF et images de moins de 5MB sont acceptés",
        variant: "destructive"
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
    
    // Simuler l'upload des fichiers
    const uploadPromises = validFiles.map(async (file) => {
      try {
        setUploadProgress(prev => ({ ...prev, [file.name]: 0 }));
        
        // Simuler la progression
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setUploadProgress(prev => ({ ...prev, [file.name]: i }));
        }
        
        // Pour l'instant, on simule juste l'upload
        return `/uploads/documents/${file.name}`;
      } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast({
        title: "Documents uploadés",
        description: `${validFiles.length} document(s) uploadé(s) avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur d'upload",
        description: "Impossible d'uploader les documents",
        variant: "destructive"
      });
    }
  };

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
  };

  const onSubmit = async (data: HostRegistrationFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/hosts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast({
          title: "Inscription réussie",
          description: "Votre demande d'inscription comme propriétaire a été envoyée pour validation",
        });
        
        if (onSuccess) {
          onSuccess();
        } else {
          router.push('/properties/create');
        }
      } else {
        toast({
          title: "Erreur d'inscription",
          description: result.message || "Une erreur s'est produite lors de l'inscription",
          variant: "destructive"
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur d'inscription",
        description: error.message || "Une erreur s'est produite lors de l'inscription",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <TreePine className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Devenez Propriétaire sur AtypikHouse
          </h1>
          <p className="text-lg text-gray-600">
            Proposez vos hébergements insolites et générez des revenus
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Inscription Propriétaire</CardTitle>
            <CardDescription>
              Devenez propriétaire sur AtypikHouse et proposez vos hébergements uniques
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Informations personnelles */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Informations Personnelles</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prénom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre prénom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="votre@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Téléphone</FormLabel>
                          <FormControl>
                            <Input placeholder="+33 1 23 45 67 89" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Mot de passe sécurisé" {...field} />
                          </FormControl>
                          <FormDescription>
                            Minimum 6 caractères
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Informations entreprise */}
                <div className="border-b pb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Informations Entreprise</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="companyName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom de l'entreprise</FormLabel>
                          <FormControl>
                            <Input placeholder="Nom de votre entreprise" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="siret"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Numéro SIRET</FormLabel>
                          <FormControl>
                            <Input placeholder="12345678901234" {...field} />
                          </FormControl>
                          <FormDescription>
                            14 chiffres sans espaces
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-4">
                    <FormField
                      control={form.control}
                      name="businessDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description de votre activité</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Décrivez votre activité, vos hébergements, votre expérience..."
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Minimum 10 caractères - Décrivez votre activité d'hébergement
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Documents justificatifs */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Documents Justificatifs</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-600 mb-2">
                      Glissez vos documents ici ou cliquez pour sélectionner
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      PDF, JPG, PNG - Max 5MB par fichier
                    </p>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                      id="file-upload"
                    />
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      Sélectionner des fichiers
                    </Button>
                  </div>

                  {/* Liste des fichiers uploadés */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5 text-gray-400" />
                            <div>
                              <p className="text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {uploadProgress[file.name] !== undefined && uploadProgress[file.name] < 100 ? (
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${uploadProgress[file.name]}%` }}
                                />
                              </div>
                            ) : (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                            >
                              ×
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-between pt-6">
                  {onBack && (
                    <Button type="button" variant="outline" onClick={onBack}>
                      Retour
                    </Button>
                  )}
                  <Button type="submit" disabled={isSubmitting} className="flex-1 ml-4">
                    {isSubmitting ? 'Inscription en cours...' : 'Devenir propriétaire'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

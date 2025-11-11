'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, User, Building } from 'lucide-react';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('client');
  const router = useRouter();
  const { toast } = useToast();

  const handleClientRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      role: 'user'
    };

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Inscription réussie !',
          description: result.message || 'Votre compte client a été créé avec succès.',
        });
        router.push('/properties');
      } else {
        toast({
          title: 'Erreur d\'inscription',
          description: result.message || result.error || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'inscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOwnerRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      phone: formData.get('phone') as string,
      siret: formData.get('siret') as string,
      companyName: formData.get('companyName') as string,
      businessDescription: formData.get('businessDescription') as string,
      role: 'owner'
    };

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
          title: 'Demande d\'inscription envoyée !',
          description: result.message || 'Votre demande sera examinée par notre équipe.',
        });
        router.push('/');
      } else {
        toast({
          title: 'Erreur d\'inscription',
          description: result.message || result.error || 'Une erreur est survenue',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de l\'inscription',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-gray-900">
            Rejoignez AtypikHouse
          </CardTitle>
          <CardDescription className="text-lg text-gray-600">
            Créez votre compte pour découvrir des logements insolites
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="client" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Client
              </TabsTrigger>
              <TabsTrigger value="owner" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Propriétaire
              </TabsTrigger>
            </TabsList>

            <TabsContent value="client" className="space-y-4">
              <form onSubmit={handleClientRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      required
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      required
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone (optionnel)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Votre mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Création du compte...' : 'Créer mon compte client'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="owner" className="space-y-4">
              <form onSubmit={handleOwnerRegister} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerFirstName">Prénom</Label>
                    <Input
                      id="ownerFirstName"
                      name="firstName"
                      required
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerLastName">Nom</Label>
                    <Input
                      id="ownerLastName"
                      name="lastName"
                      required
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">Email</Label>
                  <Input
                    id="ownerEmail"
                    name="email"
                    type="email"
                    required
                    placeholder="votre@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Téléphone</Label>
                  <Input
                    id="ownerPhone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName">Nom de l'entreprise</Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    required
                    placeholder="Nom de votre entreprise"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siret">Numéro SIRET</Label>
                  <Input
                    id="siret"
                    name="siret"
                    required
                    placeholder="12345678901234"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessDescription">Description de votre activité</Label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Décrivez votre activité de location..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownerPassword">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="ownerPassword"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Votre mot de passe"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Envoi de la demande...' : 'Devenir propriétaire'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous avez déjà un compte ?{' '}
              <a href="/login" className="text-blue-600 hover:underline">
                Connectez-vous
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

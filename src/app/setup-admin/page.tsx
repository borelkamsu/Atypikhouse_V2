'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle } from 'lucide-react';

export default function SetupAdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);
  const { toast } = useToast();

  const handleCreateAdmin = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/create-admin', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        setIsCreated(true);
        toast({
          title: 'Admin créé avec succès !',
          description: `Email: ${result.admin.email} | Mot de passe: ${result.admin.password}`,
        });
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-heading">
            Configuration Admin
          </CardTitle>
          <CardDescription>
            Créez le compte administrateur pour AtypikHouse
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isCreated ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Cette page permet de créer le compte administrateur initial.
                </p>
                <div className="bg-gray-100 p-4 rounded-lg text-left">
                  <h4 className="font-medium mb-2">Identifiants par défaut :</h4>
                  <p><strong>Email :</strong> admin@atypikhouse.com</p>
                  <p><strong>Mot de passe :</strong> Admin123!</p>
                </div>
              </div>
              
              <Button 
                onClick={handleCreateAdmin}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? 'Création en cours...' : 'Créer le compte admin'}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Admin créé avec succès !
                </h3>
                <p className="text-gray-600 mb-4">
                  Le compte administrateur a été créé. Vous pouvez maintenant vous connecter.
                </p>
                <div className="bg-green-50 p-4 rounded-lg text-left">
                  <h4 className="font-medium mb-2 text-green-800">Identifiants :</h4>
                  <p><strong>Email :</strong> admin@atypikhouse.com</p>
                  <p><strong>Mot de passe :</strong> Admin123!</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.href = '/login'}
                  className="flex-1"
                >
                  Se connecter
                </Button>
                <Button 
                  onClick={() => window.location.href = '/admin/dashboard'}
                  variant="outline"
                  className="flex-1"
                >
                  Admin Panel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

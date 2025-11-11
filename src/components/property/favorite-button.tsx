'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface FavoriteButtonProps {
  propertyId: string;
  className?: string;
}

export function FavoriteButton({ propertyId, className = '' }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkAuthAndFavoriteStatus();
  }, [propertyId]);

  const checkAuthAndFavoriteStatus = async () => {
    try {
      const authResponse = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      
      if (!authResponse.ok) {
        setIsAuthenticated(false);
        return;
      }
      
      setIsAuthenticated(true);
      
      const favoriteResponse = await fetch(`/api/favorites/${propertyId}`, {
        credentials: 'include',
      });
      
      if (favoriteResponse.ok) {
        const data = await favoriteResponse.json();
        setIsFavorite(data.isFavorite);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du favori:', error);
    }
  };

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast({
        title: 'Connexion requise',
        description: 'Vous devez être connecté pour ajouter des favoris',
        variant: 'destructive',
      });
      setTimeout(() => {
        window.location.href = '/login';
      }, 1500);
      return;
    }

    setIsLoading(true);

    try {
      if (isFavorite) {
        const response = await fetch(`/api/favorites/${propertyId}`, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (response.ok) {
          setIsFavorite(false);
          toast({
            title: 'Retiré des favoris',
            description: 'Cette propriété a été retirée de vos favoris',
          });
        }
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ propertyId }),
        });

        if (response.ok) {
          setIsFavorite(true);
          toast({
            title: 'Ajouté aux favoris',
            description: 'Cette propriété a été ajoutée à vos favoris',
          });
        } else if (response.status === 400) {
          const data = await response.json();
          toast({
            title: 'Information',
            description: data.message,
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`absolute top-4 right-4 bg-white/90 hover:bg-white hover:scale-110 transition-all duration-200 shadow-md ${className}`}
      onClick={toggleFavorite}
      disabled={isLoading}
      data-testid={`button-favorite-${propertyId}`}
    >
      <Heart
        className={`h-5 w-5 transition-colors ${
          isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-700'
        }`}
      />
    </Button>
  );
}

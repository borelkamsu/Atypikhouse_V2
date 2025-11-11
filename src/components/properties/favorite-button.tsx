'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface FavoriteButtonProps {
  propertyId: string
  initialIsFavorited: boolean
}

export default function FavoriteButton({ propertyId, initialIsFavorited }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const toggleFavorite = async () => {
    setIsLoading(true)
    
    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites/${propertyId}`, { 
          method: 'DELETE' 
        })
        
        if (response.status === 401) {
          toast({
            title: 'Connexion requise',
            description: 'Veuillez vous connecter pour gérer vos favoris',
            variant: 'destructive'
          })
          router.push('/login')
          return
        }
        
        if (!response.ok) throw new Error('Erreur')
        
        setIsFavorited(false)
        toast({
          title: 'Retiré des favoris',
          description: 'Le logement a été retiré de vos favoris'
        })
      } else {
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ propertyId })
        })
        
        if (response.status === 401) {
          toast({
            title: 'Connexion requise',
            description: 'Veuillez vous connecter pour ajouter aux favoris',
            variant: 'destructive'
          })
          router.push('/login')
          return
        }
        
        if (!response.ok) throw new Error('Erreur')
        
        setIsFavorited(true)
        toast({
          title: 'Ajouté aux favoris',
          description: 'Le logement a été ajouté à vos favoris'
        })
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFavorite}
      disabled={isLoading}
      className={isFavorited ? 'text-red-500' : ''}
      data-testid="button-favorite"
    >
      <Heart className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
    </Button>
  )
}

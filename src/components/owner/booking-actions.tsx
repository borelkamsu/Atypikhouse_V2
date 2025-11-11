'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

interface BookingActionsProps {
  bookingId: string;
}

export function BookingActions({ bookingId }: BookingActionsProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleBookingAction = async (action: 'confirm' | 'reject') => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status: action === 'confirm' ? 'confirmed' : 'cancelled' 
        }),
      });

      if (response.ok) {
        toast({
          title: action === 'confirm' ? 'Réservation confirmée' : 'Réservation rejetée',
          description: `La réservation a été ${action === 'confirm' ? 'confirmée' : 'rejetée'} avec succès.`,
        });
        router.refresh();
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de traiter la réservation',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <Button
        size="sm"
        onClick={() => handleBookingAction('confirm')}
        data-testid={`button-confirm-${bookingId}`}
      >
        <CheckCircle className="h-4 w-4 mr-1" />
        Confirmer
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleBookingAction('reject')}
        data-testid={`button-reject-${bookingId}`}
      >
        <XCircle className="h-4 w-4 mr-1" />
        Rejeter
      </Button>
    </div>
  );
}

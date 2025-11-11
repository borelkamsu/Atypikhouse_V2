'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deletePropertyAction } from '@/app/owner/properties/[id]/edit/actions';
import { useState } from 'react';

interface DeletePropertyFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function DeletePropertyForm({ propertyId, propertyTitle }: DeletePropertyFormProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!isConfirming) {
      e.preventDefault();
      if (confirm(`Êtes-vous sûr de vouloir supprimer "${propertyTitle}" ? Cette action est irréversible.`)) {
        setIsConfirming(true);
        // Soumettre le formulaire
        const form = e.currentTarget.closest('form');
        if (form) {
          form.requestSubmit();
        }
      }
    }
  };

  const boundAction = deletePropertyAction.bind(null, propertyId);

  return (
    <form action={boundAction} className="inline">
      <Button
        type="submit"
        size="sm"
        variant="destructive"
        onClick={handleClick}
        data-testid={`button-delete-${propertyId}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}

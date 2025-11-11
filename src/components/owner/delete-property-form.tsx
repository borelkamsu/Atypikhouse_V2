'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { deletePropertyAction } from '@/app/owner/properties/[id]/edit/actions';
import { useEffect } from 'react';

interface DeletePropertyFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function DeletePropertyForm({ propertyId, propertyTitle }: DeletePropertyFormProps) {
  const boundAction = deletePropertyAction.bind(null, propertyId);

  // Progressive enhancement : ajouter la confirmation seulement si JS est actif
  useEffect(() => {
    const form = document.getElementById(`delete-form-${propertyId}`) as HTMLFormElement;
    if (form) {
      form.onsubmit = (e) => {
        if (!confirm(`Êtes-vous sûr de vouloir supprimer "${propertyTitle}" ? Cette action est irréversible.`)) {
          e.preventDefault();
        }
      };
    }
  }, [propertyId, propertyTitle]);

  return (
    <form id={`delete-form-${propertyId}`} action={boundAction} className="inline">
      <Button
        type="submit"
        size="sm"
        variant="destructive"
        data-testid={`button-delete-${propertyId}`}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </form>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Check, X, UserCheck, UserX, Eye, FileText, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Owner {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyName?: string;
  siret?: string;
  businessDescription?: string;
  businessDocuments?: string[];
  hostStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  propertyCount: number;
  createdAt: string;
}

export function OwnersManagement() {
  const { toast } = useToast();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchOwners();
  }, [statusFilter]);

  const fetchOwners = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (search) {
        params.append('search', search);
      }

      const response = await fetch(`/api/admin/owners?${params}`);
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
      } else {
        throw new Error('Erreur lors de la récupération des propriétaires');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les propriétaires',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const approveOwner = async (ownerId: string) => {
    try {
      const response = await fetch(`/api/admin/owners/${ownerId}/approve`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast({
          title: 'Succès',
          description: 'Propriétaire approuvé avec succès',
        });
        fetchOwners();
        setShowDetailsDialog(false);
      } else {
        throw new Error('Erreur lors de l\'approbation');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'approuver le propriétaire',
        variant: 'destructive',
      });
    }
  };

  const rejectOwner = async (ownerId: string) => {
    try {
      const response = await fetch(`/api/admin/owners/${ownerId}/reject`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast({
          title: 'Succès',
          description: 'Propriétaire rejeté',
        });
        fetchOwners();
        setShowDetailsDialog(false);
      } else {
        throw new Error('Erreur lors du rejet');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de rejeter le propriétaire',
        variant: 'destructive',
      });
    }
  };

  const toggleOwnerStatus = async (ownerId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/owners/${ownerId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        toast({
          title: 'Succès',
          description: `Propriétaire ${!currentStatus ? 'activé' : 'désactivé'} avec succès`,
        });
        fetchOwners();
      } else {
        throw new Error('Erreur lors de la mise à jour');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut du propriétaire',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = () => {
    fetchOwners();
  };

  const viewOwnerDetails = (owner: Owner) => {
    setSelectedOwner(owner);
    setShowDetailsDialog(true);
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
    };
    const labels: Record<string, string> = {
      pending: 'En attente',
      approved: 'Approuvé',
      rejected: 'Rejeté',
    };
    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Propriétaires</CardTitle>
          <CardDescription>
            Validez les demandes d'inscription et gérez les comptes propriétaires
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, email ou entreprise..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
                data-testid="input-search-owners"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]" data-testid="select-status-filter">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="approved">Approuvés</SelectItem>
                <SelectItem value="rejected">Rejetés</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} data-testid="button-search">
              Rechercher
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8 text-gray-500">
              Chargement...
            </div>
          ) : owners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun propriétaire trouvé
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>SIRET</TableHead>
                    <TableHead>Propriétés</TableHead>
                    <TableHead>Statut validation</TableHead>
                    <TableHead>Compte actif</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {owners.map((owner) => (
                    <TableRow key={owner._id} data-testid={`row-owner-${owner._id}`}>
                      <TableCell className="font-medium">
                        {owner.firstName} {owner.lastName}
                      </TableCell>
                      <TableCell>
                        {owner.companyName ? (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-gray-400" />
                            {owner.companyName}
                          </div>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>
                        {owner.siret || <span className="text-gray-400">-</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" data-testid={`badge-properties-${owner._id}`}>
                          {owner.propertyCount} {owner.propertyCount > 1 ? 'propriétés' : 'propriété'}
                        </Badge>
                      </TableCell>
                      <TableCell data-testid={`cell-status-${owner._id}`}>
                        {getStatusBadge(owner.hostStatus)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={owner.isActive ? 'default' : 'secondary'}>
                          {owner.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => viewOwnerDetails(owner)}
                            data-testid={`button-view-${owner._id}`}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button
                            variant={owner.isActive ? 'destructive' : 'default'}
                            size="sm"
                            onClick={() => toggleOwnerStatus(owner._id, owner.isActive)}
                            data-testid={`button-toggle-${owner._id}`}
                          >
                            {owner.isActive ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOwner && (
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Détails du Propriétaire</DialogTitle>
              <DialogDescription>
                Informations et documents soumis par le propriétaire
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nom complet</label>
                  <p className="text-lg font-medium">
                    {selectedOwner.firstName} {selectedOwner.lastName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-lg">{selectedOwner.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Téléphone</label>
                  <p className="text-lg">{selectedOwner.phone || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Statut</label>
                  <div className="mt-1">{getStatusBadge(selectedOwner.hostStatus)}</div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold mb-3">Informations entreprise</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Nom de l'entreprise</label>
                    <p>{selectedOwner.companyName || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">SIRET</label>
                    <p>{selectedOwner.siret || '-'}</p>
                  </div>
                </div>
                {selectedOwner.businessDescription && (
                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-500">Description de l'activité</label>
                    <p className="mt-1 text-sm">{selectedOwner.businessDescription}</p>
                  </div>
                )}
              </div>

              {selectedOwner.businessDocuments && selectedOwner.businessDocuments.length > 0 && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Documents joints</h3>
                  <div className="space-y-2">
                    {selectedOwner.businessDocuments.map((doc, index) => (
                      <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span className="text-sm">Document {index + 1}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {selectedOwner.hostStatus === 'pending' && (
                <div className="border-t pt-4 flex gap-3">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={() => approveOwner(selectedOwner._id)}
                    data-testid="button-approve-owner"
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approuver
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => rejectOwner(selectedOwner._id)}
                    data-testid="button-reject-owner"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Rejeter
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

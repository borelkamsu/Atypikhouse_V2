'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Search, 
  UserCheck, 
  UserX, 
  Eye, 
  Building, 
  FileText, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Download,
  ExternalLink,
  Shield,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface Owner {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: 'owner';
  hostStatus: 'pending' | 'approved' | 'rejected';
  isActive: boolean;
  siret?: string;
  companyName?: string;
  businessDescription?: string;
  businessDocuments?: string[];
  createdAt: string;
  updatedAt: string;
  propertyCount: number;
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'approved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'pending':
      return <Badge variant="secondary">En attente</Badge>;
    case 'approved':
      return <Badge variant="default">Approuvé</Badge>;
    case 'rejected':
      return <Badge variant="destructive">Rejeté</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchOwners();
  }, [searchTerm, statusFilter]);

  const fetchOwners = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter !== 'all') params.append('status', statusFilter);

      const response = await fetch(`/api/admin/owners?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setOwners(data);
      } else if (response.status === 403) {
        toast({
          title: 'Accès refusé',
          description: 'Vous devez être administrateur pour accéder à cette page',
          variant: 'destructive',
        });
        router.push('/');
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Erreur lors du chargement des propriétaires',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (ownerId: string) => {
    try {
      const response = await fetch(`/api/admin/owners/${ownerId}/approve`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast({
          title: 'Propriétaire approuvé',
          description: 'Le propriétaire peut maintenant se connecter',
        });
        fetchOwners();
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible d\'approuver le propriétaire',
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

  const handleReject = async (ownerId: string) => {
    try {
      const response = await fetch(`/api/admin/owners/${ownerId}/reject`, {
        method: 'PUT',
      });

      if (response.ok) {
        toast({
          title: 'Propriétaire rejeté',
          description: 'La demande a été rejetée',
        });
        fetchOwners();
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de rejeter le propriétaire',
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

  const handleToggleStatus = async (ownerId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/owners/${ownerId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        toast({
          title: isActive ? 'Propriétaire activé' : 'Propriétaire désactivé',
          description: `Le propriétaire a été ${isActive ? 'activé' : 'désactivé'} avec succès`,
        });
        fetchOwners();
      } else {
        toast({
          title: 'Erreur',
          description: 'Impossible de modifier le statut',
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des propriétaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestion des Propriétaires</h1>
              <p className="text-gray-600 mt-2">
                Gérez les demandes d'inscription et les propriétaires
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-blue-600" />
              <span className="text-sm text-gray-600">Administrateur</span>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par nom, email ou entreprise..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="approved">Approuvés</SelectItem>
                    <SelectItem value="rejected">Rejetés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tableau des propriétaires */}
        <Card>
          <CardHeader>
            <CardTitle>Propriétaires ({owners.length})</CardTitle>
            <CardDescription>
              Liste de tous les propriétaires inscrits sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent>
            {owners.length === 0 ? (
              <div className="text-center py-12">
                <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Aucun propriétaire trouvé
                </h3>
                <p className="text-gray-600">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Aucun propriétaire ne correspond à vos critères de recherche.'
                    : 'Aucun propriétaire n\'est encore inscrit sur la plateforme.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Propriétaire</TableHead>
                      <TableHead>Entreprise</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Propriétés</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {owners.map((owner) => (
                      <TableRow key={owner._id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {owner.firstName} {owner.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {owner._id.slice(-8)}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{owner.companyName || 'N/A'}</div>
                            {owner.siret && (
                              <div className="text-sm text-gray-500">
                                SIRET: {owner.siret}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3" />
                              {owner.email}
                            </div>
                            {owner.phone && (
                              <div className="flex items-center gap-2 text-sm">
                                <Phone className="h-3 w-3" />
                                {owner.phone}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(owner.hostStatus)}
                            {getStatusBadge(owner.hostStatus)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            <span className="font-medium">{owner.propertyCount}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(owner.createdAt)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedOwner(owner)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Détails du propriétaire</DialogTitle>
                                  <DialogDescription>
                                    Informations complètes sur {owner.firstName} {owner.lastName}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedOwner && (
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium">Informations personnelles</h4>
                                        <p><strong>Nom:</strong> {selectedOwner.firstName} {selectedOwner.lastName}</p>
                                        <p><strong>Email:</strong> {selectedOwner.email}</p>
                                        <p><strong>Téléphone:</strong> {selectedOwner.phone || 'N/A'}</p>
                                      </div>
                                      <div>
                                        <h4 className="font-medium">Informations entreprise</h4>
                                        <p><strong>Entreprise:</strong> {selectedOwner.companyName || 'N/A'}</p>
                                        <p><strong>SIRET:</strong> {selectedOwner.siret || 'N/A'}</p>
                                        <p><strong>Statut:</strong> {selectedOwner.hostStatus}</p>
                                      </div>
                                    </div>
                                    {selectedOwner.businessDescription && (
                                      <div>
                                        <h4 className="font-medium">Description de l'activité</h4>
                                        <p className="text-sm text-gray-600">{selectedOwner.businessDescription}</p>
                                      </div>
                                    )}
                                    <div className="flex justify-between">
                                      <div>
                                        <p><strong>Inscription:</strong> {formatDate(selectedOwner.createdAt)}</p>
                                        <p><strong>Dernière mise à jour:</strong> {formatDate(selectedOwner.updatedAt)}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        {selectedOwner.isActive ? (
                                          <ToggleRight className="h-5 w-5 text-green-500" />
                                        ) : (
                                          <ToggleLeft className="h-5 w-5 text-gray-400" />
                                        )}
                                        <span className="text-sm">
                                          {selectedOwner.isActive ? 'Actif' : 'Inactif'}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>

                            {owner.hostStatus === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApprove(owner._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <UserCheck className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleReject(owner._id)}
                                >
                                  <UserX className="h-4 w-4" />
                                </Button>
                              </>
                            )}

                            {owner.hostStatus === 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleStatus(owner._id, !owner.isActive)}
                              >
                                {owner.isActive ? (
                                  <ToggleRight className="h-4 w-4" />
                                ) : (
                                  <ToggleLeft className="h-4 w-4" />
                                )}
                              </Button>
                            )}
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
      </div>
    </div>
  );
}

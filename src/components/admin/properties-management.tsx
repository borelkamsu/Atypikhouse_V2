'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Search, Eye, ToggleLeft, ToggleRight, Home, MapPin, Star, Users, Edit, Trash } from 'lucide-react';

interface Property {
  _id: string;
  name: string;
  description: string;
  type: string;
  price: number;
  location: string;
  address: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  ownerId: string;
  createdAt: string;
  featured: boolean;
  isActive?: boolean;
  images?: string[];
}

interface Owner {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export function PropertiesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
    fetchOwners();
  }, []);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/properties');
      const data = await response.json();
      setProperties(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des propriétés:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les propriétés",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOwners = async () => {
    try {
      const response = await fetch('/api/users?role=owner');
      const data = await response.json();
      setOwners(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des propriétaires:', error);
    }
  };

  const togglePropertyStatus = async (propertyId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}/toggle-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        toast({
          title: isActive ? "Propriété activée" : "Propriété désactivée",
          description: isActive ? "La propriété est maintenant visible" : "La propriété n'est plus visible",
        });
        fetchProperties();
      } else {
        throw new Error('Erreur lors du changement de statut');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut de la propriété",
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (propertyId: string, featured: boolean) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}/toggle-featured`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ featured }),
      });

      if (response.ok) {
        toast({
          title: featured ? "Propriété mise en avant" : "Propriété retirée de la mise en avant",
          description: featured ? "La propriété apparaît maintenant en vedette" : "La propriété n'apparaît plus en vedette",
        });
        fetchProperties();
      } else {
        throw new Error('Erreur lors du changement de statut vedette');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut de vedette",
        variant: "destructive",
      });
    }
  };

  const deleteProperty = async (propertyId: string) => {
    try {
      const response = await fetch(`/api/admin/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast({
          title: "Propriété supprimée",
          description: "La propriété a été supprimée avec succès",
        });
        fetchProperties();
      } else {
        throw new Error('Erreur lors de la suppression');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la propriété",
        variant: "destructive",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      treehouse: "Cabane dans les arbres",
      cabin: "Cabane",
      yurt: "Yourte",
      tent: "Tente de luxe",
      houseboat: "Maison flottante",
      cave: "Maison troglodyte",
      castle: "Château",
      farmhouse: "Ferme",
      villa: "Villa",
      apartment: "Appartement",
      other: "Autre"
    };
    return typeLabels[type] || type;
  };

  const getOwnerName = (ownerId: string) => {
    const owner = owners.find(o => o._id === ownerId);
    return owner ? `${owner.firstName} ${owner.lastName}` : 'Propriétaire inconnu';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR');
  };

  // Filtrage des propriétés
  const filteredProperties = properties.filter(property => {
    const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         getOwnerName(property.ownerId).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || property.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && property.isActive !== false) ||
                         (statusFilter === "inactive" && property.isActive === false) ||
                         (statusFilter === "featured" && property.featured);

    return matchesSearch && matchesType && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Chargement des propriétés...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <Card>
        <CardHeader>
          <CardTitle>Filtres et recherche</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, lieu ou propriétaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type d'hébergement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="treehouse">Cabane dans les arbres</SelectItem>
                <SelectItem value="cabin">Cabane</SelectItem>
                <SelectItem value="yurt">Yourte</SelectItem>
                <SelectItem value="tent">Tente de luxe</SelectItem>
                <SelectItem value="houseboat">Maison flottante</SelectItem>
                <SelectItem value="cave">Maison troglodyte</SelectItem>
                <SelectItem value="castle">Château</SelectItem>
                <SelectItem value="farmhouse">Ferme</SelectItem>
                <SelectItem value="villa">Villa</SelectItem>
                <SelectItem value="apartment">Appartement</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actives</SelectItem>
                <SelectItem value="inactive">Inactives</SelectItem>
                <SelectItem value="featured">En vedette</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{properties.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Total propriétés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {properties.filter(p => p.isActive !== false).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Actives</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">
              {properties.filter(p => p.featured).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">En vedette</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl">{owners.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Propriétaires</p>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des propriétés */}
      <Card>
        <CardHeader>
          <CardTitle>Propriétés ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Propriété</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Prix</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0]}
                              alt={property.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Home className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{property.name}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Users className="h-4 w-4 mr-1" />
                            {property.maxGuests} invités
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{getOwnerName(property.ownerId)}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTypeLabel(property.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatPrice(property.price)}/nuit</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {property.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        {property.featured && (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <Star className="h-3 w-3 mr-1" />
                            Vedette
                          </Badge>
                        )}
                        <Badge variant={property.isActive !== false ? "default" : "secondary"}>
                          {property.isActive !== false ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{formatDate(property.createdAt)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProperty(property)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{selectedProperty?.name}</DialogTitle>
                            </DialogHeader>
                            {selectedProperty && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="font-medium">Type</p>
                                    <p>{getTypeLabel(selectedProperty.type)}</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Prix</p>
                                    <p>{formatPrice(selectedProperty.price)}/nuit</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Capacité</p>
                                    <p>{selectedProperty.maxGuests} invités</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Chambres/SDB</p>
                                    <p>{selectedProperty.bedrooms} chambres, {selectedProperty.bathrooms} SDB</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">Description</p>
                                  <p className="text-sm text-gray-600">{selectedProperty.description}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Adresse</p>
                                  <p className="text-sm text-gray-600">{selectedProperty.address}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Propriétaire</p>
                                  <p className="text-sm text-gray-600">{getOwnerName(selectedProperty.ownerId)}</p>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePropertyStatus(property._id, !property.isActive)}
                        >
                          {property.isActive !== false ? (
                            <ToggleRight className="h-4 w-4 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleFeatured(property._id, !property.featured)}
                        >
                          <Star className={`h-4 w-4 ${property.featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteProperty(property._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredProperties.length === 0 && (
            <div className="text-center py-8">
              <Home className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-600">Aucune propriété trouvée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

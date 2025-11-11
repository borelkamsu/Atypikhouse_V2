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
import { Search, Eye, ToggleLeft, ToggleRight, Home, MapPin, Users } from 'lucide-react';

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  price: {
    perNight: number;
    currency: string;
  };
  location: {
    city: string;
    address: string;
    country: string;
  };
  capacity: {
    guests: number;
    bedrooms: number;
    bathrooms: number;
  };
  owner: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    companyName?: string;
  };
  isAvailable: boolean;
  createdAt: string;
  images?: Array<{ url: string; publicId: string }>;
}

export function PropertiesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchProperties();
  }, [typeFilter, statusFilter]);

  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      
      if (typeFilter !== 'all') {
        params.append('type', typeFilter);
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/properties?${params}`);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Non autorisé",
            description: "Vous devez être connecté en tant qu'administrateur",
            variant: "destructive",
          });
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Erreur lors du chargement des propriétés');
      }

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

  const togglePropertyStatus = async (propertyId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/properties`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ propertyId, isAvailable: !currentStatus }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          window.location.href = '/admin/login';
          return;
        }
        throw new Error('Erreur lors du changement de statut');
      }

      toast({
        title: !currentStatus ? "Propriété activée" : "Propriété désactivée",
        description: !currentStatus ? "La propriété est maintenant visible" : "La propriété n'est plus visible",
      });
      fetchProperties();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de changer le statut de la propriété",
        variant: "destructive",
      });
    }
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      cabin: "Cabane",
      yurt: "Yourte",
      floating: "Maison flottante",
      dome: "Dôme",
      caravan: "Caravane",
      igloo: "Igloo",
      other: "Autre"
    };
    return typeLabels[type] || type;
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

  // Filtrage des propriétés côté client pour le search term
  const filteredProperties = properties.filter(property => {
    if (!searchTerm) return true;
    
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         `${property.owner.firstName} ${property.owner.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleSearch = () => {
    fetchProperties();
  };

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom, lieu ou propriétaire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
                data-testid="input-search-properties"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger data-testid="select-type-filter">
                <SelectValue placeholder="Type d'hébergement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="cabin">Cabane</SelectItem>
                <SelectItem value="yurt">Yourte</SelectItem>
                <SelectItem value="floating">Maison flottante</SelectItem>
                <SelectItem value="dome">Dôme</SelectItem>
                <SelectItem value="caravan">Caravane</SelectItem>
                <SelectItem value="igloo">Igloo</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger data-testid="select-status-filter">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="available">Disponibles</SelectItem>
                <SelectItem value="unavailable">Non disponibles</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl" data-testid="stat-total">{properties.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Total propriétés</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl" data-testid="stat-available">
              {properties.filter(p => p.isAvailable).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Disponibles</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl" data-testid="stat-unavailable">
              {properties.filter(p => !p.isAvailable).length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Non disponibles</p>
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
                  <TableHead>Capacité</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créée le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProperties.map((property) => (
                  <TableRow key={property._id} data-testid={`row-property-${property._id}`}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          {property.images && property.images.length > 0 ? (
                            <img
                              src={property.images[0].url}
                              alt={property.title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Home className="h-6 w-6 text-gray-400" />
                          )}
                        </div>
                        <p className="font-medium">{property.title}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">
                          {property.owner.firstName} {property.owner.lastName}
                        </p>
                        {property.owner.companyName && (
                          <p className="text-xs text-gray-500">{property.owner.companyName}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTypeLabel(property.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{formatPrice(property.price.perNight)}/nuit</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {property.location.city}, {property.location.country}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-1 text-gray-400" />
                        {property.capacity.guests} invités
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={property.isAvailable ? "default" : "secondary"} data-testid={`badge-status-${property._id}`}>
                        {property.isAvailable ? "Disponible" : "Non disponible"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-gray-600">{formatDate(property.createdAt)}</p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProperty(property)} data-testid={`button-view-${property._id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{selectedProperty?.title}</DialogTitle>
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
                                    <p>{formatPrice(selectedProperty.price.perNight)}/nuit</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Capacité</p>
                                    <p>{selectedProperty.capacity.guests} invités</p>
                                  </div>
                                  <div>
                                    <p className="font-medium">Chambres/SDB</p>
                                    <p>{selectedProperty.capacity.bedrooms} chambres, {selectedProperty.capacity.bathrooms} SDB</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">Description</p>
                                  <p className="text-sm text-gray-600">{selectedProperty.description}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Adresse</p>
                                  <p className="text-sm text-gray-600">
                                    {selectedProperty.location.address}, {selectedProperty.location.city}, {selectedProperty.location.country}
                                  </p>
                                </div>
                                <div>
                                  <p className="font-medium">Propriétaire</p>
                                  <p className="text-sm text-gray-600">
                                    {selectedProperty.owner.firstName} {selectedProperty.owner.lastName}
                                  </p>
                                  {selectedProperty.owner.companyName && (
                                    <p className="text-sm text-gray-500">{selectedProperty.owner.companyName}</p>
                                  )}
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button
                          variant={property.isAvailable ? "destructive" : "default"}
                          size="sm"
                          onClick={() => togglePropertyStatus(property._id, property.isAvailable)}
                          data-testid={`button-toggle-${property._id}`}
                        >
                          {property.isAvailable ? (
                            <>
                              <ToggleRight className="h-4 w-4 mr-1" />
                              Désactiver
                            </>
                          ) : (
                            <>
                              <ToggleLeft className="h-4 w-4 mr-1" />
                              Activer
                            </>
                          )}
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

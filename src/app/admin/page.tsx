'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Home, Calendar, AlertTriangle, CheckCircle, XCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { PropertiesManagement } from "@/components/admin/properties-management";

interface DashboardStats {
  totalUsers: number;
  totalProperties: number;
  totalBookings: number;
  pendingOwners: number;
  activeProperties: number;
  inactiveProperties: number;
  confirmedBookings: number;
  pendingBookings: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProperties: 0,
    totalBookings: 0,
    pendingOwners: 0,
    activeProperties: 0,
    inactiveProperties: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Pour l'instant, on utilise des données simulées
      // Plus tard, on pourra créer une API /api/admin/dashboard/stats
      setStats({
        totalUsers: 150,
        totalProperties: 25,
        totalBookings: 180,
        pendingOwners: 5,
        activeProperties: 20,
        inactiveProperties: 5,
        confirmedBookings: 165,
        pendingBookings: 15,
      });
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Supprimer le token et rediriger
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Administration AtypikHouse
              </h1>
              <p className="text-gray-600">
                Interface d'administration
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* En-tête du dashboard */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Tableau de bord
          </h2>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de la plateforme AtypikHouse
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                +12% par rapport au mois dernier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
              <Home className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProperties}</div>
              <p className="text-xs text-muted-foreground">
                {stats.activeProperties} actives, {stats.inactiveProperties} inactives
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Réservations</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {stats.confirmedBookings} confirmées, {stats.pendingBookings} en attente
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propriétaires en attente</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingOwners}</div>
              <p className="text-xs text-muted-foreground">
                En attente de validation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Onglets de gestion */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="properties">Propriétés</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="owners">Propriétaires</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Propriétés récentes</CardTitle>
                  <CardDescription>
                    Les dernières propriétés ajoutées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Cabane dans les arbres</p>
                        <p className="text-sm text-gray-600">Ajoutée il y a 2 heures</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Yourte mongole</p>
                        <p className="text-sm text-gray-600">Ajoutée il y a 1 jour</p>
                      </div>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maison troglodyte</p>
                        <p className="text-sm text-gray-600">Ajoutée il y a 3 jours</p>
                      </div>
                      <Badge variant="outline">En attente</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Réservations récentes</CardTitle>
                  <CardDescription>
                    Les dernières réservations effectuées
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Réservation #1234</p>
                        <p className="text-sm text-gray-600">Cabane dans les arbres</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmée
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Réservation #1233</p>
                        <p className="text-sm text-gray-600">Yourte mongole</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        En attente
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Réservation #1232</p>
                        <p className="text-sm text-gray-600">Maison troglodyte</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3 mr-1" />
                        Annulée
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Utilisateurs</CardTitle>
                <CardDescription>
                  Gérez les comptes utilisateurs de la plateforme
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Interface de gestion des utilisateurs en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <PropertiesManagement />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Réservations</CardTitle>
                <CardDescription>
                  Gérez les réservations et leurs statuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Interface de gestion des réservations en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="owners" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des Propriétaires</CardTitle>
                <CardDescription>
                  Validez les demandes d'inscription des propriétaires
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Interface de gestion des propriétaires en cours de développement
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

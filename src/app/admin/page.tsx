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
import { UsersManagement } from "@/components/admin/users-management";
import { OwnersManagement } from "@/components/admin/owners-management";
import { BookingsManagement } from "@/components/admin/bookings-management";

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
      const response = await fetch('/api/admin/stats');
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          toast({
            title: "Non autorisé",
            description: "Vous devez être connecté en tant qu'administrateur",
            variant: "destructive",
          });
          // Rediriger vers la page de connexion admin
          setTimeout(() => {
            window.location.href = '/admin/login';
          }, 1000);
          return;
        }
        throw new Error('Erreur lors de la récupération des statistiques');
      }

      const data = await response.json();
      setStats(data);
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
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès",
    });
    window.location.href = '/admin/login';
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
            <Button variant="outline" onClick={handleLogout} data-testid="button-logout">
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
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            Chargement des statistiques...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-users">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Utilisateurs inscrits
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
                <Home className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-properties">{stats.totalProperties}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.activeProperties} actives, {stats.inactiveProperties} inactives
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-total-bookings">{stats.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.confirmedBookings} confirmées, {stats.pendingBookings} en attente
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Propriétaires en attente</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="stat-pending-owners">{stats.pendingOwners}</div>
                <p className="text-xs text-muted-foreground">
                  En attente de validation
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Onglets de gestion */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users" data-testid="tab-users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="owners" data-testid="tab-owners">Propriétaires</TabsTrigger>
            <TabsTrigger value="properties" data-testid="tab-properties">Propriétés</TabsTrigger>
            <TabsTrigger value="bookings" data-testid="tab-bookings">Réservations</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bienvenue</CardTitle>
                  <CardDescription>
                    Panneau d'administration AtypikHouse
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Utilisez les onglets ci-dessus pour gérer :
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                      <li><strong>Utilisateurs</strong> : Gérer les comptes utilisateurs</li>
                      <li><strong>Propriétaires</strong> : Valider les demandes d'inscription, approuver/rejeter, activer/désactiver</li>
                      <li><strong>Propriétés</strong> : Gérer les logements, activer/désactiver</li>
                      <li><strong>Réservations</strong> : Suivre et gérer les réservations</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                  <CardDescription>
                    Tâches importantes nécessitant votre attention
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats.pendingOwners > 0 && (
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-medium text-yellow-900">
                              {stats.pendingOwners} propriétaire(s) en attente
                            </p>
                            <p className="text-sm text-yellow-700">
                              Demandes d'inscription à valider
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {stats.pendingBookings > 0 && (
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">
                              {stats.pendingBookings} réservation(s) en attente
                            </p>
                            <p className="text-sm text-blue-700">
                              À confirmer ou annuler
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    {stats.pendingOwners === 0 && stats.pendingBookings === 0 && (
                      <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <p className="text-green-900">
                          Aucune action en attente
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersManagement />
          </TabsContent>

          <TabsContent value="owners" className="space-y-6">
            <OwnersManagement />
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <PropertiesManagement />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

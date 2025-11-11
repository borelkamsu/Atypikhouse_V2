"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, Home, Users, Star, TrendingUp, Settings } from 'lucide-react'

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: 'user' | 'owner' | 'admin'
  avatar?: string
  isVerified: boolean
  isActive: boolean
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        } else {
          router.push('/auth')
        }
      } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error)
        router.push('/auth')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getDashboardContent = () => {
    switch (user.role) {
      case 'admin':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+2350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Propriétés</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+€45,231</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Vue d'ensemble</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    Graphique des statistiques à venir
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Activité récente</CardTitle>
                  <CardDescription>
                    Les dernières actions sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Nouveau propriétaire</p>
                        <p className="text-sm text-muted-foreground">
                          Jean Dupont a rejoint la plateforme
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/avatars/02.png" />
                        <AvatarFallback>MM</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Nouvelle réservation</p>
                        <p className="text-sm text-muted-foreground">
                          Marie Martin a réservé une cabane
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      case 'owner':
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mes Propriétés</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">
                    3 nouvelles cette semaine
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+24</div>
                  <p className="text-xs text-muted-foreground">
                    +4 ce mois-ci
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Note moyenne</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4.8</div>
                  <p className="text-xs text-muted-foreground">
                    +0.2 par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€2,350</div>
                  <p className="text-xs text-muted-foreground">
                    +180.1% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Mes propriétés</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Cabane dans les arbres</h3>
                        <p className="text-sm text-muted-foreground">Fontainebleau</p>
                      </div>
                      <Badge variant="secondary">Disponible</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Yourte nomade</h3>
                        <p className="text-sm text-muted-foreground">Chamonix</p>
                      </div>
                      <Badge variant="outline">Occupée</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Réservations récentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src="/avatars/01.png" />
                        <AvatarFallback>MM</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Marie Martin</p>
                        <p className="text-sm text-muted-foreground">
                          Cabane - 15-20 déc
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mes Réservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12</div>
                  <p className="text-xs text-muted-foreground">
                    +2 ce mois-ci
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Favoris</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+573</div>
                  <p className="text-xs text-muted-foreground">
                    +201 depuis le mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avis donnés</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+24</div>
                  <p className="text-xs text-muted-foreground">
                    +4 ce mois-ci
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Dépenses</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€1,234</div>
                  <p className="text-xs text-muted-foreground">
                    +19% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Mes réservations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Cabane dans les arbres</h3>
                        <p className="text-sm text-muted-foreground">15-20 décembre 2024</p>
                      </div>
                      <Badge variant="secondary">Confirmée</Badge>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">Yourte nomade</h3>
                        <p className="text-sm text-muted-foreground">10-15 janvier 2025</p>
                      </div>
                      <Badge variant="outline">En attente</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Actions rapides</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" onClick={() => router.push('/properties')}>
                    <Home className="mr-2 h-4 w-4" />
                    Voir les propriétés
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => router.push('/favorites')}>
                    <Star className="mr-2 h-4 w-4" />
                    Mes favoris
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => router.push('/host/register')}>
                    <Users className="mr-2 h-4 w-4" />
                    Devenir hôte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Tableau de bord
        </h2>
        <div className="flex items-center space-x-2">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
            <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'owner' ? 'secondary' : 'outline'}>
              {user.role === 'admin' ? 'Administrateur' : user.role === 'owner' ? 'Propriétaire' : 'Utilisateur'}
            </Badge>
          </div>
        </div>
      </div>
      {getDashboardContent()}
    </div>
  )
}



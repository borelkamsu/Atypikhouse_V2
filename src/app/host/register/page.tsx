"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useToast } from '@/hooks/use-toast'
import { Building2, FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function HostRegistrationPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    siret: '',
    companyName: '',
    businessDescription: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/hosts/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Demande envoyée !",
          description: "Votre demande d'inscription en tant qu'hôte a été enregistrée. Nous vous contacterons bientôt.",
        })
        router.push('/dashboard')
      } else {
        const error = await response.json()
        toast({
          title: "Erreur",
          description: error.message || "Une erreur s'est produite",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error)
      toast({
        title: "Erreur",
        description: "Impossible de traiter votre demande",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const requirements = [
    "Être majeur et résider en France",
    "Avoir un numéro SIRET valide",
    "Disposer d'un logement atypique à louer",
    "Respecter les normes de sécurité en vigueur",
    "Être disponible pour la gestion des réservations"
  ]

  const benefits = [
    "Revenus complémentaires attractifs",
    "Gestion simplifiée des réservations",
    "Support client dédié",
    "Assurance responsabilité civile incluse",
    "Formation et accompagnement personnalisé"
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <Building2 className="mx-auto h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-bold mb-2">Devenez Hôte AtypikHouse</h1>
        <p className="text-muted-foreground text-lg">
          Rejoignez notre communauté d'hôtes et partagez votre logement atypique avec des voyageurs du monde entier
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Formulaire d'inscription */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Formulaire d'inscription
            </CardTitle>
            <CardDescription>
              Remplissez ce formulaire pour commencer votre aventure d'hôte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    minLength={2}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    minLength={2}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength={6}
                />
              </div>

              <div>
                <Label htmlFor="phone">Téléphone *</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  minLength={10}
                />
              </div>

              <div>
                <Label htmlFor="siret">Numéro SIRET *</Label>
                <Input
                  id="siret"
                  name="siret"
                  value={formData.siret}
                  onChange={handleInputChange}
                  required
                  minLength={14}
                  maxLength={14}
                  placeholder="12345678901234"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Le numéro SIRET doit contenir exactement 14 chiffres
                </p>
              </div>

              <div>
                <Label htmlFor="companyName">Nom de l'entreprise *</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                  minLength={2}
                />
              </div>

              <div>
                <Label htmlFor="businessDescription">Description de votre activité</Label>
                <Textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleInputChange}
                  placeholder="Décrivez brièvement votre activité et le type de logement que vous proposez..."
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Envoi en cours..." : "Envoyer ma demande"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Informations et avantages */}
        <div className="space-y-6">
          {/* Prérequis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                Prérequis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {requirements.map((requirement, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{requirement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Avantages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
                Avantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Processus */}
          <Card>
            <CardHeader>
              <CardTitle>Processus d'inscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">1</Badge>
                  <div>
                    <p className="font-medium">Soumission du formulaire</p>
                    <p className="text-sm text-muted-foreground">Envoyez votre demande d'inscription</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">2</Badge>
                  <div>
                    <p className="font-medium">Vérification</p>
                    <p className="text-sm text-muted-foreground">Nous vérifions vos informations</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">3</Badge>
                  <div>
                    <p className="font-medium">Validation</p>
                    <p className="text-sm text-muted-foreground">Approbation de votre compte hôte</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant="secondary">4</Badge>
                  <div>
                    <p className="font-medium">Mise en ligne</p>
                    <p className="text-sm text-muted-foreground">Publication de votre propriété</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Questions fréquentes
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Questions fréquentes</DialogTitle>
                <DialogDescription>
                  Retrouvez les réponses aux questions les plus courantes
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold">Combien de temps dure la validation ?</h4>
                  <p className="text-sm text-muted-foreground">
                    La validation prend généralement 2-3 jours ouvrables après réception de votre dossier complet.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Quels sont les frais ?</h4>
                  <p className="text-sm text-muted-foreground">
                    Aucun frais d'inscription. Nous prenons une commission de 15% sur chaque réservation.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold">Puis-je annuler ma demande ?</h4>
                  <p className="text-sm text-muted-foreground">
                    Oui, vous pouvez annuler votre demande à tout moment en nous contactant.
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}



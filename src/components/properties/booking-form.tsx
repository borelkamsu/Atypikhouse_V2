'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar, Users } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface BookingFormProps {
  propertyId: string
  pricePerNight: number
}

export default function BookingForm({ propertyId, pricePerNight }: BookingFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [bookingData, setBookingData] = useState({
    startDate: '',
    endDate: '',
    guests: 1
  })

  const calculateNights = () => {
    if (!bookingData.startDate || !bookingData.endDate) return 0
    const start = new Date(bookingData.startDate)
    const end = new Date(bookingData.endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const nights = calculateNights()
  const totalPrice = nights * pricePerNight

  const handleBooking = async () => {
    if (!bookingData.startDate || !bookingData.endDate) {
      toast({
        title: 'Dates requises',
        description: 'Veuillez sélectionner les dates d\'arrivée et de départ',
        variant: 'destructive'
      })
      return
    }

    if (new Date(bookingData.endDate) <= new Date(bookingData.startDate)) {
      toast({
        title: 'Dates invalides',
        description: 'La date de départ doit être après la date d\'arrivée',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          startDate: new Date(bookingData.startDate).toISOString(),
          endDate: new Date(bookingData.endDate).toISOString(),
          guests: bookingData.guests
        })
      })

      if (response.status === 401) {
        toast({
          title: 'Connexion requise',
          description: 'Veuillez vous connecter pour réserver',
          variant: 'destructive'
        })
        router.push('/login')
        return
      }

      if (!response.ok) {
        const error = await response.json()
        toast({
          title: 'Erreur de réservation',
          description: error.message || 'Une erreur est survenue',
          variant: 'destructive'
        })
        return
      }

      toast({
        title: 'Réservation confirmée',
        description: 'Votre réservation a été enregistrée avec succès'
      })

      router.push('/bookings')
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors de la réservation',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-primary">€{pricePerNight}</span>
          <span className="text-gray-600">/nuit</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="checkin">Date d'arrivée</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="checkin"
              type="date"
              className="pl-10"
              value={bookingData.startDate}
              onChange={(e) => setBookingData({ ...bookingData, startDate: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              data-testid="input-checkin"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="checkout">Date de départ</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="checkout"
              type="date"
              className="pl-10"
              value={bookingData.endDate}
              onChange={(e) => setBookingData({ ...bookingData, endDate: e.target.value })}
              min={bookingData.startDate || new Date().toISOString().split('T')[0]}
              data-testid="input-checkout"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="guests">Nombre de voyageurs</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              id="guests"
              type="number"
              min="1"
              className="pl-10"
              value={bookingData.guests}
              onChange={(e) => setBookingData({ ...bookingData, guests: parseInt(e.target.value) })}
              data-testid="input-guests"
            />
          </div>
        </div>

        {nights > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-600">€{pricePerNight} x {nights} nuit{nights > 1 ? 's' : ''}</span>
              <span className="font-semibold" data-testid="text-subtotal">€{totalPrice}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Total</span>
              <span data-testid="text-total">€{totalPrice}</span>
            </div>
          </div>
        )}

        <Button 
          className="w-full bg-primary text-white"
          onClick={handleBooking}
          disabled={isLoading}
          data-testid="button-book"
        >
          {isLoading ? 'Réservation...' : 'Réserver maintenant'}
        </Button>

        <p className="text-sm text-gray-500 text-center">
          Vous ne serez pas débité pour le moment
        </p>
      </CardContent>
    </Card>
  )
}

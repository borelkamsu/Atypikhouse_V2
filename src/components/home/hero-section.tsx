'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Calendar, Users } from 'lucide-react'

export default function HeroSection() {
  const router = useRouter()
  const [searchLocation, setSearchLocation] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const [guests, setGuests] = useState(2)
  const [checkInDate, setCheckInDate] = useState('')
  const [checkOutDate, setCheckOutDate] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    
    if (searchLocation) params.append('location', searchLocation)
    if (propertyType && propertyType !== 'all') params.append('type', propertyType)
    if (checkInDate) params.append('checkIn', checkInDate)
    if (checkOutDate) params.append('checkOut', checkOutDate)
    params.append('guests', guests.toString())
    
    router.push(`/properties?${params.toString()}`)
  }

  return (
    <section className="relative bg-gray-800 text-white">
      <div 
        className="absolute inset-0 bg-cover bg-center" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')", 
          filter: "brightness(0.6)" 
        }}
      />
      <div className="relative container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="font-playfair font-bold text-4xl md:text-5xl mb-4">Des habitations insolites pour des séjours inoubliables</h1>
          <p className="text-lg md:text-xl mb-8">Découvrez nos cabanes dans les arbres, yourtes et habitations flottantes en harmonie avec la nature.</p>
          
          <form onSubmit={handleSearch} className="bg-white p-4 sm:p-6 rounded-lg shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="where" className="block text-gray-800 font-medium mb-2">Où</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <Input 
                    id="where" 
                    type="text" 
                    className="pl-10 bg-white text-gray-800 border-2 focus:border-primary"
                    placeholder="Destination" 
                    value={searchLocation} 
                    onChange={(e) => setSearchLocation(e.target.value)} 
                    aria-label="Destination"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="property-type" className="block text-gray-800 font-medium mb-2">Type d'hébergement</Label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger 
                    id="property-type"
                    className="w-full bg-white text-gray-800 border-2 focus:border-primary"
                  >
                    <SelectValue placeholder="Tous types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="cabin">Cabane dans les arbres</SelectItem>
                    <SelectItem value="yurt">Yourte</SelectItem>
                    <SelectItem value="floating">Cabane flottante</SelectItem>
                    <SelectItem value="dome">Dôme</SelectItem>
                    <SelectItem value="caravan">Caravane</SelectItem>
                    <SelectItem value="igloo">Igloo</SelectItem>
                    <SelectItem value="other">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="checkin" className="block text-gray-800 font-medium mb-2">Arrivée</Label>
                <Input
                  id="checkin"
                  type="date"
                  className="bg-white text-gray-800 border-2 focus:border-primary"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  aria-label="Sélectionner une date d'arrivée"
                />
              </div>
              
              <div>
                <Label htmlFor="checkout" className="block text-gray-800 font-medium mb-2">Départ</Label>
                <Input
                  id="checkout"
                  type="date"
                  className="bg-white text-gray-800 border-2 focus:border-primary"
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  aria-label="Sélectionner une date de départ"
                />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Label htmlFor="guests" className="text-gray-800 font-medium">Voyageurs:</Label>
                <div className="flex items-center">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    className="bg-white text-gray-800 border-2 hover:bg-gray-100"
                    onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                    aria-label="Réduire le nombre de voyageurs"
                  >
                    -
                  </Button>
                  <span className="mx-3 text-gray-800 font-medium">{guests}</span>
                  <Button 
                    type="button"
                    variant="outline" 
                    size="icon"
                    className="bg-white text-gray-800 border-2 hover:bg-gray-100"
                    onClick={() => setGuests(prev => Math.min(10, prev + 1))}
                    aria-label="Augmenter le nombre de voyageurs"
                  >
                    +
                  </Button>
                </div>
              </div>
              
              <Button type="submit" className="w-1/3 md:w-1/4">
                <Search className="mr-2 h-4 w-4" /> Rechercher
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
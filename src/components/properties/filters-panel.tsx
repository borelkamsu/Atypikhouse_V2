'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'

interface FiltersPanelProps {
  initialSearch?: string
  initialType?: string
  initialCity?: string
  initialMinPrice?: string
  initialMaxPrice?: string
}

export default function FiltersPanel({
  initialSearch = '',
  initialType = '',
  initialCity = '',
  initialMinPrice = '',
  initialMaxPrice = ''
}: FiltersPanelProps) {
  const router = useRouter()
  
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const [selectedType, setSelectedType] = useState(initialType || 'all')
  const [selectedCity, setSelectedCity] = useState(initialCity)
  const [minPrice, setMinPrice] = useState(initialMinPrice)
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice)

  const propertyTypes = [
    { value: 'all', label: 'Tous types' },
    { value: 'cabin', label: 'Cabane' },
    { value: 'yurt', label: 'Yourte' },
    { value: 'floating', label: 'Logement flottant' },
    { value: 'dome', label: 'Dôme' },
    { value: 'caravan', label: 'Caravane' },
    { value: 'igloo', label: 'Igloo' },
    { value: 'other', label: 'Autre' }
  ]

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (searchTerm) params.append('search', searchTerm)
    if (selectedType && selectedType !== 'all') params.append('type', selectedType)
    if (selectedCity) params.append('city', selectedCity)
    if (minPrice) params.append('minPrice', minPrice)
    if (maxPrice) params.append('maxPrice', maxPrice)

    router.push(`/properties?${params.toString()}`)
  }

  const handleReset = () => {
    setSearchTerm('')
    setSelectedType('all')
    setSelectedCity('')
    setMinPrice('')
    setMaxPrice('')
    router.push('/properties')
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type
          </label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger data-testid="select-type">
              <SelectValue placeholder="Tous types" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ville
          </label>
          <Input
            placeholder="Ville..."
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            data-testid="input-city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix min
          </label>
          <Input
            type="number"
            placeholder="Min €"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            data-testid="input-min-price"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prix max
          </label>
          <Input
            type="number"
            placeholder="Max €"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            data-testid="input-max-price"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <Button 
          onClick={handleSearch}
          className="flex-1 bg-primary text-white"
          data-testid="button-search"
        >
          <Filter className="h-4 w-4 mr-2" />
          Rechercher
        </Button>
        <Button 
          variant="outline"
          onClick={handleReset}
          data-testid="button-reset"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { Search, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SearchForm() {
  const [guests, setGuests] = useState(2)

  const handleSearch = () => {
    // TODO: Implémenter la recherche
    console.log('Recherche...')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto" data-testid="form-search">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
        {/* Où */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Où
          </label>
          <Input
            type="text"
            placeholder="Destination"
            className="w-full text-gray-900"
            data-testid="input-destination"
          />
        </div>

        {/* Type d'hébergement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type d'hébergement
          </label>
          <Select defaultValue="all">
            <SelectTrigger className="w-full text-gray-900" data-testid="select-type">
              <SelectValue placeholder="Tous types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              <SelectItem value="cabin">Cabanes</SelectItem>
              <SelectItem value="yurt">Yourtes</SelectItem>
              <SelectItem value="floating">Flottantes</SelectItem>
              <SelectItem value="dome">Dômes</SelectItem>
              <SelectItem value="tiny">Tiny houses</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Arrivée */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arrivée
          </label>
          <Input
            type="date"
            defaultValue="2025-11-16"
            className="w-full text-gray-900"
            data-testid="input-arrival"
          />
        </div>

        {/* Départ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Départ
          </label>
          <Input
            type="date"
            defaultValue="2025-11-17"
            className="w-full text-gray-900"
            data-testid="input-departure"
          />
        </div>
      </div>

      {/* Voyageurs + Bouton Rechercher */}
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="w-full md:w-auto">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Voyageurs:
          </label>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setGuests(Math.max(1, guests - 1))}
              className="h-10 w-10"
              data-testid="button-decrease-guests"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium w-8 text-center text-gray-900" data-testid="text-guests-count">
              {guests}
            </span>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setGuests(guests + 1)}
              className="h-10 w-10"
              data-testid="button-increase-guests"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          className="w-full md:w-auto bg-[#16A433] hover:bg-[#138a2c] text-white px-8 py-6 text-lg"
          data-testid="button-search"
        >
          <Search className="mr-2 h-5 w-5" />
          Rechercher
        </Button>
      </div>
    </div>
  )
}

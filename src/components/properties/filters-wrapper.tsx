'use client'

import dynamic from 'next/dynamic'

// Dynamic import dans un Client Component pour éviter les problèmes d'hydratation
const FiltersPanel = dynamic(() => import('./filters-panel'), {
  ssr: false,
  loading: () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
})

interface FiltersWrapperProps {
  initialSearch?: string
  initialType?: string
  initialCity?: string
  initialMinPrice?: string
  initialMaxPrice?: string
}

export default function FiltersWrapper(props: FiltersWrapperProps) {
  return <FiltersPanel {...props} />
}

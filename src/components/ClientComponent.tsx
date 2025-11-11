'use client'

import { useState, useEffect } from 'react'

export default function ClientComponent() {
  const [data, setData] = useState<{
    message: string
    timestamp: string
    clientInfo: string
  } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulation d'une requête API côté client
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setData({
        message: "Données rendues côté client !",
        timestamp: new Date().toISOString(),
        clientInfo: "React Hydration"
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 animate-pulse">
        <div className="h-4 bg-blue-200 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-blue-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-blue-800 font-semibold mb-2">Composant Client</h3>
      <p className="text-blue-700 mb-2">{data?.message}</p>
      <p className="text-sm text-blue-600">Timestamp: {data?.timestamp}</p>
      <p className="text-sm text-blue-600">Client: {data?.clientInfo}</p>
    </div>
  )
}


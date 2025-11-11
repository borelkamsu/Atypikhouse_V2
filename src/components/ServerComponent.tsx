import { Suspense } from 'react'

// Composant serveur qui s'exécute côté serveur
async function ServerData() {
  // Simulation d'une requête API côté serveur
  const data = await new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: "Données rendues côté serveur !",
        timestamp: new Date().toISOString(),
        serverInfo: "Next.js SSR"
      })
    }, 100)
  })

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
      <h3 className="text-green-800 font-semibold mb-2">Composant Serveur</h3>
      <p className="text-green-700 mb-2">{data.message}</p>
      <p className="text-sm text-green-600">Timestamp: {data.timestamp}</p>
      <p className="text-sm text-green-600">Serveur: {data.serverInfo}</p>
    </div>
  )
}

// Composant de chargement
function Loading() {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
    </div>
  )
}

export default function ServerComponent() {
  return (
    <Suspense fallback={<Loading />}>
      <ServerData />
    </Suspense>
  )
}


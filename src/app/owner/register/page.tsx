'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function OwnerRegisterRedirect() {
  const router = useRouter()

  useEffect(() => {
    // Rediriger vers /host/register
    router.replace('/host/register')
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-600">Redirection en cours...</p>
    </div>
  )
}



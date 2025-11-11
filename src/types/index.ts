// Types pour les données du serveur
export interface ServerData {
  message: string
  timestamp: string
  serverInfo: string
}

// Types pour les données du client
export interface ClientData {
  message: string
  timestamp: string
  clientInfo: string
}

// Types pour les props des composants
export interface ComponentProps {
  className?: string
  children?: React.ReactNode
}

// Types pour les métadonnées de page
export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
}

// Types pour les configurations
export interface AppConfig {
  name: string
  version: string
  environment: 'development' | 'production' | 'test'
}


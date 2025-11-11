import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Combine les classes CSS avec clsx et tailwind-merge
 * Utile pour fusionner les classes Tailwind de manière optimale
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formate une date en format lisible
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

/**
 * Simule un délai (utile pour les démonstrations)
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Génère un ID unique
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

/**
 * Vérifie si l'environnement est en développement
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development'
}

/**
 * Vérifie si l'environnement est en production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}


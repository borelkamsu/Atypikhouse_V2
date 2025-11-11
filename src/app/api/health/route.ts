import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';

export async function GET() {
  try {
    // Tester la connexion à la base de données
    await dbConnect();
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'AtypikHouse SSR',
      version: '1.0.0',
      database: 'connected'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'AtypikHouse SSR',
      version: '1.0.0',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}



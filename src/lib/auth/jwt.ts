import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET || 'atypikhouse-secret-key';

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // Token valide pendant 7 jours
  });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  return null;
}

export function getTokenFromCookie(req: NextRequest): string | null {
  const token = req.cookies.get('token')?.value;
  return token || null;
}



// Helper function to verify token from NextRequest
export function verifyTokenFromRequest(req: NextRequest): JWTPayload | null {
  // Try to get token from cookie first
  let token = getTokenFromCookie(req);
  
  // If no cookie token, try Authorization header
  if (!token) {
    token = getTokenFromRequest(req);
  }
  
  if (!token) {
    return null;
  }
  
  return verifyToken(token);
}

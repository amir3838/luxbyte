// Vercel Middleware for Security and Rate Limiting
// This file should be placed in the root directory for Vercel to detect it

import { NextResponse } from 'next/server';

// Rate limiting storage (in-memory for simplicity)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // 100 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  if (!rateLimit.has(ip)) {
    rateLimit.set(ip, []);
  }

  const requests = rateLimit.get(ip);
  const recentRequests = requests.filter(time => time > windowStart);

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (cfConnectingIP) return cfConnectingIP;
  if (realIP) return realIP;
  if (forwarded) return forwarded.split(',')[0].trim();

  return 'unknown';
}

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const clientIP = getClientIP(request);
  const origin = request.headers.get('origin') || '';
  const userAgent = request.headers.get('user-agent') || '';

  // Log request
  console.log(`[${new Date().toISOString()}] ${request.method} ${pathname} - IP: ${clientIP} - UA: ${userAgent.substring(0, 100)}`);

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(clientIP)) {
      console.warn(`Rate limit exceeded for IP ${clientIP} on ${pathname}`);
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: {
          'Retry-After': '60',
          'X-RateLimit-Limit': RATE_LIMIT_MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': '0'
        }
      });
    }

    // CORS protection for API routes
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['*'];
    const isAllowedOrigin = allowedOrigins.includes('*') ||
      allowedOrigins.some(allowed => origin.endsWith(allowed));

    if (origin && !isAllowedOrigin) {
      console.warn(`Blocked request from unauthorized origin: ${origin}`);
      return new NextResponse('Forbidden', {
        status: 403,
        headers: {
          'Access-Control-Allow-Origin': 'null'
        }
      });
    }

    // Security headers for API routes
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS.toString());

    return response;
  }

  // Security headers for all routes
  const response = NextResponse.next();

  // Basic security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://unpkg.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://*.supabase.co https://*.vercel.app wss://*.supabase.co",
    "frame-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);

  // Permissions Policy for camera and microphone
  response.headers.set('Permissions-Policy', 'camera=(self), microphone=(self), geolocation=(self)');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};

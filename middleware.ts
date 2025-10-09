import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Verificar se está tentando acessar rotas protegidas
  const protectedRoutes = ['/dashboard', '/appointments']
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute) {
    // Verificar se há token no cookie
    const token = request.cookies.get('auth-token')
    
    if (!token) {
      // Redirecionar para login se não estiver autenticado
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/appointments/:path*'],
}

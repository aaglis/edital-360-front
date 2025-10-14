import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect'},
  { path: '/cadastro', whenAuthenticated: 'redirect'},
  { path: '/finalizar-cadastro', whenAuthenticated: 'redirect'},
  { path: '/recuperar-senha', whenAuthenticated: 'next'},
  { path: '/concursos', whenAuthenticated: 'next'},
  { path: '/cadastrar-edital', whenAuthenticated: 'next'},
  { path: '/', whenAuthenticated: 'next' },
] as const;

// Rotas dinâmicas públicas (usando regex)
const publicDynamicRoutes = [
  /^\/edital\/[^\/]+$/, // Corresponde a /edital/[qualquer-id]
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const isDynamicPublicRoute = publicDynamicRoutes.some(pattern => pattern.test(path));
  const authToken = request.cookies.get('token');

  // Se não tem token e é rota pública (estática ou dinâmica), permitir acesso
  if (!authToken && (publicRoute || isDynamicPublicRoute)) {
    return NextResponse.next();
  }

  // Se não tem token e não é rota pública, redirecionar para login
  if (!authToken && !publicRoute && !isDynamicPublicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
    return NextResponse.redirect(redirectUrl);
  }

  // Se tem token e é rota pública com redirecionamento, redirecionar para home
  if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/';
    return NextResponse.redirect(redirectUrl);
  }

  // Se tem token e não é rota pública (ou é rota dinâmica pública), verificar validade do token
  if (authToken && (!publicRoute || isDynamicPublicRoute)) {
    const token = request.cookies.get('token')?.value;
    if (token) {
      const decodedToken = jwtDecode<{ exp: number }>(token);
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decodedToken.exp < currentTime) {
        console.log('Token expired, redirecting to login');
        const redirectUrl = request.nextUrl.clone();
        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;
        return NextResponse.redirect(redirectUrl);
      }
    }
  }


  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

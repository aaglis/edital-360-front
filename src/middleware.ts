import { NextResponse, type MiddlewareConfig, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

const publicRoutes = [
  { path: '/login', whenAuthenticated: 'redirect'},
  { path: '/cadastro', whenAuthenticated: 'redirect'},
  { path: '/finalizar-cadastro', whenAuthenticated: 'redirect'},
  { path: '/recuperar-senha', whenAuthenticated: 'next'},
  { path: '/concursos', whenAuthenticated: 'next'},
  { path: '/', whenAuthenticated: 'next' },
] as const;

const REDIRECT_WHEN_NOT_AUTHENTICATED = '/login';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find(route => route.path === path);
  const authToken = request.cookies.get('token');


  if (!authToken && publicRoute) {
    return NextResponse.next();
  }

  if (!authToken && !publicRoute) {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED;

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect') {
    const redirectUrl = request.nextUrl.clone();

    redirectUrl.pathname = '/';

    return NextResponse.redirect(redirectUrl);
  }

  if (authToken && !publicRoute) {
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

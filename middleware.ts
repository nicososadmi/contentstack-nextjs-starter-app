import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;
  const locales = ['en', 'fr'];

  if (pathname === '/') {
    url.pathname = '/en';
    return NextResponse.redirect(url);
  }

  const locale = locales.find((loc) => pathname.startsWith(`/${loc}/`)) || 'en';

  if (locale) {
    
    const newPathname = pathname.replace(`/${locale}`, '');
    url.pathname = newPathname || '/';
    url.searchParams.set('locale', locale);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

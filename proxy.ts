import { NextRequest, NextResponse } from 'next/server';
import { parseSetCookie } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
const { pathname } = request.nextUrl;

const accessToken = request.cookies.get('accessToken')?.value;
const refreshToken = request.cookies.get('refreshToken')?.value;

const isPublicRoute = publicRoutes.some((route) =>
pathname.startsWith(route),
);

const isPrivateRoute = privateRoutes.some((route) =>
pathname.startsWith(route),
);

if (!accessToken && refreshToken) {
try {
const data = await checkServerSession();
const setCookie = data.headers['set-cookie'];

if (setCookie) {
const response = isPublicRoute
? NextResponse.redirect(new URL('/', request.url))
: NextResponse.next();

const cookieArray = Array.isArray(setCookie)
? setCookie
: [setCookie];

for (const cookieStr of cookieArray) {
const parsed = parseSetCookie(cookieStr);

if (parsed) {
response.cookies.set({
name: parsed.name,
value: parsed.value,
expires: parsed.expires,
path: parsed.path ?? '/',
maxAge: parsed.maxAge,
httpOnly: parsed.httpOnly,
secure: parsed.secure,
sameSite: parsed.sameSite,
});
}
}

return response;
}
} catch {
// Якщо оновити сесію не вдалося, користувач залишиться неавторизованим.
}
}

if (!accessToken) {
if (isPrivateRoute) {
return NextResponse.redirect(new URL('/sign-in', request.url));
}

return NextResponse.next();
}

if (isPublicRoute) {
return NextResponse.redirect(new URL('/', request.url));
}

return NextResponse.next();
}

export const config = {
matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'],
};


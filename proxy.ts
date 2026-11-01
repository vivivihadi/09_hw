import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parseSetCookie } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
const { pathname } = request.nextUrl;

// Отримуємо cookies через next/headers
const cookieStore = await cookies().catch(() => null);

let accessToken =
cookieStore?.get('accessToken')?.value ??
request.cookies.get('accessToken')?.value;

const refreshToken =
cookieStore?.get('refreshToken')?.value ??
request.cookies.get('refreshToken')?.value;

const isPublicRoute = publicRoutes.some((route) =>
pathname.startsWith(route),
);

const isPrivateRoute = privateRoutes.some((route) =>
pathname.startsWith(route),
);

let newCookies: ReturnType<typeof parseSetCookie>[] = [];

if (!accessToken && refreshToken) {
try {
const data = await checkServerSession(
request.headers.get('cookie') ?? '',
);

const setCookie = data.headers['set-cookie'];

if (setCookie) {
const cookieArray = Array.isArray(setCookie)
? setCookie
: [setCookie];

newCookies = cookieArray.map((cookie) =>
parseSetCookie(cookie),
);

const newAccessCookie = newCookies.find(
(cookie) => cookie.name === 'accessToken',
);

if (newAccessCookie?.value) {
accessToken = newAccessCookie.value;
}
}
} catch {
// Якщо оновити сесію не вдалося,
// користувач залишається неавторизованим.
}
}

let response: NextResponse;

if (!accessToken && isPrivateRoute) {
response = NextResponse.redirect(
new URL('/sign-in', request.url),
);
} else if (accessToken && isPublicRoute) {
response = NextResponse.redirect(new URL('/', request.url));
} else {
response = NextResponse.next();
}

for (const parsed of newCookies) {
if (parsed.name && parsed.value !== undefined) {
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

export const config = {
matcher: [
'/profile/:path*',
'/sign-in',
'/sign-up',
'/notes/:path*',
],
};

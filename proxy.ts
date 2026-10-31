import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

interface ParsedCookie {
    [key: string]: string;
}

interface CookieOps {
    expires?: Date;
    path?: string;
    maxAge?: number;
}

function parseCookieWithAttributes(cookieStr: string): ParsedCookie {
    const parts = cookieStr.split(';').map(part => part.trim());
    const [nameValue, ...attributes] = parts;
    const [name, value] = nameValue.split('=');
    
    const result: ParsedCookie = { [name]: value };
    
    for (const attr of attributes) {
        const [key, val] = attr.split('=');
        if (key && val) {
            result[key] = val;
        }
    }
    
    return result;
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
    const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

    if (!accessToken) {
        if (refreshToken) {
            const data = await checkServerSession();
            const setCookie = data.headers['set-cookie'];

            if (setCookie) {
                const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
                for (const cookieStr of cookieArray) {
                    const parsed = parseCookieWithAttributes(cookieStr);
                    const options: CookieOps = {
                        expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
                        path: parsed.Path || '/',
                        maxAge: Number(parsed['Max-Age']),
                    };
                    if (parsed.accessToken) cookieStore.set('accessToken', parsed.accessToken, options);
                    if (parsed.refreshToken) cookieStore.set('refreshToken', parsed.refreshToken, options);
                }

                if (isPublicRoute) {
                    return NextResponse.redirect(new URL('/', request.url), {
                        headers: {
                            Cookie: cookieStore.toString(),
                        },
                    });
                }

                if (isPrivateRoute) {
                    return NextResponse.next({
                        headers: {
                            Cookie: cookieStore.toString(),
                        },
                    });
                }
                return NextResponse.next({
                    headers: {
                        Cookie: cookieStore.toString(),
                    },
                })
            }
        }

         if (isPublicRoute) {
            return NextResponse.next();
        }

        if (isPrivateRoute) {
            return NextResponse.redirect(new URL('/sign-in', request.url));
        }

        return NextResponse.next();
    }

    if (isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    if (isPrivateRoute) {
        return NextResponse.next();
    }
    return NextResponse.next();
};

export const config = {
    matcher: ['/profile/:path*', '/sign-in', '/sign-up', '/notes/:path*'],
};
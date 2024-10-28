import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
    const userParse = request.cookies.has('user');

    if (request.nextUrl.pathname.startsWith('/login')) {
        if (userParse) {
            let userData = request.cookies.get('user');
            return NextResponse.redirect(new URL('/panel/dashboard', request.url));

        } else {
            return NextResponse.next();
        }
    }

    if (request.nextUrl.pathname.startsWith('/panel')) {
        if (userParse) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }
    return NextResponse.next();
}


export const config = {
    matcher: [
        '/login',
        '/panel/:path*'
    ],
};

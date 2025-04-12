import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const sessionCartId = request.cookies.get('sessionCartId')?.value;

	if (!sessionCartId) {
		const response = NextResponse.next();
		response.cookies.set({
			name: 'sessionCartId',
			value: crypto.randomUUID(),
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			path: '/',
		});
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'], // Apply to all paths except static files
};

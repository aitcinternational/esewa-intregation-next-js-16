
import { NextResponse } from 'next/server';
import { updateCart } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { sessionId, items } = await request.json();
        if (sessionId && items) {
            updateCart(sessionId, items);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to track cart' }, { status: 500 });
    }
}


import { NextResponse } from 'next/server';
import { recordView } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { productId } = await request.json();
        if (productId) {
            recordView(productId);
        }
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
    }
}

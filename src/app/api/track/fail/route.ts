
import { NextResponse } from 'next/server';
import { recordOrder } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { orderId } = await request.json();

        if (!orderId) {
            return NextResponse.json({ error: 'Missing Order ID' }, { status: 400 });
        }

        // Update order status to FAILED
        // We only provide ID and status to update; other fields preserve from DB or defaults if not found
        recordOrder({
            id: orderId,
            amount: 0, // Will be ignored if order exists due to update logic, or 0 if new (should exist)
            productName: 'Unknown',
            status: 'FAILED',
            date: new Date().toISOString()
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Track Fail Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

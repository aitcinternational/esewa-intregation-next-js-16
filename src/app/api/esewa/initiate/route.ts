
import { NextResponse } from 'next/server';
import { getEsewaConfig, generateSignature } from '@/lib/esewa';
import { recordOrder } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { amount, productId, name } = body;

        if (!amount || !productId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const config = getEsewaConfig();

        // Generate a unique Order ID (pid)
        // Transaction UUID must be alphanumeric and hyphen only.
        const pid = `ORDER-${productId}-${Date.now()}`;
        const totalAmount = amount;

        // Construct the payload as per V2 documentation
        const paymentData = {
            amount: String(amount),
            tax_amount: "0",
            total_amount: String(totalAmount),
            transaction_uuid: pid,
            product_code: config.merchantCode,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${config.appUrl}/payment/success`,
            failure_url: `${config.appUrl}/payment/failure`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
        };

        const signature = generateSignature(config.secret, paymentData);

        const finalParams = {
            ...paymentData,
            signature: signature
        };

        console.log('Initiating payment for:', { pid, signature, name });
        console.log('Params:', finalParams);

        // Record initial PENDING state
        recordOrder({
            id: pid,
            amount: Number(amount),
            productName: `Order ${pid}`, // We can improve this if we pass items
            status: 'PENDING',
            date: new Date().toISOString(),
            customerName: name || 'Guest'
        });

        return NextResponse.json({
            url: config.testUrl,
            params: finalParams
        });

    } catch (error) {
        console.error('Initiate Error:', error);
        return NextResponse.json({ error: 'Failed to initiate payment', details: String(error) }, { status: 500 });
    }
}

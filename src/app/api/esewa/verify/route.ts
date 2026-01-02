
import { NextResponse } from 'next/server';
import { getEsewaConfig } from '@/lib/esewa';
import { recordOrder } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: Request) {
    try {
        const { data } = await request.json();

        if (!data) {
            return NextResponse.json(
                { success: false, message: 'Missing data parameter' },
                { status: 400 }
            );
        }

        // 1. Decode Base64
        const decodedString = Buffer.from(data, 'base64').toString('utf-8');
        console.log('Decoded eSewa Response:', decodedString);

        const decodedData = JSON.parse(decodedString);

        const {
            status,
            signature,
            transaction_code,
            total_amount,
            transaction_uuid,
            product_code,
            signed_field_names
        } = decodedData;

        if (status !== 'COMPLETE') {
            return NextResponse.json({ success: false, message: 'Transaction not complete', status });
        }

        // 2. Verify Signature
        // "Make sure you verify the integrity of the response body by comparing the signature..."
        // "Signature should be generated the same way the request’s signature was generated."
        // Using valid Signed_field_names from response

        // eSewa sends signed_field_names in response, e.g. "transaction_code,status,total_amount,transaction_uuid,product_code,signed_field_names"
        // We must construct the string `key=value,key=value...` based on that order.

        // Note: The example signature generation earlier was `total_amount=...,transaction_uuid=...`
        // Here we must dynamically build it based on `signed_field_names` in the response.

        const config = getEsewaConfig();

        // Note: The example input string format for request was `total_amount=100,...`
        // For response, we follow the same pattern using the fields listed in `signed_field_names`

        //let signatureString = "";
        const fields = signed_field_names.split(',');

        // Build the string: key=value,key=value
        const signaturePayload = fields.map((field: string) => {
            return `${field}=${decodedData[field]}`;
        }).join(',');

        console.log('Verifying String:', signaturePayload);

        const expectedSignature = crypto.createHmac('sha256', config.secret)
            .update(signaturePayload)
            .digest('base64');

        console.log('Expected:', expectedSignature);
        console.log('Received:', signature);

        if (expectedSignature !== signature) {
            return NextResponse.json({ success: false, message: 'Signature mismatch' });
        }

        // Record successful order
        recordOrder({
            id: decodedData.transaction_uuid,
            amount: parseFloat(decodedData.total_amount.replace(/,/g, '')),
            productName: 'eSewa Order',
            status: 'COMPLETE',
            date: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            message: 'Payment verified successfully',
            details: {
                transaction_code,
                total_amount,
                transaction_uuid
            }
        });

    } catch (error) {
        console.error('Verify Error:', error);
        return NextResponse.json({ success: false, message: 'Server error during verification' }, { status: 500 });
    }
}

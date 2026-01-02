
import crypto from 'crypto';

interface EsewaPaymentParams {
    amount: string;
    tax_amount: string;
    total_amount: string;
    transaction_uuid: string;
    product_code: string;
    product_service_charge: string;
    product_delivery_charge: string;
    success_url: string;
    failure_url: string;
    signed_field_names: string;
    signature: string;
}

export function generateSignature(secret: string, parameters: any) {
    const signatureString = `total_amount=${parameters.total_amount},transaction_uuid=${parameters.transaction_uuid},product_code=${parameters.product_code}`;

    console.log('Generating signature for string:', signatureString); // Debug log

    const hash = crypto.createHmac('sha256', secret)
        .update(signatureString)
        .digest('base64');

    return hash;
}

export const getEsewaConfig = () => {
    return {
        merchantCode: process.env.ESEWA_MERCHANT_CODE || 'EPAYTEST',
        testUrl: process.env.ESEWA_TEST_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form',
        secret: '8gBm/:&EnhH.1/q', // Default test secret for EPAYTEST
        appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    };
};


'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface VerifyResult {
    success: boolean;
    message?: string;
    details?: any;
}

function SuccessContent() {
    const searchParams = useSearchParams();
    // eSewa V2 redirects with ?data=BASE64STRING
    const dataQuery = searchParams.get('data');

    const [verification, setVerification] = useState<VerifyResult | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!dataQuery) return;

            try {
                const res = await fetch('/api/esewa/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ data: dataQuery })
                });
                const result = await res.json();
                setVerification(result);
            } catch (e) {
                setVerification({ success: false, message: 'Verification failed' });
            }
        };

        if (dataQuery && !verification) {
            verifyPayment();
        }
    }, [dataQuery]);

    if (!dataQuery) {
        return (
            <div className="container mx-auto p-4 text-center text-red-500">
                No payment data found.
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 max-w-md pt-10">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center border">
                {/* Verification Status */}
                {!verification && <p className="text-yellow-600 mb-4">Verifying payment...</p>}
                {verification && !verification.success && (
                    <div className="text-red-600 mb-4 p-2 bg-red-50 rounded">
                        Verification Failed: {verification.message}
                    </div>
                )}

                {verification && verification.success && (
                    <div className="mb-6">
                        <div className="text-green-500 text-5xl mb-4">✓</div>
                        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
                        <p className="text-gray-600">Thank you for your purchase.</p>
                        {verification.details && (
                            <div className="text-left bg-gray-50 p-4 rounded mt-4 text-sm">
                                <p className="flex justify-between mb-2"><span>Tx Code:</span> <span className="font-mono">{verification.details.transaction_code}</span></p>
                                <p className="flex justify-between mb-2"><span>Amount:</span> <span className="font-bold">NPR {verification.details.total_amount}</span></p>
                                <p className="flex justify-between"><span>UUID:</span> <span className="font-mono">{verification.details.transaction_uuid}</span></p>
                            </div>
                        )}
                    </div>
                )}

                <Link href="/products" className="block w-full bg-black text-white py-2 rounded mt-6">
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return <Suspense fallback={<div>Loading...</div>}><SuccessContent /></Suspense>;
}

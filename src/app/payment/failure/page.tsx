'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import { Suspense } from 'react';

function PaymentFailureContent() {
    const searchParams = useSearchParams();
    // eSewa might not return standard params on failure, but if they do:
    // Try to get 'q' or 'oit' ?? eSewa docs are vague on failure params.
    // However, usually we can pass a failure_url like ?oid=...
    // Let's assume for now we might rely on client-side lastAttempt if params are missing.
    // OR, better: We updated initiate to include failure_url parameters? NO, eSewa V2 takes a fixed URL.
    // V2 guide says: "failure_url: redirect on failure".

    // Quick fix: We will rely on localStorage for the "last attempted order" ID if params are empty.

    useEffect(() => {
        const orderId = localStorage.getItem('last_order_id');
        if (orderId) {
            fetch('/api/track/fail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId }),
            });
        }
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center p-4">
            <div className="bg-white p-10 rounded-2xl shadow-xl max-w-md w-full border border-red-100">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
                <p className="text-gray-500 mb-8">We couldn't process your payment. Please try again or contact support.</p>
                <div className="flex flex-col gap-3">
                    <Link href="/checkout" className="w-full bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-red-700 transition transform active:scale-95">
                        Try Again
                    </Link>
                    <Link href="/" className="text-gray-400 hover:text-gray-600 font-medium py-2">
                        Back to Shop
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentFailurePage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <PaymentFailureContent />
        </Suspense>
    );
}

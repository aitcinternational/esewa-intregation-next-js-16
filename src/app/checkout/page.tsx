
'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense, useEffect } from 'react';
import Link from 'next/link';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import CheckoutStepper from '@/components/CheckoutStepper';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const { cart, cartTotal, itemsCount: cartCount } = useCart();

    // Determine checkout mode: Single Product vs Cart
    const isSingleBuy = !!productId;

    const singleProduct = isSingleBuy ? products.find((p) => p.id === productId) : null;
    const productToBuy = singleProduct || products[0]; // Fallback purely for typing if dry run

    // State
    const [loading, setLoading] = useState(false);
    const [shippingMethod, setShippingMethod] = useState<'delivery' | 'pickup'>('delivery');
    const quantityParam = searchParams.get('quantity');
    const initialQty = quantityParam ? parseInt(quantityParam, 10) : 1;
    const [singleQuantity, setSingleQuantity] = useState(initialQty > 0 ? initialQty : 1);
    const [fullName, setFullName] = useState('');

    // Calculations
    const shippingCost = shippingMethod === 'delivery' ? 500 : 0;
    const discount = 0;

    // Total Calculation Logic
    let subtotal = 0;
    let itemsToCheckout = [];

    if (isSingleBuy && singleProduct) {
        subtotal = singleProduct.price * singleQuantity;
        itemsToCheckout = [{ ...singleProduct, quantity: singleQuantity }];
    } else {
        subtotal = cartTotal;
        itemsToCheckout = cart;
    }

    const total = subtotal + shippingCost - discount;

    const handlePayment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (itemsToCheckout.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        setLoading(true);
        try {
            // Create a composite Order ID / Description
            // For verified transactions, usually, we'd create an order record in DB first.
            // Here we just use the first item name + count
            const productName = isSingleBuy
                ? productToBuy.name
                : `Cart Checkout (${cartCount} items)`;

            const txnIdBase = isSingleBuy ? productToBuy.id : 'cart';

            const response = await fetch('/api/esewa/initiate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total,
                    productId: txnIdBase,
                    productName: productName,
                    name: fullName, // Send the captured name
                }),
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`Failed to initiate payment: ${response.status} ${errText}`);
            }

            const data = await response.json();

            if (data.url && data.params) {
                // Save Order ID to track failure/success
                localStorage.setItem('last_order_id', data.params.transaction_uuid);

                const form = document.createElement('form');
                form.method = 'POST';
                form.action = data.url;

                Object.keys(data.params).forEach((key) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = key;
                    input.value = data.params[key];
                    form.appendChild(input);
                });

                document.body.appendChild(form);
                form.submit();
            } else {
                alert('Invalid payment initialization response');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            alert('Failed to initiate payment. Check console.');
        } finally {
            setLoading(false);
        }
    };

    if (!isSingleBuy && cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-800">
                <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
                <Link href="/products" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans">
            {/* Header / Stepper */}
            <header className="container mx-auto px-6 py-6 flex justify-between items-center border-b border-gray-100">
                <Link href="/" className="text-2xl font-bold text-blue-700 tracking-tight">eSewa Integration Demo</Link>
                <CheckoutStepper currentStep="checkout" />
            </header>

            <main className="container mx-auto px-6 py-10">
                <div className="lg:grid lg:grid-cols-12 lg:gap-16">

                    {/* Left Column: Information */}
                    <div className="lg:col-span-7 space-y-8">
                        <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>

                        <section>
                            <h2 className="text-lg font-semibold mb-4">Shipping Information</h2>

                            {/* Delivery Toggle */}
                            <div className="flex mb-6 text-sm font-medium">
                                <label className={`flex-1 border ${shippingMethod === 'delivery' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'} py-3 rounded-l-md flex items-center justify-center cursor-pointer transition-colors`}>
                                    <input
                                        type="radio"
                                        name="method"
                                        className="mr-2"
                                        checked={shippingMethod === 'delivery'}
                                        onChange={() => setShippingMethod('delivery')}
                                    /> Delivery
                                </label>
                                <label className={`flex-1 border border-l-0 ${shippingMethod === 'pickup' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500 hover:bg-gray-50'} py-3 rounded-r-md flex items-center justify-center cursor-pointer transition-colors`}>
                                    <input
                                        type="radio"
                                        name="method"
                                        className="mr-2"
                                        checked={shippingMethod === 'pickup'}
                                        onChange={() => setShippingMethod('pickup')}
                                    /> Pick up
                                </label>
                            </div>

                            {/* Form Fields */}
                            <form id="checkout-form" className="space-y-4" onSubmit={handlePayment}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full name *</label>
                                    <input
                                        type="text"
                                        placeholder="Enter full name"
                                        className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email address *</label>
                                    <input type="email" placeholder="Enter email address" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone number *</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">🇳🇵 +977</span>
                                        <input type="tel" placeholder="Enter phone number" className="flex-1 border border-gray-300 rounded-r-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" required />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                                    <select className="w-full border border-gray-300 bg-white rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition">
                                        <option>Nepal</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                        <input type="text" placeholder="Enter city" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                        <input type="text" placeholder="Enter state" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                                        <input type="text" placeholder="Enter ZIP" className="w-full border border-gray-300 rounded-md px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="flex items-center">
                                        <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50" required />
                                        <span className="ml-2 text-sm text-gray-600">I have read and agree to the Terms and Conditions.</span>
                                    </label>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:col-span-5 mt-10 lg:mt-0">
                        <h2 className="text-lg font-semibold mb-6">Review your {isSingleBuy ? 'item' : 'cart'}</h2>

                        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
                            {/* Product List */}
                            <div className="max-h-80 overflow-y-auto pr-2 mb-6 space-y-4">
                                {itemsToCheckout.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <img src={item.image || 'https://placehold.co/80x80'} alt={item.name} className="w-16 h-16 object-cover rounded-md border border-gray-200" />
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-800 text-sm">{item.name}</h3>
                                            {isSingleBuy ? (
                                                <div className="flex items-center mt-1">
                                                    <button
                                                        onClick={() => setSingleQuantity(Math.max(1, singleQuantity - 1))}
                                                        className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 text-xs"
                                                    >-</button>
                                                    <span className="mx-2 text-xs font-medium">{singleQuantity}</span>
                                                    <button
                                                        onClick={() => setSingleQuantity(singleQuantity + 1)}
                                                        className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 text-xs"
                                                    >+</button>
                                                </div>
                                            ) : (
                                                <p className="text-gray-500 text-xs mt-1">Qty: {item.quantity}</p>
                                            )}
                                        </div>
                                        <div className="font-bold text-gray-900 text-sm">
                                            NPR {(item.price * (isSingleBuy ? singleQuantity : (item.quantity || 1))).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Discount Code */}
                            <div className="flex gap-2 mb-6">
                                <input type="text" placeholder="Discount code" className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm outline-none focus:border-blue-500" />
                                <button className="text-blue-600 font-medium text-sm hover:text-blue-700">Apply</button>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-3 pb-6 border-b border-gray-200 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>NPR {subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>NPR {shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Discount</span>
                                    <span>-NPR {discount.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center py-6 text-xl font-bold text-gray-900">
                                <span>Total</span>
                                <span>NPR {total.toFixed(2)}</span>
                            </div>

                            {/* Pay Button */}
                            <button
                                onClick={(e) => {
                                    const form = document.getElementById('checkout-form') as HTMLFormElement;
                                    if (form && form.checkValidity()) {
                                        handlePayment(e as any);
                                    } else {
                                        form?.reportValidity();
                                    }
                                }}
                                disabled={loading}
                                className="w-full bg-green-600 text-white py-4 rounded-lg font-bold hover:bg-green-700 transition shadow-lg disabled:opacity-70 flex justify-center items-center"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                                ) : 'Pay with eSewa'}
                            </button>

                            {/* Security Badge */}
                            <div className="mt-6 flex items-center justify-center text-gray-500 text-xs">
                                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Secure Checkout - SSL Encrypted
                            </div>
                            <p className="text-center text-gray-400 text-xs mt-1">Ensuring your financial and personal details are secure during every transaction.</p>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading eSewa Integration Demo Checkout...</div>}>
            <CheckoutContent />
        </Suspense>
    )
}

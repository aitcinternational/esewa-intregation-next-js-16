
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import CheckoutStepper from '@/components/CheckoutStepper';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-gray-800 font-sans p-4">
                <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
                <p className="text-gray-500 mb-8">Looks like you haven't added any items yet.</p>
                <Link
                    href="/products"
                    className="bg-blue-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-700 transition shadow-lg"
                >
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            <header className="container mx-auto px-6 py-6 border-b border-gray-100 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-700 tracking-tight">eSewa Integration Demo</Link>
                <CheckoutStepper currentStep="cart" />
            </header>

            <main className="container mx-auto px-6 py-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

                <div className="lg:grid lg:grid-cols-12 lg:gap-16">
                    {/* Cart Items List */}
                    <div className="lg:col-span-8">
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={item.id} className="flex gap-6 p-6 border border-gray-100 rounded-xl bg-gray-50">
                                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start">
                                                <h2 className="text-lg font-bold text-gray-900">{item.name}</h2>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                            <p className="text-gray-500 text-sm mt-1">{item.description}</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <div className="flex items-center bg-white border border-gray-200 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >-</button>
                                                <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                >+</button>
                                            </div>
                                            <div className="font-bold text-lg text-gray-900">
                                                NPR {(item.price * item.quantity).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={clearCart}
                                className="text-red-600 text-sm font-medium hover:text-red-800 transition"
                            >
                                Clear Cart
                            </button>
                        </div>
                    </div>

                    {/* Application Summary */}
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                            <div className="space-y-4 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>NPR {cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span className="text-green-600 text-sm">Calculated at checkout</span>
                                </div>
                            </div>

                            <div className="py-6 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900">Total</span>
                                <span className="text-xl font-bold text-blue-700">NPR {cartTotal.toLocaleString()}</span>
                            </div>

                            <Link
                                href="/checkout"
                                className="block w-full bg-blue-600 text-white text-center py-4 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg hover:shadow-xl active:scale-95 transform"
                            >
                                Proceed to Checkout
                            </Link>

                            <p className="text-center text-gray-400 text-xs mt-4">
                                Taxes and shipping calculated at checkout
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

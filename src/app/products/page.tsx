
'use client';

import Link from 'next/link';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

export default function ProductsPage() {
    const { addToCart, itemsCount } = useCart();
    const [addedId, setAddedId] = useState<string | null>(null);

    // Track View (simplified: tracks when user sees the list, ideally tracking specific clicks details)
    // For this list page, we can track "impression" or just let it be. 
    // The user asked for "Viewed". Tracking every scroll is hard.
    // Let's track when they CLICK "Buy Now" or "Add to Cart"? Or maybe just track all product impressions once?
    // User request: "save one copy of data that are buyed viewed"
    // Better strategy: Track 'view' when hovering or interact? 
    // Let's stick to: Track when page loads? No, that's 13 calls.
    // Let's track clicks on the cards.




    const handleAddToCart = (product: any) => {
        addToCart(product);
        setAddedId(product.id);
        setTimeout(() => setAddedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="text-2xl font-bold text-blue-700 tracking-tight">FURNEST</div>
                    <nav className="flex items-center space-x-6 text-sm font-medium text-gray-500">
                        <span className="text-blue-600">Shop</span>
                        <Link href="/cart" className="relative group">
                            <span className="sr-only">Cart</span>
                            <svg className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            {itemsCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {itemsCount}
                                </span>
                            )}
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Premium Furniture</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Elevate your living space with our curated collection of modern, high-quality furniture pieces designed for comfort and style.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
                        >
                            <Link href={`/products/${product.slug}`} className="relative h-64 overflow-hidden bg-gray-50 block">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                                />
                            </Link>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex-1">
                                    <Link href={`/products/${product.slug}`}>
                                        <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">{product.name}</h2>
                                    </Link>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{product.description || 'Experience premium quality and timeless design.'}</p>
                                </div>
                                <div className="pt-4 border-t border-gray-50 mt-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-2xl font-bold text-gray-900">NPR {product.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddToCart(product)}
                                            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition shadow-md border ${addedId === product.id
                                                ? 'bg-green-600 text-white border-green-600'
                                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {addedId === product.id ? 'Added!' : 'Add to Cart'}
                                        </button>
                                        <Link
                                            href={`/checkout?productId=${product.id}`}
                                            className="flex-1 bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md text-center"
                                        >
                                            Buy Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="mt-20 py-10 border-t border-gray-100 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} FURNEST Demo Shop. All rights reserved.
            </footer>
        </div>
    );
}

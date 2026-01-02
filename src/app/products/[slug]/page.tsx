
'use client';

import { useParams } from 'next/navigation';
import { products } from '@/lib/products';
import { useCart } from '@/context/CartContext';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import CheckoutStepper from '@/components/CheckoutStepper';

export default function SingleProductPage() {
    const params = useParams();
    const slug = params?.slug as string;
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('reviews');
    const [activeAccordion, setActiveAccordion] = useState<string | null>('description');

    // Products data
    const product = products.find(p => p.slug === slug);
    const relatedProducts = products.filter(p => p.id !== product?.id).slice(0, 4);

    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const trackedRef = useRef(false);

    // Initialize color
    useEffect(() => {
        if (product?.colors && product.colors.length > 0) {
            setSelectedColor(product.colors[0]);
        }
    }, [product]);

    // Track view on mount
    useEffect(() => {
        if (product && !trackedRef.current) {
            trackedRef.current = true;
            fetch('/api/track/view', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: product.id }),
            }).catch(e => console.error(e));
        }
    }, [product]);

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h1>
                <Link href="/products" className="text-blue-600 hover:underline">Back to Shop</Link>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product, quantity, selectedColor);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    const toggleAccordion = (id: string) => {
        setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-gray-800">
            {/* Header */}
            <header className="container mx-auto px-6 py-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-50">
                <div className="flex items-center gap-12">
                    <Link href="/" className="text-2xl font-bold text-blue-700 tracking-tight">FURNEST</Link>
                    <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <Link href="/products" className="hover:text-blue-600">Shop</Link>
                        <Link href="#" className="hover:text-blue-600">About Us</Link>
                        <Link href="#" className="hover:text-blue-600">Contact</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <input type="text" placeholder="Search" className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-500 w-64" />
                        <svg className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <CheckoutStepper currentStep="shop" />
                </div>
            </header>

            {/* Breadcrumb */}
            <div className="container mx-auto px-6 py-4">
                <div className="flex items-center text-sm text-gray-500 gap-2">
                    <Link href="/" className="hover:text-blue-600">Home</Link>
                    <span>/</span>
                    <Link href="/products" className="hover:text-blue-600">Products</Link>
                    <span>/</span>
                    <span className="text-gray-900 font-medium">{product.name}</span>
                </div>
            </div>

            <main className="container mx-auto px-6 pb-20">
                {/* Main Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Left: Gallery */}
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-50 rounded-3xl overflow-hidden aspect-[4/3] relative group">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                            <div className="absolute top-4 left-4 inline-block px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-blue-600 shadow-sm">
                                NEW ARRIVAL
                            </div>
                        </div>
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-blue-600 transition">
                                    <img src={product.image} alt="Thumbnail" className="w-full h-full object-cover opacity-80 hover:opacity-100" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="pt-2">
                        <div className="flex items-center gap-2 mb-4">
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-yellow-400 text-sm">
                                {[1, 2, 3, 4, 5].map(s => <span key={s}>★</span>)}
                            </div>
                            <span className="text-sm text-gray-500 border-l border-gray-200 pl-4">4.8 (120 reviews)</span>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Description</h2>
                            <p className="text-gray-600 leading-relaxed text-base">{product.description || 'Experience premium quality and timeless design. This product is crafted with attention to detail to ensure durability and style.'}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mb-8">
                            {/* Size Selector (Mock) */}
                            <div>
                                <span className="block text-sm font-semibold text-gray-900 mb-3">Size</span>
                                <div className="flex gap-2">
                                    {['S', 'M', 'L', 'XL'].map(size => (
                                        <button key={size} className="w-10 h-10 rounded-full border border-gray-200 text-sm hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-center font-medium">
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selector */}
                            <div>
                                <span className="block text-sm font-semibold text-gray-900 mb-3">Color</span>
                                <div className="flex gap-2">
                                    {(product.colors || ['#2563eb', '#000000', '#ffffff']).map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-8 h-8 rounded-full border-2 p-0.5 transition ${selectedColor === color ? 'border-blue-600' : 'border-transparent'}`}
                                        >
                                            <div className="w-full h-full rounded-full shadow-sm border border-gray-100" style={{ backgroundColor: color }}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 pt-6 border-t border-gray-100">
                            <div className="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-2 w-max max-w-[140px]">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-gray-500 hover:text-blue-600 px-2">-</button>
                                <span className="flex-1 text-center font-bold text-gray-900">{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)} className="text-gray-500 hover:text-blue-600 px-2">+</button>
                            </div>
                            <div className="text-3xl font-bold text-gray-900">
                                NPR {product.price.toLocaleString()}
                            </div>
                        </div>

                        <div className="mt-8 flex gap-4">
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2 ${added ? 'bg-green-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                {added ? 'Added to Cart' : 'Add to Cart'}
                            </button>
                        </div>

                        <div className="mt-6 flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Secure Payment</span>
                            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Free Shipping</span>
                            <span className="flex items-center gap-1"><svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Returns</span>
                        </div>
                    </div>
                </div>

                {/* Additional Details & Reviews Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-t border-gray-100 pt-16">


                    {/* left: Details Tabs (5 cols) */}
                    <div className="lg:col-span-7">
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Additional Details</h2>

                        <div className="flex flex-col">
                            {/* Tab Headers */}
                            <div className="flex flex-wrap gap-x-8 border-b border-gray-200 mb-6">
                                {['Description', 'Size & Fit', 'About Store', 'Shipping'].map((item) => {
                                    const id = item.toLowerCase().replace(/ /g, '-');
                                    const isActive = activeAccordion === id;
                                    return (
                                        <button
                                            key={id}
                                            onClick={() => setActiveAccordion(id)}
                                            className={`pb-3 text-base font-bold transition border-b-2 ${isActive ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Tab Content */}
                            <div className="text-gray-600 leading-relaxed text-base min-h-[200px]">
                                {activeAccordion === 'description' && (
                                    <div>
                                        <p className="mb-4">{product.description || 'Experience premium quality and timeless design. This product is crafted with attention to detail to ensure durability and style.'}</p>
                                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                                            <li>Premium material quality</li>
                                            <li>Modern and versatile design</li>
                                            <li>Easy to clean and maintain</li>
                                            <li>Eco-friendly manufacturing</li>
                                        </ul>
                                    </div>
                                )}
                                {activeAccordion === 'size-&-fit' && (
                                    <div>
                                        <p className="mb-4">Our sizing runs true to standard international sizes. Reference the chart below for precise measurements.</p>
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div className="p-3 bg-gray-50 rounded-lg">S: Chest 36-38"</div>
                                            <div className="p-3 bg-gray-50 rounded-lg">M: Chest 39-41"</div>
                                            <div className="p-3 bg-gray-50 rounded-lg">L: Chest 42-44"</div>
                                            <div className="p-3 bg-gray-50 rounded-lg">XL: Chest 45-48"</div>
                                        </div>
                                    </div>
                                )}
                                {activeAccordion === 'about-store' && (
                                    <div>
                                        <p>FURNEST is dedicated to bringing you the finest furniture and home decor from around the world. We believe in quality, sustainability, and exceptional customer service.</p>
                                    </div>
                                )}
                                {activeAccordion === 'shipping' && (
                                    <div>
                                        <p className="mb-2"><strong>Free Shipping:</strong> On all orders over NPR 5,000.</p>
                                        <p className="mb-2"><strong>Delivery Time:</strong> 2-5 business days within Kathmandu valley, 4-7 days outside.</p>
                                        <p><strong>Returns:</strong> 30-day return policy for unused items in original packaging.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* right: Reviews (7 cols) */}
                    <div className="lg:col-span-5">
                        <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
                            <button
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-4 text-lg font-bold transition border-b-2 ${activeTab === 'reviews' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                            >
                                All Reviews (120)
                            </button>
                            <button
                                onClick={() => setActiveTab('images')}
                                className={`pb-4 text-lg font-bold transition border-b-2 ${activeTab === 'images' ? 'text-blue-600 border-blue-600' : 'text-gray-400 border-transparent hover:text-gray-600'}`}
                            >
                                Images (24)
                            </button>
                        </div>

                        {activeTab === 'reviews' ? (
                            <div className="space-y-8">
                                {[1, 2].map((review) => (
                                    <div key={review} className="bg-gray-50 p-6 rounded-2xl">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">U{review}</div>
                                            <div>
                                                <div className="font-bold text-gray-900">User Name</div>
                                                <div className="text-xs text-gray-500">2 days ago</div>
                                            </div>
                                            <div className="ml-auto text-yellow-400 text-sm">★★★★★</div>
                                        </div>
                                        <div className="font-medium text-gray-900 mb-2">Excellent Product!</div>
                                        <p className="text-gray-600 text-sm leading-relaxed">Even though this is a demo product, the quality feels amazing in the imagination! The delivery was super fast and the packaging was eco-friendly.</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-4">
                                {[1, 2, 3, 4, 5, 6].map(i => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded-xl"></div>
                                ))}
                            </div>
                        )}
                    </div>





                </div>

                {/* Best Selling Items */}
                <div className="mt-24">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">We Found Other Products</h2>
                            <p className="text-gray-500">You might also like these popular items</p>
                        </div>
                        <Link href="/products" className="px-6 py-2 bg-pink-50 text-pink-600 font-bold rounded-full hover:bg-pink-100 transition">View More</Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {relatedProducts.map(rp => (
                            <Link key={rp.id} href={`/products/${rp.slug}`} className="group">
                                <div className="bg-gray-50 rounded-2xl overflow-hidden aspect-[3/4] mb-4 relative">
                                    <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                    <button className="absolute bottom-4 right-4 bg-white p-3 rounded-full shadow-md text-gray-800 hover:text-blue-600 hover:scale-110 transition opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                                    </button>
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition">{rp.name}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-900 font-bold">NPR {rp.price.toLocaleString()}</span>
                                    <span className="text-yellow-400 text-xs flex items-center">★ 4.8</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Service Features */}
                <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 py-12 border-t border-gray-100">
                    {[
                        { title: 'Secure Payment', color: 'text-blue-600', bg: 'bg-blue-50', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
                        { title: 'Size & Fit', color: 'text-pink-600', bg: 'bg-pink-50', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
                        { title: 'Free Shipping', color: 'text-purple-600', bg: 'bg-purple-50', icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4' },
                        { title: 'Shipping & Return', color: 'text-orange-600', bg: 'bg-orange-50', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' }
                    ].map((feature, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <div className={`w-16 h-16 ${feature.bg} ${feature.color} rounded-2xl flex items-center justify-center mb-4`}>
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={feature.icon}></path></svg>
                            </div>
                            <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                            <p className="text-xs text-gray-500 max-w-[150px]">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

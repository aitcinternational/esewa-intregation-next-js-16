
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { products } from '@/lib/products';

export default function AdminDataPage() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => setLoading(false));
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Data...</div>;

    if (!data) return <div className="p-10 text-center text-red-500">Failed to load data</div>;

    const { views, carts, orders } = data;

    // Process carts to find "Abandoned" items
    // Simple logic: List all items currently sitting in active carts
    const activeCarts = Object.values(carts || {}) as any[];
    const abandonedItems = activeCarts.flatMap((c: any) => c.items);

    // Calculate total revenue
    const totalRevenue = (orders || [])
        .filter((order: any) => order.status === 'COMPLETE')
        .reduce((sum: number, order: any) => sum + order.amount, 0);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <header className="bg-white shadow">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                    <nav className="space-x-4">
                        <Link href="/admin/data" className="text-blue-600 font-semibold">Data & Stats</Link>
                        <Link href="/admin/payments" className="text-gray-500 hover:text-gray-900">Payments</Link>
                        <Link href="/" className="text-gray-400 text-sm">Back to Shop</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10">

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Views</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{Object.values(views || {}).reduce((a: number, b: any) => a + (Number(b) || 0), 0)}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Active Carts</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">{activeCarts.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Total Orders</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">{orders?.length || 0}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium uppercase">Revenue</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">NPR {totalRevenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Views Table */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-800">Product Views</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3">Product Name</th>
                                        <th className="px-6 py-3">Views</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {Object.entries(views || {}).map(([pid, count]: any) => {
                                        const product = products.find(p => p.id === pid);
                                        return (
                                            <tr key={pid}>
                                                <td className="px-6 py-3 font-medium">
                                                    <Link href={`/products/${product?.slug}`} className="text-blue-600 hover:underline">
                                                        {product?.name || 'Unknown Product'}
                                                    </Link>
                                                    <div className="text-xs text-gray-400">{pid}</div>
                                                </td>
                                                <td className="px-6 py-3">{count}</td>
                                            </tr>
                                        );
                                    })}
                                    {Object.keys(views || {}).length === 0 && (
                                        <tr><td colSpan={2} className="px-6 py-4 text-center text-gray-400">No views recorded yet</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Abandoned / Active Cart Items */}
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                            <h2 className="font-bold text-gray-800">Active / Abandoned Cart Items</h2>
                            <p className="text-xs text-gray-400 mt-1">Items currently in user carts but not purchased</p>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3">Product</th>
                                        <th className="px-6 py-3">Qty</th>
                                        <th className="px-6 py-3">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {abandonedItems.map((item: any, idx: number) => (
                                        <tr key={`${item.id}-${idx}`}>
                                            <td className="px-6 py-3 font-medium">
                                                <Link href={`/products/${item.slug}`} className="text-blue-600 hover:underline">
                                                    {item.name}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-3">{item.quantity}</td>
                                            <td className="px-6 py-3 text-gray-500">NPR {item.price}</td>
                                        </tr>
                                    ))}
                                    {abandonedItems.length === 0 && (
                                        <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-400">No active carts</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

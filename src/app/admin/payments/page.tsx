
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPaymentsPage() {
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

    if (loading) return <div className="p-10 text-center">Loading Payments...</div>;
    if (!data) return <div className="p-10 text-center text-red-500">Failed to load data</div>;

    const { orders } = data;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            <header className="bg-white shadow">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                    <nav className="space-x-4">
                        <Link href="/admin/data" className="text-gray-500 hover:text-gray-900">Data & Stats</Link>
                        <Link href="/admin/payments" className="text-blue-600 font-semibold">Payments</Link>
                        <Link href="/" className="text-gray-400 text-sm">Back to Shop</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-10">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-6 border-b border-gray-100 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-800">Payment History</h2>
                        <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">Total: {orders?.length || 0}</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-3">Order ID</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Product / Desc</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(orders || []).map((order: any, idx: number) => (
                                    <tr key={idx} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4 font-mono text-gray-600">{order.id}</td>
                                        <td className="px-6 py-4 text-gray-500">{new Date(order.date).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.productName}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">NPR {order.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'COMPLETE' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                                {(orders || []).length === 0 && (
                                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No payments recorded yet</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

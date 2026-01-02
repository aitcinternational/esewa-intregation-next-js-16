import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "eSewa Integration Demo | Next.js Payment Gateway",
    description: "Test and implement eSewa payment gateway in Next.js 16. Secure, scalable, and ready-to-use setup for Nepali digital payments.",
    keywords: "eSewa integration, Next.js payments, Nepali digital payment, eSewa demo, Next.js payment gateway",
    authors: [{ name: "AITC International" }],
    openGraph: {
        type: "website",
        url: "https://esewa-intregation-next-js-16.vercel.app/",
        title: "eSewa Integration Demo | Next.js Payment Gateway",
        description: "Test and implement eSewa payment gateway in Next.js 16. Secure, scalable, and ready-to-use setup for Nepali digital payments.",
        images: ["https://esewa-intregation-next-js-16.vercel.app/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "eSewa Integration Demo | Next.js Payment Gateway",
        description: "Test and implement eSewa payment gateway in Next.js 16. Secure, scalable, and ready-to-use setup for Nepali digital payments.",
        images: ["https://esewa-intregation-next-js-16.vercel.app/og-image.png"],
    },
    icons: {
        icon: "/favicon.ico",
    },
    alternates: {
        canonical: "https://esewa-intregation-next-js-16.vercel.app/",
    },
};

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "eSewa Integration Demo",
        "url": "https://esewa-intregation-next-js-16.vercel.app/",
        "description": "Demo site to test and implement eSewa payment gateway in Next.js 16.",
        "publisher": {
            "@type": "Organization",
            "name": "AITC International"
        }
    };

    return (
        <main className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
            <h1 className="text-4xl font-bold mb-4">eSewa Integration Demo</h1>
            <p className="text-xl mb-8 max-w-2xl text-gray-600">
                Secure, scalable, and ready-to-use setup for Nepali digital payments using Next.js 16.
            </p>

            <div className="flex gap-4">
                <Link
                    href="/products"
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                >
                    Test with Demo Products
                </Link>
                <Link
                    href="https://github.com/aitcinternational/esewa-intregation-next-js-16"
                    target="_blank"
                    className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                >
                    View Source Code
                </Link>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </main>
    );
}

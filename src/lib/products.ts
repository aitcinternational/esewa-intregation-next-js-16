
export interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
    description?: string;
    colors?: string[];
}

export const products: Product[] = [
    {
        id: 'p1',
        name: 'DuoComfort Sofa Premium',
        slug: 'duocomfort-sofa-premium',
        price: 35000.00,
        image: 'https://placehold.co/600x400/2563eb/white?text=Sofa',
        description: 'Luxury comfort for your living room.',
        colors: ['#2563eb', '#1e293b', '#64748b']
    },
    {
        id: 'p2',
        name: 'IronOne Desk',
        slug: 'ironone-desk',
        price: 12500.00,
        image: 'https://placehold.co/600x400/4b5563/white?text=Desk',
        description: 'Minimalist workspace solution.',
        colors: ['#4b5563', '#000000', '#ffffff']
    },
    {
        id: 'p3',
        name: 'ErgoChair Plus',
        slug: 'ergochair-plus',
        price: 18000.00,
        image: 'https://placehold.co/600x400/dc2626/white?text=Chair',
        description: 'Ergonomic design for long hours.',
        colors: ['#dc2626', '#000000', '#2563eb']
    },
    {
        id: 'p4',
        name: 'Lumina Floor Lamp',
        slug: 'lumina-floor-lamp',
        price: 4500.00,
        image: 'https://placehold.co/600x400/ea580c/white?text=Lamp',
        description: 'Modern lighting for any corner.',
        colors: ['#ea580c', '#fbbf24', '#000000']
    },
    {
        id: 'p5',
        name: 'OakWood Dining Table',
        slug: 'oakwood-dining-table',
        price: 45000.00,
        image: 'https://placehold.co/600x400/854d0e/white?text=Table',
        description: 'Solid oak dining table for 6.',
        colors: ['#854d0e', '#78350f', '#fcd34d']
    },
    {
        id: 'p6',
        name: 'Velvet Accent Chair',
        slug: 'velvet-accent-chair',
        price: 15000.00,
        image: 'https://placehold.co/600x400/7c3aed/white?text=Chair',
        description: 'Plush velvet chair for style.',
        colors: ['#7c3aed', '#db2777', '#4b5563']
    },
    {
        id: 'p7',
        name: 'Minimalist Bookshelf',
        slug: 'minimalist-bookshelf',
        price: 8500.00,
        image: 'https://placehold.co/600x400/059669/white?text=Shelf',
        description: 'Display your books in style.',
        colors: ['#059669', '#ffffff', '#000000']
    },
    {
        id: 'p8',
        name: 'CloudSoft Rug',
        slug: 'cloudsoft-rug',
        price: 6000.00,
        image: 'https://placehold.co/600x400/d97706/white?text=Rug',
        description: 'Ultra-soft area rug.',
        colors: ['#d97706', '#fcd34d', '#e5e7eb']
    },
    {
        id: 'p9',
        name: 'Nordic Coffee Table',
        slug: 'nordic-coffee-table',
        price: 9500.00,
        image: 'https://placehold.co/600x400/0891b2/white?text=Coffee+Table',
        description: 'Sleek center piece.',
        colors: ['#0891b2', '#000000', '#ffffff']
    },
    {
        id: 'p10',
        name: 'ErgoMouse Pro',
        slug: 'ergomouse-pro',
        price: 3500.00,
        image: 'https://placehold.co/600x400/db2777/white?text=Mouse',
        description: 'Wireless productivity mouse.',
        colors: ['#db2777', '#000000', '#ffffff']
    },
    {
        id: 'p11',
        name: 'MechKey Keyboard',
        slug: 'mechkey-keyboard',
        price: 7500.00,
        image: 'https://placehold.co/600x400/4f46e5/white?text=Keyboard',
        description: 'Mechanical switches for typing.',
        colors: ['#4f46e5', '#111827', '#ffffff']
    },
    {
        id: 'p12',
        name: 'UltraWide Monitor',
        slug: 'ultrawide-monitor',
        price: 55000.00,
        image: 'https://placehold.co/600x400/be185d/white?text=Monitor',
        description: 'Immersive viewing experience.',
        colors: ['#be185d', '#000000']
    },
    {
        id: 'p13',
        name: 'SmartHome Hub',
        slug: 'smarthome-hub',
        price: 10500.00,
        image: 'https://placehold.co/600x400/ca8a04/white?text=Hub',
        description: 'Control your home voice.',
        colors: ['#ca8a04', '#000000', '#ffffff']
    }
];

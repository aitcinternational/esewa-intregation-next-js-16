
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src/data/db.json');

// Ensure data directory exists
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

export interface Order {
    id: string;
    amount: number;
    productName: string;
    status: string;
    date: string;
    customerName?: string; // Optional
}

export interface CartSnapshot {
    sessionId: string;
    items: { id: string; name: string; price: number; quantity: number }[];
    total: number;
    lastUpdated: string;
}

export interface DBData {
    views: Record<string, number>; // productId -> count
    orders: Order[];
    carts: Record<string, CartSnapshot>; // sessionId -> CartSnapshot
}

const defaultData: DBData = {
    views: {},
    orders: [],
    carts: {},
};

export function getDB(): DBData {
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify(defaultData, null, 2));
        return defaultData;
    }
    try {
        const data = fs.readFileSync(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading DB:', error);
        return defaultData;
    }
}

export function saveDB(data: DBData) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving DB:', error);
    }
}

export function recordView(productId: string) {
    const db = getDB();
    db.views[productId] = (db.views[productId] || 0) + 1;
    saveDB(db);
}

export function recordOrder(order: Order) {
    const db = getDB();
    const existingIndex = db.orders.findIndex(o => o.id === order.id);

    if (existingIndex !== -1) {
        // Update existing order
        db.orders[existingIndex] = { ...db.orders[existingIndex], ...order };
    } else {
        // Add new order
        db.orders.unshift(order);
    }
    saveDB(db);
}

export function updateCart(sessionId: string, items: any[]) {
    const db = getDB();

    if (items.length === 0) {
        delete db.carts[sessionId]; // Remove empty carts
    } else {
        const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        db.carts[sessionId] = {
            sessionId,
            items,
            total,
            lastUpdated: new Date().toISOString()
        };
    }
    saveDB(db);
}

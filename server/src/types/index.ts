export interface Location {
    id: string;
    name: string;
    address: string;
    timezone: string;
    status: 'ACTIVE' | 'INACTIVE';
}

export interface Variation {
    id: string;
    name: string;
    price: string; // Formatted currency
    price_money?: {
        amount: number; // In cents
        currency: string;
    };
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    category_name: string;
    image_url?: string;
    variations: Variation[];
}

export interface CategoryGroup {
    id: string;
    name: string;
    items: MenuItem[];
}

export interface CategorySummary {
    id: string;
    name: string;
    item_count: number;
}

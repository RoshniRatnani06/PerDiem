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
    price: string;
    price_money?: {
        amount: number; // Frontend treats as number usually, but careful with precision. String is safer for display.
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
    name: string; // Category Name
    items: MenuItem[];
}

export interface CategorySummary {
    id: string;
    name: string;
    item_count: number;
}

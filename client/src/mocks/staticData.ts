import type { Location, CategoryGroup, CategorySummary } from '../types';

/**
 * Static mock data for UI development and fallback testing.
 * This data mirrors the shape returned by the backend API endpoints.
 */

export const MOCK_LOCATIONS: Location[] = [
    {
        id: 'mock-loc-1',
        name: 'Downtown Café',
        address: '123 Main Street, San Francisco, CA',
        timezone: 'America/Los_Angeles',
        status: 'ACTIVE',
    },
    {
        id: 'mock-loc-2',
        name: 'Mission District',
        address: '456 Valencia St, San Francisco, CA',
        timezone: 'America/Los_Angeles',
        status: 'ACTIVE',
    },
    {
        id: 'mock-loc-3',
        name: 'SoMa Roastery',
        address: '789 Howard St, San Francisco, CA',
        timezone: 'America/Los_Angeles',
        status: 'ACTIVE',
    },
];

export const MOCK_CATEGORIES: CategorySummary[] = [
    { id: 'Espresso Drinks', name: 'Espresso Drinks', item_count: 4 },
    { id: 'Cold Brew', name: 'Cold Brew', item_count: 3 },
    { id: 'Pastries', name: 'Pastries', item_count: 4 },
    { id: 'Breakfast', name: 'Breakfast', item_count: 3 },
    { id: 'Seasonal Specials', name: 'Seasonal Specials', item_count: 3 },
];

export const MOCK_CATALOG: CategoryGroup[] = [
    {
        id: 'Espresso Drinks',
        name: 'Espresso Drinks',
        items: [
            {
                id: 'item-esp-1',
                name: 'Classic Espresso',
                description:
                    'A rich, full-bodied shot of our signature blend. Sourced from single-origin Ethiopian Yirgacheffe beans, roasted in-house for a bright, floral profile with notes of dark chocolate.',
                category_name: 'Espresso Drinks',
                image_url: undefined,
                variations: [
                    { id: 'v1', name: 'Single', price: '$3.50', price_money: { amount: 350, currency: 'USD' } },
                    { id: 'v2', name: 'Double', price: '$4.50', price_money: { amount: 450, currency: 'USD' } },
                ],
            },
            {
                id: 'item-esp-2',
                name: 'Oat Milk Latte',
                description:
                    'Smooth espresso layered with steamed oat milk. Creamy, naturally sweet, and completely plant-based — a crowd favorite.',
                category_name: 'Espresso Drinks',
                image_url: undefined,
                variations: [
                    { id: 'v3', name: 'Small', price: '$5.00', price_money: { amount: 500, currency: 'USD' } },
                    { id: 'v4', name: 'Medium', price: '$6.00', price_money: { amount: 600, currency: 'USD' } },
                    { id: 'v5', name: 'Large', price: '$7.00', price_money: { amount: 700, currency: 'USD' } },
                ],
            },
            {
                id: 'item-esp-3',
                name: 'Honey Lavender Cappuccino',
                description:
                    'House-made lavender syrup and local honey swirled into a classic cappuccino. Topped with microfoam and a sprinkle of dried lavender.',
                category_name: 'Espresso Drinks',
                image_url: undefined,
                variations: [
                    { id: 'v6', name: 'Regular', price: '$6.50', price_money: { amount: 650, currency: 'USD' } },
                ],
            },
            {
                id: 'item-esp-4',
                name: 'Cortado',
                description: 'Equal parts espresso and warm milk. Bold and balanced — cut to perfection.',
                category_name: 'Espresso Drinks',
                image_url: undefined,
                variations: [
                    { id: 'v7', name: 'Standard', price: '$5.00', price_money: { amount: 500, currency: 'USD' } },
                ],
            },
        ],
    },
    {
        id: 'Cold Brew',
        name: 'Cold Brew',
        items: [
            {
                id: 'item-cb-1',
                name: 'Classic Cold Brew',
                description:
                    '18-hour steeped cold brew. Smooth, low-acid, and loaded with caffeine. Served over ice — best enjoyed black but pairs beautifully with oat milk.',
                category_name: 'Cold Brew',
                image_url: undefined,
                variations: [
                    { id: 'v8', name: '12 oz', price: '$5.00', price_money: { amount: 500, currency: 'USD' } },
                    { id: 'v9', name: '16 oz', price: '$6.50', price_money: { amount: 650, currency: 'USD' } },
                ],
            },
            {
                id: 'item-cb-2',
                name: 'Nitro Cold Brew',
                description:
                    'Cold brew infused with nitrogen for a silky-smooth, Guinness-like pour. The dark cascade and creamy head make this our most Instagrammed drink.',
                category_name: 'Cold Brew',
                image_url: undefined,
                variations: [
                    { id: 'v10', name: '10 oz', price: '$6.00', price_money: { amount: 600, currency: 'USD' } },
                ],
            },
            {
                id: 'item-cb-3',
                name: 'Vanilla Sweet Cream Cold Brew',
                description:
                    'Our cold brew topped with house-made vanilla sweet cream slowly cascading through. Indulgent, refreshing, and utterly satisfying.',
                category_name: 'Cold Brew',
                image_url: undefined,
                variations: [
                    { id: 'v11', name: 'Regular', price: '$7.00', price_money: { amount: 700, currency: 'USD' } },
                ],
            },
        ],
    },
    {
        id: 'Pastries',
        name: 'Pastries',
        items: [
            {
                id: 'item-p-1',
                name: 'Butter Croissant',
                description:
                    'Flaky, golden, and made fresh every morning by our in-house pastry team. 72-hour laminated dough with French-style cultured butter.',
                category_name: 'Pastries',
                image_url: undefined,
                variations: [
                    { id: 'v12', name: 'Each', price: '$4.50', price_money: { amount: 450, currency: 'USD' } },
                ],
            },
            {
                id: 'item-p-2',
                name: 'Almond Croissant',
                description:
                    'A day-old butter croissant revived with almond cream filling, soaked in our house-made simple syrup, and finished with toasted flaked almonds.',
                category_name: 'Pastries',
                image_url: undefined,
                variations: [
                    { id: 'v13', name: 'Each', price: '$5.50', price_money: { amount: 550, currency: 'USD' } },
                ],
            },
            {
                id: 'item-p-3',
                name: 'Seasonal Fruit Tart',
                description: 'Buttery pastry shell filled with vanilla custard and topped with seasonal fruits. Ask your barista what\'s in season today.',
                category_name: 'Pastries',
                image_url: undefined,
                variations: [
                    { id: 'v14', name: 'Slice', price: '$6.00', price_money: { amount: 600, currency: 'USD' } },
                ],
            },
            {
                id: 'item-p-4',
                name: 'Cinnamon Roll',
                description: 'Pillowy soft roll with house-made cinnamon filling, topped with cream cheese glaze. Baked to order on weekends.',
                category_name: 'Pastries',
                image_url: undefined,
                variations: [
                    { id: 'v15', name: 'Each', price: '$5.00', price_money: { amount: 500, currency: 'USD' } },
                ],
            },
        ],
    },
    {
        id: 'Breakfast',
        name: 'Breakfast',
        items: [
            {
                id: 'item-b-1',
                name: 'Avocado Toast',
                description:
                    'Smashed Hass avocado on house-baked sourdough. Finished with chili flakes, everything bagel seasoning, a squeeze of lemon, and two soft-poached eggs.',
                category_name: 'Breakfast',
                image_url: undefined,
                variations: [
                    { id: 'v16', name: 'Regular', price: '$14.00', price_money: { amount: 1400, currency: 'USD' } },
                    { id: 'v17', name: 'Add Smoked Salmon', price: '$18.00', price_money: { amount: 1800, currency: 'USD' } },
                ],
            },
            {
                id: 'item-b-2',
                name: 'Granola Bowl',
                description:
                    'House-made granola with coconut milk, seasonal berries, banana, and a drizzle of local wildflower honey. Vegan and gluten-free.',
                category_name: 'Breakfast',
                image_url: undefined,
                variations: [
                    { id: 'v18', name: 'Regular', price: '$12.00', price_money: { amount: 1200, currency: 'USD' } },
                ],
            },
            {
                id: 'item-b-3',
                name: 'Egg & Cheese Sandwich',
                description: 'Two scrambled eggs, aged cheddar, and our house-made garlic aioli on a toasted brioche bun. Add bacon or avocado for a small upcharge.',
                category_name: 'Breakfast',
                image_url: undefined,
                variations: [
                    { id: 'v19', name: 'Regular', price: '$10.00', price_money: { amount: 1000, currency: 'USD' } },
                    { id: 'v20', name: 'With Bacon', price: '$13.00', price_money: { amount: 1300, currency: 'USD' } },
                ],
            },
        ],
    },
    {
        id: 'Seasonal Specials',
        name: 'Seasonal Specials',
        items: [
            {
                id: 'item-s-1',
                name: 'Matcha Hojicha Latte',
                description: 'A blend of ceremonial-grade matcha and roasted hojicha, steamed with your choice of milk. Earthy, toasty, and deeply satisfying.',
                category_name: 'Seasonal Specials',
                image_url: undefined,
                variations: [
                    { id: 'v21', name: 'Small', price: '$6.50', price_money: { amount: 650, currency: 'USD' } },
                    { id: 'v22', name: 'Large', price: '$7.50', price_money: { amount: 750, currency: 'USD' } },
                ],
            },
            {
                id: 'item-s-2',
                name: 'Cardamom Rose Latte',
                description: 'Espresso with steamed milk, a touch of rose water, and house-made cardamom syrup. Inspired by Middle Eastern café culture.',
                category_name: 'Seasonal Specials',
                image_url: undefined,
                variations: [
                    { id: 'v23', name: 'Regular', price: '$7.00', price_money: { amount: 700, currency: 'USD' } },
                ],
            },
            {
                id: 'item-s-3',
                name: 'Iced Mango Chili Cold Brew',
                description: 'A bold cold brew infused with dried chili and finished with a mango purée float. Sweet heat meets coffee culture — a summer staple.',
                category_name: 'Seasonal Specials',
                image_url: undefined,
                variations: [
                    { id: 'v24', name: 'Regular', price: '$7.50', price_money: { amount: 750, currency: 'USD' } },
                ],
            },
        ],
    },
];

export interface IndexedProduct {
    objectID: string;
    name: string;
    price: number;
    description: string;
    categories: number[];
    intentTag: string[];
    images: Record<string, string>;
    productId: number;
}
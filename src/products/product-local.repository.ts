import { Product } from "./product";
import { ProductRepository } from "./product.repository";

export class LocalProductRepository implements ProductRepository {
    private products: Product[] = [
        { id: "p1", name: "Laptop", price: 1200, stock: 5 },
        { id: "p2", name: "Headphones", price: 200, stock: 10 },
    ];

    findById(productId: string): Product | undefined {
        return this.products.find(product => product.id === productId);
    }
}
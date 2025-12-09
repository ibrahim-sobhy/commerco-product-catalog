import { AddToCartRequest } from "../interfaces/add-to-cart.request";
import { IProductRepository } from "../interfaces/product.repository";
import { CartItem } from "./cart-item";
import { CartCalculator } from "./cart-calculator";

export class CartService {
    private cartCalculator = new CartCalculator();
    private items : CartItem[] = [];

    constructor(private productRepo: IProductRepository) {
    }

    addToCart(request: AddToCartRequest): void {
        const product = this.productRepo.findById(request.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.stock < request.quantity) {
            throw new Error("Insufficient stock");
        }
        
        const existingItem = this.items.find(item => item.productId === request.productId);
        if (existingItem) {
            existingItem.quantity += request.quantity;
        } else {
            this.items.push({ productId: request.productId, quantity: request.quantity, price: product.price});
        }
    }

    getCart(): CartItem[] {
        return this.items;
    }

    async getCalculatedTotalPrice(): Promise<number> {
        return this.cartCalculator.calculateTotalPrice(this.items);
    }
}
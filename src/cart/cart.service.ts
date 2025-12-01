import { AddToCartRequest } from "../interfaces/add-to-cart.request";
import { ProductRepository } from "../products/product-local.repository";
import { IProductRepository } from "../products/product.repository";
import { CartItem } from "./cart-item";

export class CartService {
    private items : CartItem[] = [];

    constructor(private productRepo: IProductRepository){

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
            this.items.push({ productId: request.productId, quantity: request.quantity });
        }
    }

    getCart(): CartItem[] {
        return this.items;
    }
}
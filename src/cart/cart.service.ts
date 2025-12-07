import { AddToCartRequest } from "../interfaces/add-to-cart.request";
import { IProductRepository } from "../interfaces/product.repository";
import { Cart } from "../interfaces/cart";
import { CartCalculator } from "./cart-calculator";

export class CartService {
    private cart : Cart;
    constructor(private productRepo: IProductRepository) {
        this.cart = { items: [], totalPrice: 0 };
    }
    addToCart(request: AddToCartRequest): void {
        const product = this.productRepo.findById(request.productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.stock < request.quantity) {
            throw new Error("Insufficient stock");
        }
        
        const existingItem = this.cart.items.find(item => item.productId === request.productId);
        if (existingItem) {
            existingItem.quantity += request.quantity;
        } else {
            this.cart.items.push({ productId: request.productId, quantity: request.quantity, price: product.price});
        }
    }

    getCart(): Cart {
        return this.cart;
    }

    async addCalculatedTotalPrice(): Promise<void> {
        const cartCalculator = new CartCalculator();
        this.cart.totalPrice = await cartCalculator.calculateTotalPrice(this.cart.items);
    }
}
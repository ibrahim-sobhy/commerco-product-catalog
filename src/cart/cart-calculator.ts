import { CartService } from "./cart.service";

export class CartCalculator {
    constructor(private cartService: CartService) { }




    getTotalPrice(): number {
        const DISCOUNT_THRESHOLD = 200;
        const DISCOUNT_RATE = 0.1;
        const items = this.cartService.getCart();
        let total = 0;
        for (const item of items) {
            total += (item.price ?? 0) * item.quantity;
        }

        if (total > DISCOUNT_THRESHOLD) {
            total = total * (1 - DISCOUNT_RATE);
        }
        return total;
    }
}
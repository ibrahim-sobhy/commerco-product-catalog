import { CartItem } from "./cart-item";

export class CartCalculator {

    async calculateTotalPrice(items: CartItem[]): Promise<number> {

        let total = 0;
        for (const item of items) {
            total += (item.price ?? 0) * item.quantity;
        }

        if ( total > 200 ) {
            total = total * 0.9; // Apply 10% discount for orders over $200
        }
        return total;
    }

}
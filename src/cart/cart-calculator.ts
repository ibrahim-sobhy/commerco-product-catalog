import { CartItem } from "./cart-item";

export class CartCalculator {

    async calculateTotalPrice(items: CartItem[]): Promise<number> {

        let total = 0;
        if (items.length > 0) {
            for (const item of items) {
                total += (item.price ?? 0) * item.quantity;
                console.log(item);
            }
            console.log("Total price of items: " + total);
        } else {
            console.log("CartItem array is empty");
        }

        if ( total > 200 ) {
            total = total * 0.9; // Apply 10% discount for orders over $200
            console.log("Total price was deducted by 10%.");
        }
        return total;
    }
}
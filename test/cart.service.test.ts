import { CartService } from "../src/cart/cart.service";
import { IProductRepository } from "../src/products/product.repository";

describe("CartService", () => {
    it("should add items to the cart", () => {
        const repoMock: jest.Mocked<IProductRepository> = {
            findById: jest.fn()
        };
        repoMock.findById.mockReturnValue({ id: "p1", name: "Laptop", price: 1200, stock: 5});
        const service = new CartService(repoMock);

        service.addToCart({ productId: "p1", quantity: 2 });

        const cart = service.getCart();
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(2);
    });

    it("should validate product stock is greater than 0", () => {
        const repoMock: jest.Mocked<IProductRepository> = {
            findById: jest.fn()
        };
        repoMock.findById.mockReturnValue({ id: "p1", name: "Laptop", price: 1200, stock: 5});
        const service = new CartService(repoMock);

        expect(() => {
            service.addToCart({ productId: "outOfStockProduct", quantity: 10 });
        }).toThrow("Insufficient stock")
    });
});
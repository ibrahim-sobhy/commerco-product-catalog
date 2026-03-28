import { CartService } from "../src/cart/cart.service";
import { ProductRepository } from "../src/products/product.repository";

describe("CartService", () => {
    it("should add items to the cart", () => {
        const repoMock: jest.Mocked<ProductRepository> = { findById: jest.fn() }
        repoMock.findById.mockReturnValue({ id: "p1", name: "Laptop", price: 1200, stock: 5 });
        const service = new CartService(repoMock);

        service.addToCart({ productId: "p1", quantity: 2 });

        const cart = service.getCart();
        expect(cart.length).toBe(1);
        expect(cart[0].quantity).toBe(2);
    });
    it("Test product not found", () => {
        const repoMock: jest.Mocked<ProductRepository> = { findById: jest.fn() }
        const service = new CartService(repoMock);
        expect(() => {
            service.addToCart({ productId: "invalid", quantity: 1 });
        }).toThrow("Product not found");
    });
});
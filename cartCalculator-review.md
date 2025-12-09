## DESIGN PROBLEMS ##
An item should not be able to be added to cart without a price because it can cause bugs and there is no benefit in it.
cart.service.ts adds a product from the productRepo but does not add price of product.
Decouple cartCalculator from cart.service to enhance encapsulation.

## TESTABILITY CONCERNS ##
product-local.repository is impossible to mock. An interface is needed for mocking product repository.
cart.service.ts needs constructor to accept a product.repository

## RISKS FOR FUTURE MAINTAINENCE ##
There is no logging and therefore harder to debug.
product-local.repository is tightly coupled with cart-service which could make it hard if there comes a demand
for additional repositories.
There arent enough tests to ensure the program works in edge cases.
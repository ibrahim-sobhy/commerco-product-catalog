# Messy-code — Readability Review

This documents **my analysis** of the provided *“messy-code”* CLI shop example.

The focus of this review is **readability and maintainability**, rather than functional correctness.  
The code works as intended; however, a number of design and structural choices make it harder to read, reason about, and safely modify.

In total, **30 distinct readability issues** were identified.  
Each issue below explains:

- what the issue is  
- where it appears  
- why it affects readability or maintainability  
- how it could be improved conceptually  

The aim is not to “perfect” the code, but to demonstrate how clearer structure and more explicit intent can reduce cognitive load for future readers.

---

## 1) `products` typed as `any`

**Where**
```ts
let products: any = [];
````

**What this is**
Using `any` removes all structural information. From a reader’s perspective, `products` becomes “an array of unknown things”.

**Why it affects readability**
A reader cannot tell what constitutes a product without scanning the rest of the file and inferring structure from usage. They cannot quickly form a clear mental model such as “a product has an id, a name, a price, and stock”.

**What the reader is forced to do**
Reconstruct the product shape manually by observing repeated access patterns:

```ts
products[i].id
products[i].name
products[i].price
products[i].stock
products[i].category
```

**Improvement direction**
Declare the data model explicitly so it is visible in one place:

```ts
interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
  desc: string;
}

let products: Product[] = [];
```

---

## 2) `cart` typed as `any`

**Where**

```ts
let cart: any = [];
```

**What this is**
The cart has no declared structure. It is unclear whether it stores product IDs, full product objects, quantities, or some combination thereof.

**Why it affects readability**
The cart is a core concept in the application. If its structure is implicit, every cart-related operation becomes harder to follow and reason about.

**What the reader is forced to do**
Infer the structure from later usage:

```ts
cart[i].product.price
cart[i].qty
```

**Improvement direction**

```ts
interface CartItem {
  product: Product;
  qty: number;
}

let cart: CartItem[] = [];
```

---

## 3) `user` typed as `any`

**Where**

```ts
let user: any = null;
```

**What this is**
The shape of the user object is not declared. Properties such as `name`, `pass`, and `isAdmin` are discovered only through usage.

**Why it affects readability**
Authentication, authorisation, and control flow depend on user state. If that state is unclear, the surrounding logic is also harder to reason about.

**Improvement direction**

```ts
interface User {
  name: string;
  pass: string;
  isAdmin: boolean;
}

let user: User | null = null;
```

---

## 4) Product model defined only “by example”

**Where**

```ts
products.push({
  id: 1,
  name: "Laptop",
  price: 999.99,
  stock: 5,
  category: "electronics",
  desc: "A laptop"
});
```

**What this is**
The product structure is implied by repeated object literals rather than declared explicitly.

**Why it affects readability**

* There is no single, authoritative definition of a product
* It is unclear which fields are required versus incidental

**Improvement direction**
Declare a `Product` model once and require all product data to conform to it.

---

## 5) Cart item model is undocumented

**Where**

```ts
cart.push({ product: products[i], qty: quantity });
```

**What this is**
The cart item exists only as an inline object, not as a named concept.

**Why it affects readability**
Readers must remember from context that cart items always contain a product and a quantity, increasing cognitive load.

---

## 6) User model created via inline object literals

**Where**

```ts
user = { name: username, pass: password, isAdmin: username == "admin" };
```

**What this is**
User creation embeds assumptions about structure and permissions directly in-line.

**Why it affects readability**
User-related rules are scattered. If the user model changes later, every creation site must be updated manually.

---

## 7) Misleading global `totalPrice`

**Where**

```ts
let totalPrice = 0;
```

**What this is**
A global variable that suggests a central pricing state.

**Why it affects readability**
Totals are recalculated locally elsewhere, creating uncertainty about the true source of pricing data.

---

## 8) Unused global `discountApplied`

**Where**

```ts
let discountApplied = false;
```

**What this is**
A declared variable that has no effect on program behaviour.

**Why it affects readability**
It signals missing or incomplete logic and distracts the reader.

---

## 9) Unused global `shippingCost`

**Where**

```ts
let shippingCost = 0;
```

**What this is**
A placeholder for a feature that is not implemented.

**Why it affects readability**
It becomes unclear which features are implemented and which are speculative.

---

## 10) Magic number for tax rate

**Where**

```ts
let taxRate = 0.08;
```

**What this is**
A numeric constant with no explanation.

**Why it affects readability**
The meaning of the value is not obvious to the reader.

**Improvement direction**

```ts
const DEFAULT_TAX_RATE = 0.08; // example sales tax
```

---

## 11) Magic strings for discount codes

**Where**

```ts
if (code == "SAVE10") ...
else if (code == "SAVE20") ...
```

**What this is**
Business rules embedded directly in checkout logic.

**Why it affects readability**
Rules are difficult to audit or extend, and the checkout function becomes overly dense.

---

## 12) Magic string for admin detection

**Where**

```ts
isAdmin: username == "admin"
```

**What this is**
Permissions are inferred from a hard-coded username.

**Why it affects readability**
This rule is surprising and not easily discoverable.

---

## 13) Product initialisation via repeated `push`

**Where**

```ts
products.push(...);
products.push(...);
```

**What this is**
Imperative data setup mixed with application logic.

**Why it affects readability**
Harder to scan and reason about than a single declarative list.

---

## 14) Menu options represented as raw strings

**Where**

```ts
if (answer == "1") ...
```

**What this is**
Menu behaviour is controlled by literal string values.

**Why it affects readability**
There is no central definition of the menu, making changes brittle.

---

## 15) Nested callbacks in login flow (“callback pyramid”)

**Where**
```ts
rl.question("Username: ", (username) => {
  rl.question("Password: ", (password) => {
    // ...
  });
});
````

**What this is**
Multiple callbacks nested inside one another, creating an indented “pyramid” structure.

**Why it affects readability**
This makes the “happy path” harder to see and increases the effort required to follow branching behaviour. It also obscures where the programme returns to after success or failure, because navigation calls (`start()`, `mainMenu()`) appear deep inside nested functions.

**Improvement direction**
Introduce a small `ask()` helper that wraps `rl.question` in a promise so the flow becomes linear via `async/await`.

---

## 16) Registration repeats the same nesting pattern

**Where**

```ts
rl.question("Choose username: ", (u) => {
  rl.question("Choose password: ", (p) => {
    // ...
  });
});
```

**What this is**
The same callback pyramid appears again in a second location.

**Why it affects readability**
Repetition increases maintenance burden and makes the file feel longer than it needs to be. It also signals that there is no shared abstraction for “prompting the user for input”, which would otherwise reduce noise and improve consistency.

**Improvement direction**
Use the same `ask()` helper for registration and login so all input reads consistently and is easier to follow.

---

## 17) Long `if/else` chains for menu handling

**Where**

```ts
if (opt == "1") { ... }
else if (opt == "2") { ... }
else if (opt == "3") { ... }
```

**What this is**
Menu routing implemented as a long conditional chain.

**Why it affects readability**
Readers must scan through the entire chain to understand available actions. As the application grows, the chain becomes harder to maintain and increases the chance of subtle inconsistencies (e.g. one branch returns to `mainMenu()`, another returns to `start()`).

**Improvement direction**
Use a dispatch map such as:

* `const actions = { "1": browseProducts, "2": viewCart, ... }`
  so the menu becomes a readable definition rather than an extended conditional.

---

## 18) UI flow mixed with business logic

**Where**
Examples include `mainMenu()`, `checkout()`, and `adminPanel()`, which:

* print text
* gather input
* enforce permissions
* mutate state
* decide navigation

**What this is**
Single functions doing multiple unrelated jobs.

**Why it affects readability**
When responsibilities are mixed, it becomes difficult to predict the impact of changes. For example, a small adjustment to output formatting can accidentally affect control flow, because both exist in the same block.

**Improvement direction**
Separate concerns into:

* “prompt/render” functions (UI)
* “pure” functions (pricing, searching)
* “state mutation” functions (cart/stock updates)

---

## 19) Search implemented via manual loop rather than intent-revealing logic

**Where**

```ts
let found = [];
for (let i = 0; i < products.length; i++) {
  if (products[i].name.toLowerCase().indexOf(term.toLowerCase()) != -1) {
    found.push(products[i]);
  }
}
```

**What this is**
Low-level iteration and manual filtering implemented inline.

**Why it affects readability**
The reader must parse mechanics rather than seeing the intent (“search products by name”). It also clutters the menu handler, which is already responsible for navigation and UI.

**Improvement direction**
Extract a function such as `searchProducts(term)` returning `Product[]`, which makes the menu handler shorter and more readable.

---

## 20) `indexOf(...) != -1` as a low-level idiom

**Where**

```ts
products[i].name.toLowerCase().indexOf(term.toLowerCase()) != -1
```

**What this is**
A common but low-level string searching idiom.

**Why it affects readability**
The reader must recall that `indexOf` returns `-1` when not found. That detail is an implementation concern, not domain logic, and it distracts from the purpose of the code.

**Improvement direction**
Use a clearer expression (conceptually: “name contains term”), preferably wrapped in a helper.

---

## 21) Temporary arrays such as `found` lack declared meaning

**Where**

```ts
let found = [];
```

**What this is**
A dynamically typed array with a generic name.

**Why it affects readability**
The variable name does not communicate whether it stores products, names, ids, or something else. With `any` elsewhere, the reader is required to infer meaning from surrounding lines.

**Improvement direction**
Use an explicit name and type (conceptually): `matchingProducts: Product[]`.

---

## 22) Manual `found` flags add cognitive overhead

**Where**

```ts
let found = false;
// ...
found = true;
```

**What this is**
A boolean used to track whether a matching product was encountered during iteration.

**Why it affects readability**
The reader must track the flag across the loop and then interpret its meaning after the loop. This makes the control flow more “stateful” than necessary.

**Improvement direction**
Use a direct lookup approach (conceptually): return the product if found, otherwise `undefined`, and handle that case explicitly.

---

## 23) `parseInt` without validation (product ID)

**Where**

```ts
let productId = parseInt(id);
```

**What this is**
User input converted to a number without checking for `NaN`.

**Why it affects readability**
The code reads as if `productId` is guaranteed to be a valid number, when it is not. This hides an assumption about user behaviour and makes error handling less clear.

**Improvement direction**
Validate input explicitly and handle invalid input with a clear message and a predictable navigation path.

---

## 24) `parseInt` without validation (quantity)

**Where**

```ts
let quantity = parseInt(qty);
```

**What this is**
Quantity is assumed numeric without enforcing it.

**Why it affects readability**
The logic that follows reads as if quantity is always valid, which reduces clarity about edge cases (empty input, non-numeric input, negative numbers).

**Improvement direction**
Introduce explicit checks such as:

* is the value a number?
* is it positive?
* is it within available stock?

---

## 25) Quantity validation incomplete

**Where**

```ts
if (quantity <= products[i].stock) {
  cart.push({ product: products[i], qty: quantity });
}
```

**What this is**
Only the upper bound is checked.

**Why it affects readability**
Key assumptions are left unstated. The code allows ambiguous behaviour for:

* `quantity === 0`
* negative values
* `NaN` (which will fail comparisons in unexpected ways)

**Improvement direction**
Write validation rules explicitly so the reader can see them directly, rather than inferring them from side-effects.

---

## 26) Cart allows duplicate items without explanation

**Where**

```ts
cart.push({ product: products[i], qty: quantity });
```

**What this is**
Each add-to-cart operation creates a new entry, even if the product is already in the cart.

**Why it affects readability**
The cart model becomes less intuitive: readers must remember that there may be multiple entries for the same product. This complicates later pricing and stock update logic.

**Improvement direction**
Either:

* merge duplicates (increase quantity), or
* explicitly document that duplicates are allowed and why.

---

## 27) Recursive-style navigation obscures user flow

**Where**

```ts
browseProducts();
```

**What this is**
Using function calls to represent “screens” and “navigation”.

**Why it affects readability**
The programme reads like recursive computation rather than a linear CLI flow. Readers must mentally model “where am I now?” based on nested calls rather than a clear loop or state machine.

**Improvement direction**
Use a loop-based screen model or return consistently to a central menu controller.

---

## 28) Inconsistent navigation for unauthenticated users

**Where**

```ts
console.log("\nPlease login to add items to cart.");
start();
```

**What this is**
Unauthenticated users are redirected to `start()` rather than returning to `mainMenu()`.

**Why it affects readability**
This introduces an inconsistent flow rule. Readers and users alike expect “go back” behaviour to be predictable.

**Improvement direction**
Establish a consistent navigation strategy (e.g. always return to `mainMenu()` after an action unless exiting).

---

## 29) Stock updates implemented via nested loops

**Where**

```ts
for (let i = 0; i < cart.length; i++) {
  for (let j = 0; j < products.length; j++) {
    if (products[j].id == cart[i].product.id) {
      products[j].stock = products[j].stock - cart[i].qty;
    }
  }
}
```

**What this is**
A two-level loop used to locate products by id and reduce stock.

**Why it affects readability**
The intent (“decrement stock for purchased items”) is buried in mechanics. The reader must follow index variables and matching conditions to understand a simple domain action.

**Improvement direction**
Extract a named function (e.g. `decrementStock(cart)`) and consider direct lookup by id to avoid repeated scanning.

---

## 30) Checkout duplicates large blocks of logic

**Where**
In `checkout()`, both the “discount” and “no discount” paths repeat:

* tax calculation
* total calculation
* confirm purchase prompt
* stock update
* cart reset and navigation

**What this is**
Substantial duplicated code across branches.

**Why it affects readability**
Duplication inflates the function and forces the reader to compare branches to ensure they remain consistent. It also increases the chance of bugs where one branch is updated and the other is not.

**Improvement direction**
Compute totals once (with an optional discount adjustment), then run a single confirmation/purchase path.
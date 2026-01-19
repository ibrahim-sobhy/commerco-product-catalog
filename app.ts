import * as readline from 'readline';

let products: any = [];
let cart: any = [];
let user: any = null;
let totalPrice = 0;
let discountApplied = false;
let taxRate = 0.08;
let shippingCost = 0;

products.push({id: 1, name: "Laptop", price: 999.99, stock: 5, category: "electronics", desc: "A laptop"});
products.push({id: 2, name: "Mouse", price: 29.99, stock: 50, category: "electronics", desc: "A mouse"});
products.push({id: 3, name: "Keyboard", price: 79.99, stock: 30, category: "electronics", desc: "A keyboard"});
products.push({id: 4, name: "Chair", price: 299.99, stock: 10, category: "furniture", desc: "A chair"});
products.push({id: 5, name: "Desk", price: 499.99, stock: 8, category: "furniture", desc: "A desk"});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function start() {
  console.log("=== WELCOME TO SUPER SHOP ===");
  console.log("1. Login");
  console.log("2. Register");
  console.log("3. Browse Products");
  console.log("4. Exit");
  
  rl.question("Choose option: ", (answer) => {
    if (answer == "1") {
      rl.question("Username: ", (username) => {
        rl.question("Password: ", (password) => {
          if (username.length > 0 && password.length > 0) {
            user = {name: username, pass: password, isAdmin: username == "admin"};
            console.log("Login successful!");
            mainMenu();
          } else {
            console.log("Invalid credentials!");
            start();
          }
        });
      });
    } else if (answer == "2") {
      rl.question("Choose username: ", (u) => {
        rl.question("Choose password: ", (p) => {
          user = {name: u, pass: p, isAdmin: false};
          console.log("Registration successful!");
          mainMenu();
        });
      });
    } else if (answer == "3") {
      browseProducts();
    } else if (answer == "4") {
      console.log("Goodbye!");
      rl.close();
      process.exit(0);
    } else {
      console.log("Invalid option!");
      start();
    }
  });
}

function mainMenu() {
  console.log("\n=== MAIN MENU ===");
  console.log("1. Browse Products");
  console.log("2. View Cart");
  console.log("3. Checkout");
  console.log("4. Search Products");
  console.log("5. Admin Panel (Admin only)");
  console.log("6. Logout");
  
  rl.question("Choose option: ", (opt) => {
    if (opt == "1") {
      browseProducts();
    } else if (opt == "2") {
      viewCart();
    } else if (opt == "3") {
      checkout();
    } else if (opt == "4") {
      rl.question("Search term: ", (term) => {
        let found = [];
        for (let i = 0; i < products.length; i++) {
          if (products[i].name.toLowerCase().indexOf(term.toLowerCase()) != -1) {
            found.push(products[i]);
          }
        }
        if (found.length > 0) {
          console.log("\nSearch results:");
          for (let i = 0; i < found.length; i++) {
            console.log(`${found[i].id}. ${found[i].name} - $${found[i].price} (Stock: ${found[i].stock})`);
          }
        } else {
          console.log("No products found!");
        }
        mainMenu();
      });
    } else if (opt == "5") {
      if (user && user.isAdmin) {
        adminPanel();
      } else {
        console.log("Access denied! Admin only!");
        mainMenu();
      }
    } else if (opt == "6") {
      user = null;
      cart = [];
      totalPrice = 0;
      console.log("Logged out!");
      start();
    } else {
      console.log("Invalid option!");
      mainMenu();
    }
  });
}

function browseProducts() {
  console.log("\n=== PRODUCTS ===");
  for (let i = 0; i < products.length; i++) {
    console.log(`${products[i].id}. ${products[i].name} - $${products[i].price} (Stock: ${products[i].stock}) [${products[i].category}]`);
  }
  
  if (user) {
    rl.question("\nEnter product ID to add to cart (or 0 to go back): ", (id) => {
      let productId = parseInt(id);
      if (productId == 0) {
        mainMenu();
      } else {
        let found = false;
        for (let i = 0; i < products.length; i++) {
          if (products[i].id == productId) {
            found = true;
            if (products[i].stock > 0) {
              rl.question("Quantity: ", (qty) => {
                let quantity = parseInt(qty);
                if (quantity <= products[i].stock) {
                  cart.push({product: products[i], qty: quantity});
                  console.log(`Added ${quantity}x ${products[i].name} to cart!`);
                } else {
                  console.log("Not enough stock!");
                }
                browseProducts();
              });
              return;
            } else {
              console.log("Out of stock!");
              browseProducts();
              return;
            }
          }
        }
        if (!found) {
          console.log("Product not found!");
          browseProducts();
        }
      }
    });
  } else {
    console.log("\nPlease login to add items to cart.");
    start();
  }
}

function viewCart() {
  console.log("\n=== YOUR CART ===");
  if (cart.length == 0) {
    console.log("Cart is empty!");
    mainMenu();
    return;
  }
  
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    let itemTotal = cart[i].product.price * cart[i].qty;
    console.log(`${cart[i].product.name} x${cart[i].qty} - $${itemTotal.toFixed(2)}`);
    total = total + itemTotal;
  }
  
  console.log(`\nSubtotal: $${total.toFixed(2)}`);
  console.log(`Tax (${taxRate * 100}%): $${(total * taxRate).toFixed(2)}`);
  console.log(`Total: $${(total + (total * taxRate)).toFixed(2)}`);
  
  mainMenu();
}

function checkout() {
  if (cart.length == 0) {
    console.log("Cart is empty!");
    mainMenu();
    return;
  }
  
  let subtotal = 0;
  for (let i = 0; i < cart.length; i++) {
    subtotal = subtotal + (cart[i].product.price * cart[i].qty);
  }
  
  console.log("\n=== CHECKOUT ===");
  console.log(`Subtotal: $${subtotal.toFixed(2)}`);
  
  rl.question("Apply discount code? (y/n): ", (ans) => {
    if (ans.toLowerCase() == "y") {
      rl.question("Enter code: ", (code) => {
        if (code == "SAVE10") {
          subtotal = subtotal * 0.9;
          console.log("10% discount applied!");
        } else if (code == "SAVE20") {
          subtotal = subtotal * 0.8;
          console.log("20% discount applied!");
        } else {
          console.log("Invalid code!");
        }
        
        let tax = subtotal * taxRate;
        let total = subtotal + tax;
        
        console.log(`Tax: $${tax.toFixed(2)}`);
        console.log(`Total: $${total.toFixed(2)}`);
        
        rl.question("Confirm purchase? (y/n): ", (confirm) => {
          if (confirm.toLowerCase() == "y") {
            for (let i = 0; i < cart.length; i++) {
              for (let j = 0; j < products.length; j++) {
                if (products[j].id == cart[i].product.id) {
                  products[j].stock = products[j].stock - cart[i].qty;
                }
              }
            }
            console.log("\nPurchase successful! Thank you for shopping!");
            cart = [];
            mainMenu();
          } else {
            console.log("Purchase cancelled!");
            mainMenu();
          }
        });
      });
    } else {
      let tax = subtotal * taxRate;
      let total = subtotal + tax;
      
      console.log(`Tax: $${tax.toFixed(2)}`);
      console.log(`Total: $${total.toFixed(2)}`);
      
      rl.question("Confirm purchase? (y/n): ", (confirm) => {
        if (confirm.toLowerCase() == "y") {
          for (let i = 0; i < cart.length; i++) {
            for (let j = 0; j < products.length; j++) {
              if (products[j].id == cart[i].product.id) {
                products[j].stock = products[j].stock - cart[i].qty;
              }
            }
          }
          console.log("\nPurchase successful! Thank you for shopping!");
          cart = [];
          mainMenu();
        } else {
          console.log("Purchase cancelled!");
          mainMenu();
        }
      });
    }
  });
}

function adminPanel() {
  console.log("\n=== ADMIN PANEL ===");
  console.log("1. Add Product");
  console.log("2. Remove Product");
  console.log("3. Update Stock");
  console.log("4. View All Products");
  console.log("5. Back");
  
  rl.question("Choose option: ", (opt) => {
    if (opt == "1") {
      rl.question("Product name: ", (name) => {
        rl.question("Price: ", (price) => {
          rl.question("Stock: ", (stock) => {
            rl.question("Category: ", (cat) => {
              let newId = products.length + 1;
              products.push({
                id: newId,
                name: name,
                price: parseFloat(price),
                stock: parseInt(stock),
                category: cat,
                desc: "No description"
              });
              console.log("Product added!");
              adminPanel();
            });
          });
        });
      });
    } else if (opt == "2") {
      rl.question("Product ID to remove: ", (id) => {
        let productId = parseInt(id);
        for (let i = 0; i < products.length; i++) {
          if (products[i].id == productId) {
            products.splice(i, 1);
            console.log("Product removed!");
            break;
          }
        }
        adminPanel();
      });
    } else if (opt == "3") {
      rl.question("Product ID: ", (id) => {
        rl.question("New stock amount: ", (stock) => {
          let productId = parseInt(id);
          for (let i = 0; i < products.length; i++) {
            if (products[i].id == productId) {
              products[i].stock = parseInt(stock);
              console.log("Stock updated!");
            }
          }
          adminPanel();
        });
      });
    } else if (opt == "4") {
      console.log("\n=== ALL PRODUCTS ===");
      for (let i = 0; i < products.length; i++) {
        console.log(`ID: ${products[i].id}, Name: ${products[i].name}, Price: $${products[i].price}, Stock: ${products[i].stock}, Category: ${products[i].category}`);
      }
      adminPanel();
    } else if (opt == "5") {
      mainMenu();
    } else {
      console.log("Invalid option!");
      adminPanel();
    }
  });
}

start();
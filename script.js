const cartContainer = document.getElementById("cart-container");
const productsContainer = document.getElementById("products-container");
const dessertCards = document.getElementById("dessert-card-container");
const cartBtn = document.getElementById("cart-btn");
const clearCartBtn = document.getElementById("clear-cart-btn");
const totalNumberOfItems = document.getElementById("total-items");
const cartSubTotal = document.getElementById("subtotal");
const cartTaxes = document.getElementById("taxes");
const cartTotal = document.getElementById("total");
const showHideCartSpan = document.getElementById("show-hide-cart");
let isCartShowing = false;

// Adjusted products array with prices for Malaysia
const products = [
  { id: 1, name: "Vanilla Cupcakes (6 Pack)", price: 15, category: "Cupcake" },
  { id: 2, name: "French Macaroon", price: 4, category: "Macaroon" },
  { id: 3, name: "Pumpkin Cupcake", price: 4, category: "Cupcake" },
  { id: 4, name: "Chocolate Cupcake", price: 6, category: "Cupcake" },
  { id: 5, name: "Chocolate Pretzels (4 Pack)", price: 12, category: "Pretzel" },
  { id: 6, name: "Strawberry Ice Cream", price: 3, category: "Ice Cream" },
  { id: 7, name: "Chocolate Macaroons (4 Pack)", price: 10, category: "Macaroon" },
  { id: 8, name: "Strawberry Pretzel", price: 5, category: "Pretzel" },
  { id: 9, name: "Butter Pecan Ice Cream", price: 3, category: "Ice Cream" },
  { id: 10, name: "Rocky Road Ice Cream", price: 3, category: "Ice Cream" },
  { id: 11, name: "Vanilla Macaroons (5 Pack)", price: 12, category: "Macaroon" },
  { id: 12, name: "Lemon Cupcakes (4 Pack)", price: 15, category: "Cupcake" },
];

// Render products with RM currency
products.forEach(({ name, id, price, category }) => {
  dessertCards.innerHTML += `
    <div class="dessert-card">
      <h2>${name}</h2>
      <p class="dessert-price">RM${price}</p>
      <p class="product-category">Category: ${category}</p>
      <button id="${id}" class="btn add-to-cart-btn">Add to cart</button>
    </div>
  `;
});

class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0;
    this.taxRate = 6; // Updated tax rate for Malaysia
  }

  addItem(id, products) {
    const product = products.find(item => item.id === id);
    this.items.push(product);

    const totalCountPerProduct = this.items.reduce((acc, { id }) => ({
      ...acc,
      [id]: (acc[id] || 0) + 1,
    }), {});

    const currentProductCount = totalCountPerProduct[id];
    const currentProductCountSpan = document.getElementById(`product-count-for-id${id}`);
    
    if (currentProductCount > 1) {
      currentProductCountSpan.textContent = `${currentProductCount}x`;
    } else {
      productsContainer.innerHTML += `
        <div id="dessert${id}" class="product">
          <p>
            <span class="product-count" id="product-count-for-id${id}">1x</span>
            ${product.name}
          </p>
          <p>RM${product.price}</p>
        </div>
      `;
    }

    this.updateCart();
  }

  getCounts() {
    return this.items.length;
  }

  clearCart() {
    if (!this.items.length) {
      alert("Your shopping cart is already empty.");
      return;
    }

    if (confirm("Are you sure you want to clear all items from your shopping cart?")) {
      this.items = [];
      productsContainer.innerHTML = "";
      this.updateCart();
    }
  }

  calculateTaxes(amount) {
    return parseFloat(((this.taxRate / 100) * amount).toFixed(2));
  }

  calculateTotal() {
    const subTotal = this.items.reduce((total, item) => total + item.price, 0);
    const tax = this.calculateTaxes(subTotal);
    this.total = subTotal + tax;

    cartSubTotal.textContent = `RM${subTotal.toFixed(2)}`;
    cartTaxes.textContent = `RM${tax.toFixed(2)}`;
    cartTotal.textContent = `RM${this.total.toFixed(2)}`;
  }

  updateCart() {
    totalNumberOfItems.textContent = this.getCounts();
    this.calculateTotal();
  }
}

const cart = new ShoppingCart();

Array.from(document.getElementsByClassName("add-to-cart-btn")).forEach(btn => {
  btn.addEventListener("click", event => {
    const id = Number(event.target.id);
    cart.addItem(id, products);
  });
});

cartBtn.addEventListener("click", () => {
  isCartShowing = !isCartShowing;
  showHideCartSpan.textContent = isCartShowing ? "Hide" : "Show";
  cartContainer.style.display = isCartShowing ? "block" : "none";
});

clearCartBtn.addEventListener("click", () => cart.clearCart());

/* =========================================================
   STYLE DOCK — COMPLETE APP.JS
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Premium Oversized T-Shirt",
    category: "Men",
    type: "T-Shirts",
    price: 599,
    oldPrice: 799,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 2,
    name: "Classic Baggy Jeans",
    category: "Men",
    type: "Jeans",
    price: 699,
    oldPrice: 1099,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black"],
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 3,
    name: "Elegant Women's Kurti",
    category: "Women",
    type: "Kurtis",
    price: 799,
    oldPrice: 1199,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Green", "Pink", "Black"],
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 4,
    name: "Women's Western Dress",
    category: "Women",
    type: "Western",
    price: 999,
    oldPrice: 1499,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Blue"],
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 5,
    name: "Stylish Cargo Pants",
    category: "Men",
    type: "Cargos",
    price: 899,
    oldPrice: 1299,
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Olive", "Black", "Beige"],
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 6,
    name: "Women's Cotton Top",
    category: "Women",
    type: "Tops",
    price: 499,
    oldPrice: 699,
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Pink", "Black"],
    image:
      "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 7,
    name: "Kids Casual Outfit",
    category: "Kids",
    type: "Kids Wear",
    price: 699,
    oldPrice: 999,
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    colors: ["Blue", "Yellow", "Black"],
    image:
      "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 8,
    name: "Premium Casual Shirt",
    category: "Men",
    type: "Shirts",
    price: 799,
    oldPrice: 1099,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White", "Blue", "Black"],
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85"
  }
];


/* =========================================================
   GLOBAL STATE
   ========================================================= */

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("styleDockCart")) || [];
} catch (error) {
  cart = [];
}


/* =========================================================
   DOM HELPERS
   ========================================================= */

function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return Array.from(document.querySelectorAll(selector));
}


/* =========================================================
   SAVE CART
   ========================================================= */

function saveCart() {
  localStorage.setItem("styleDockCart", JSON.stringify(cart));
  updateCartCount();
}


/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {
  const count = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  $$(".cart-count").forEach((element) => {
    element.textContent = count;
  });
}


/* =========================================================
   PRODUCT DISCOUNT
   ========================================================= */

function getDiscount(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) {
    return 0;
  }

  return Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function productCard(product) {
  const discount = getDiscount(product);

  return `
    <article class="product-card" data-product-id="${product.id}">

      <div class="product-image-wrap">

        ${
          discount
            ? `<span class="discount-badge">${discount}% OFF</span>`
            : ""
        }

        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.src='https://via.placeholder.com/700x900?text=STYLE+DOCK'"
        >

        <button
          class="quick-view-btn"
          type="button"
          onclick="openProduct(${product.id})"
        >
          Quick View
        </button>

      </div>

      <div class="product-info">

        <div class="product-category">
          ${product.category} • ${product.type}
        </div>

        <h3>${product.name}</h3>

        <div class="product-price">
          <strong>₹${product.price}</strong>

          ${
            product.oldPrice
              ? `<span class="old-price">₹${product.oldPrice}</span>`
              : ""
          }
        </div>

        <button
          class="add-cart-btn"
          type="button"
          onclick="addToCart(${product.id})"
        >
          Add to Cart
        </button>

      </div>

    </article>
  `;
}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(list = PRODUCTS) {
  const container =
    $("#productsGrid") ||
    $(".products-grid") ||
    $("#productGrid");

  if (!container) {
    console.warn("Product grid not found.");
    return;
  }

  if (!list.length) {
    container.innerHTML = `
      <div class="empty-products">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = list.map(productCard).join("");
}


/* =========================================================
   FILTER PRODUCTS
   ========================================================= */

function filterProducts() {
  const searchInput =
    $("#searchInput") ||
    $("#search") ||
    document.querySelector('input[type="search"]');

  const searchText = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  const activeButton =
    document.querySelector(".category-btn.active") ||
    document.querySelector(".filter-btn.active");

  const category =
    activeButton?.dataset.category ||
    activeButton?.dataset.filter ||
    "All";

  let filtered = PRODUCTS.filter((product) => {

    const matchesSearch =
      !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.type.toLowerCase().includes(searchText);

    const matchesCategory =
      category === "All" ||
      category === "all" ||
      product.category === category ||
      product.type === category;

    return matchesSearch && matchesCategory;
  });

  const sortSelect =
    $("#sortSelect") ||
    $("#sortProducts") ||
    document.querySelector(".sort-select");

  if (sortSelect) {
    const sort = sortSelect.value;

    if (sort === "low") {
      filtered.sort((a, b) => a.price - b.price);
    }

    if (sort === "high") {
      filtered.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      filtered.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }
  }

  renderProducts(filtered);
}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategoryButtons() {
  const buttons = $$(".category-btn, .filter-btn");

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      filterProducts();
    });

  });
}


/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {
  const inputs = $$(
    "#searchInput, #search, input[type='search']"
  );

  inputs.forEach((input) => {
    input.addEventListener("input", filterProducts);
  });
}


/* =========================================================
   SORT
   ========================================================= */

function setupSort() {
  const select =
    $("#sortSelect") ||
    $("#sortProducts") ||
    document.querySelector(".sort-select");

  if (select) {
    select.addEventListener("change", filterProducts);
  }
}


/* =========================================================
   OPEN PRODUCT
   ========================================================= */

function openProduct(productId) {

  const product = PRODUCTS.find(
    (p) => p.id === Number(productId)
  );

  if (!product) {
    showToast("Product not found.");
    return;
  }

  const productModal =
    $("#productModal") ||
    $(".product-modal");

  const modalContent =
    $("#modalContent") ||
    $(".modal-content-area");

  if (!productModal || !modalContent) {
    showToast("Product window could not open.");
    return;
  }

  currentProduct = product;

  selectedSize =
    product.sizes && product.sizes.length
      ? product.sizes[0]
      : null;

  selectedColor =
    product.colors && product.colors.length
      ? product.colors[0]
      : null;

  const discount = getDiscount(product);

  modalContent.innerHTML = `
    <div class="product-modal-inner">

      <button
        class="modal-close"
        type="button"
        onclick="closeProductModal()"
        aria-label="Close"
      >
        ×
      </button>

      <div class="product-modal-grid">

        <div class="modal-image-area">

          ${
            discount
              ? `<span class="discount-badge">${discount}% OFF</span>`
              : ""
          }

          <img
            src="${product.image}"
            alt="${product.name}"
            class="modal-product-image"
            onerror="this.src='https://via.placeholder.com/700x900?text=STYLE+DOCK'"
          >

        </div>

        <div class="modal-product-details">

          <div class="product-category">
            ${product.category} • ${product.type}
          </div>

          <h2>${product.name}</h2>

          <div class="modal-price">

            <strong>₹${product.price}</strong>

            ${
              product.oldPrice
                ? `<span class="old-price">₹${product.oldPrice}</span>`
                : ""
            }

            ${
              discount
                ? `<span class="save-text">Save ${discount}%</span>`
                : ""
            }

          </div>

          ${
            product.sizes?.length
              ? `
                <div class="option-section">
                  <h4>Select Size</h4>

                  <div class="option-list">
                    ${product.sizes
                      .map(
                        (size, index) => `
                          <button
                            type="button"
                            class="option-btn size-option ${
                              index === 0 ? "selected" : ""
                            }"
                            data-size="${size}"
                            onclick="selectSize('${size}')"
                          >
                            ${size}
                          </button>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              `
              : ""
          }

          ${
            product.colors?.length
              ? `
                <div class="option-section">
                  <h4>Select Color</h4>

                  <div class="option-list">
                    ${product.colors
                      .map(
                        (color, index) => `
                          <button
                            type="button"
                            class="option-btn color-option ${
                              index === 0 ? "selected" : ""
                            }"
                            data-color="${color}"
                            onclick="selectColor('${color}')"
                          >
                            ${color}
                          </button>
                        `
                      )
                      .join("")}
                  </div>
                </div>
              `
              : ""
          }

          <div class="modal-actions">

            <button
              type="button"
              class="primary-btn"
              onclick="addCurrentProductToCart()"
            >
              Add to Cart
            </button>

            <button
              type="button"
              class="whatsapp-btn"
              onclick="buyCurrentProductOnWhatsApp()"
            >
              Buy on WhatsApp
            </button>

          </div>

          <div class="product-note">
            ✓ Fixed Price Store<br>
            ✓ Premium Quality<br>
            ✓ Easy WhatsApp Ordering
          </div>

        </div>

      </div>

    </div>
  `;

  productModal.hidden = false;
  productModal.classList.add("open");

  document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE PRODUCT MODAL
   ========================================================= */

function closeProductModal() {

  const modal =
    $("#productModal") ||
    $(".product-modal");

  if (!modal) return;

  modal.hidden = true;
  modal.classList.remove("open");

  document.body.style.overflow = "";
}


/* =========================================================
   SIZE SELECT
   ========================================================= */

function selectSize(size) {

  selectedSize = size;

  $$(".size-option").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.size === size
    );
  });
}


/* =========================================================
   COLOR SELECT
   ========================================================= */

function selectColor(color) {

  selectedColor = color;

  $$(".color-option").forEach((button) => {
    button.classList.toggle(
      "selected",
      button.dataset.color === color
    );
  });
}


/* =========================================================
   ADD CURRENT PRODUCT TO CART
   ========================================================= */

function addCurrentProductToCart() {

  if (!currentProduct) {
    showToast("Product not found.");
    return;
  }

  addToCart(
    currentProduct.id,
    selectedSize,
    selectedColor
  );

  closeProductModal();
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(productId, size = null, color = null) {
  const product = PRODUCTS.find(
    (p) => p.id === Number(productId)
  );

  if (!product) {
    showToast("Product not found.");
    return;
  }

  if (!size && product.sizes?.length) {
    size = product.sizes[0];
  }

  if (!color && product.colors?.length) {
    color = product.colors[0];
  }

  const existing = cart.find(
    (item) =>
      Number(item.productId) === product.id &&
      item.size === size &&
      item.color === color
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      productId: product.id,
      size,
      color,
      quantity: 1
    });
  }

  saveCart();

  renderCart();

  showToast(`${product.name} added to cart.`);
}


/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(index) {

  if (index < 0 || index >= cart.length) {
    return;
  }

  cart.splice(index, 1);

  saveCart();
  renderCart();
}


/* =========================================================
   CHANGE CART QUANTITY
   ========================================================= */

function changeCartQuantity(index, change) {

  const item = cart[index];

  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
}


/* =========================================================
   CART TOTAL
   ========================================================= */

function getCartTotal() {

  return cart.reduce((total, item) => {

    const product = PRODUCTS.find(
      (p) => p.id === Number(item.productId)
    );

    if (!product) return total;

    return total + product.price * item.quantity;

  }, 0);
}


/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {

  const cartContainer =
    $("#cartItems") ||
    $(".cart-items");

  const cartTotal =
    $("#cartTotal") ||
    $(".cart-total");

  if (!cartContainer) {
    updateCartCount();
    return;
  }

  if (!cart.length) {

    cartContainer.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Add something you love from STYLE DOCK.</p>
      </div>
    `;

    if (cartTotal) {
      cartTotal.textContent = "₹0";
    }

    updateCartCount();

    return;
  }

  cartContainer.innerHTML = cart
    .map((item, index) => {

      const product = PRODUCTS.find(
        (p) => p.id === Number(item.productId)
      );

      if (!product) return "";

      return `
        <div class="cart-item">

          <img
            src="${product.image}"
            alt="${product.name}"
            onerror="this.src='https://via.placeholder.com/150x180?text=STYLE+DOCK'"
          >

          <div class="cart-item-info">

            <h4>${product.name}</h4>

            <div class="cart-meta">
              ${
                item.size
                  ? `Size: ${item.size}`
                  : ""
              }

              ${
                item.color
                  ? ` • Color: ${item.color}`
                  : ""
              }
            </div>

            <strong>₹${product.price}</strong>

            <div class="quantity-controls">

              <button
                type="button"
                onclick="changeCartQuantity(${index}, -1)"
              >
                −
              </button>

              <span>${item.quantity}</span>

              <button
                type="button"
                onclick="changeCartQuantity(${index}, 1)"
              >
                +
              </button>

            </div>

            <button
              type="button"
              class="remove-cart-btn"
              onclick="removeFromCart(${index})"
            >
              Remove
            </button>

          </div>

        </div>
      `;

    })
    .join("");

  if (cartTotal) {
    cartTotal.textContent =
      `₹${getCartTotal().toLocaleString("en-IN")}`;
  }

  updateCartCount();
}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

  const cartModal =
    $("#cartModal") ||
    $(".cart-modal");

  if (!cartModal) {
    renderCart();
    return;
  }

  renderCart();

  cartModal.hidden = false;
  cartModal.classList.add("open");

  document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

  const cartModal =
    $("#cartModal") ||
    $(".cart-modal");

  if (!cartModal) return;

  cartModal.hidden = true;
  cartModal.classList.remove("open");

  document.body.style.overflow = "";
}


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function orderOnWhatsApp() {

  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const phone = "918881717710";

  let message =
    "Hello STYLE DOCK!%0A%0A" +
    "I want to order:%0A%0A";

  cart.forEach((item, index) => {

    const product = PRODUCTS.find(
      (p) => p.id === Number(item.productId)
    );

    if (!product) return;

    message +=
      `${index + 1}. ${product.name}%0A` +
      `Price: ₹${product.price}%0A` +
      `Qty: ${item.quantity}%0A` +
      `${item.size ? `Size: ${item.size}%0A` : ""}` +
      `${item.color ? `Color: ${item.color}%0A` : ""}` +
      `%0A`;
  });

  message +=
    `Total: ₹${getCartTotal().toLocaleString("en-IN")}%0A%0A` +
    "Please confirm availability.";

  const url =
    `https://wa.me/${phone}?text=${message}`;

  window.open(url, "_blank");
}


/* =========================================================
   BUY CURRENT PRODUCT ON WHATSAPP
   ========================================================= */

function buyCurrentProductOnWhatsApp() {

  if (!currentProduct) {
    showToast("Product not found.");
    return;
  }

  const phone = "918881717710";

  let message =
    "Hello STYLE DOCK!%0A%0A" +
    "I want to buy:%0A%0A" +
    `Product: ${currentProduct.name}%0A` +
    `Price: ₹${currentProduct.price}%0A` +
    `${selectedSize ? `Size: ${selectedSize}%0A` : ""}` +
    `${selectedColor ? `Color: ${selectedColor}%0A` : ""}` +
    `%0APlease confirm availability.`;

  window.open(
    `https://wa.me/${phone}?text=${message}`,
    "_blank"
  );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  let toast = $("#styleDockToast");

  if (!toast) {

    toast = document.createElement("div");

    toast.id = "styleDockToast";

    toast.style.cssText = `
      position:fixed;
      left:50%;
      bottom:25px;
      transform:translateX(-50%);
      z-index:99999;
      background:#171717;
      color:#fff;
      padding:13px 20px;
      border-radius:999px;
      font-size:14px;
      font-weight:600;
      box-shadow:0 10px 30px rgba(0,0,0,.25);
      opacity:0;
      transition:all .25s ease;
      pointer-events:none;
    `;

    document.body.appendChild(toast);
  }

  toast.textContent = message;

  toast.style.opacity = "1";
  toast.style.bottom = "35px";

  clearTimeout(toast._timer);

  toast._timer = setTimeout(() => {

    toast.style.opacity = "0";
    toast.style.bottom = "25px";

  }, 2200);
}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {

  const menuButton =
    $("#menuButton") ||
    $(".menu-button") ||
    $(".hamburger");

  const menu =
    $("#mobileMenu") ||
    $(".mobile-menu");

  if (!menuButton || !menu) return;

  menuButton.addEventListener("click", () => {
    menu.classList.toggle("open");
  });
}


/* =========================================================
   MODAL BACKDROP CLICK
   ========================================================= */

function setupModalClose() {

  const productModal =
    $("#productModal") ||
    $(".product-modal");

  if (productModal) {

    productModal.addEventListener("click", (event) => {

      if (event.target === productModal) {
        closeProductModal();
      }

    });
  }

  const cartModal =
    $("#cartModal") ||
    $(".cart-modal");

  if (cartModal) {

    cartModal.addEventListener("click", (event) => {

      if (event.target === cartModal) {
        closeCart();
      }

    });
  }
}


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener("keydown", (event) => {

  if (event.key !== "Escape") return;

  closeProductModal();
  closeCart();

});


/* =========================================================
   GLOBAL BUTTON CONNECTIONS
   ========================================================= */

function setupCartButtons() {

  $$(
    "#cartButton, .cart-button, [data-cart-button]"
  ).forEach((button) => {

    button.addEventListener("click", openCart);

  });

  $$(
    "#checkoutButton, .checkout-button, [data-checkout]"
  ).forEach((button) => {

    button.addEventListener(
      "click",
      orderOnWhatsApp
    );

  });

}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initStyleDock() {

  renderProducts(PRODUCTS);

  renderCart();

  updateCartCount();

  setupCategoryButtons();

  setupSearch();

  setupSort();

  setupMobileMenu();

  setupModalClose();

  setupCartButtons();

}


/* =========================================================
   DOM READY
   ========================================================= */

if (document.readyState === "loading") {

  document.addEventListener(
    "DOMContentLoaded",
    initStyleDock
  );

} else {

  initStyleDock();

}


/* =========================================================
   GLOBAL EXPORTS
   ========================================================= */

window.PRODUCTS = PRODUCTS;

window.openProduct = openProduct;
window.closeProductModal = closeProductModal;

window.selectSize = selectSize;
window.selectColor = selectColor;

window.addToCart = addToCart;
window.addCurrentProductToCart =
  addCurrentProductToCart;

window.removeFromCart = removeFromCart;
window.changeCartQuantity =
  changeCartQuantity;

window.openCart = openCart;
window.closeCart = closeCart;

window.orderOnWhatsApp =
  orderOnWhatsApp;

window.buyCurrentProductOnWhatsApp =
  buyCurrentProductOnWhatsApp;

window.filterProducts =
  filterProducts;
window.showToast =
  showToast;

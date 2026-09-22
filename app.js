/* =========================================================
   STYLE DOCK — APP.JS
   Complete Store + Cart + Checkout + Auth UI
   ========================================================= */

"use strict";

/* =========================================================
   HELPERS
   ========================================================= */

const $ = (id) => document.getElementById(id);

const money = (value) =>
  "₹" + Number(value || 0).toLocaleString("en-IN");

function escapeHTML(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showToast(message) {
  let toast = $("tsdToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "tsdToast";

    toast.style.cssText = `
      position:fixed;
      left:50%;
      bottom:24px;
      transform:translateX(-50%) translateY(20px);
      z-index:99999;
      background:#111;
      color:#fff;
      padding:12px 18px;
      border-radius:999px;
      font-size:14px;
      line-height:1.3;
      box-shadow:0 10px 30px rgba(0,0,0,.25);
      opacity:0;
      pointer-events:none;
      transition:.25s ease;
      max-width:90vw;
      text-align:center;
    `;

    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = "1";
  toast.style.transform = "translateX(-50%) translateY(0)";

  clearTimeout(window.__tsdToastTimer);

  window.__tsdToastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2600);
}

/* =========================================================
   PRODUCTS
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Premium Oversized T-Shirt",
    category: "Men",
    subcategory: "Tees",
    price: 599,
    oldPrice: 799,
    image: "images/oversized-tshirt.jpg",
    description:
      "Premium oversized fit T-shirt made for everyday streetwear style.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "White"],
    badge: "Trending"
  },

  {
    id: 2,
    name: "Classic Baggy Jeans",
    category: "Men",
    subcategory: "Jeans",
    price: 699,
    oldPrice: 1099,
    image: "images/baggy-jeans.jpg",
    description:
      "Relaxed baggy-fit denim with a comfortable everyday silhouette.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue", "Black"],
    badge: "Best Seller"
  },

  {
    id: 3,
    name: "Elegant Women's Kurti",
    category: "Women",
    subcategory: "Kurtis",
    price: 799,
    oldPrice: 1199,
    image: "images/womens-kurti.jpg",
    description:
      "Elegant everyday kurti designed for comfort with a premium look.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Maroon", "Black", "Pink"],
    badge: "New"
  },

  {
    id: 4,
    name: "Women's Western Dress",
    category: "Women",
    subcategory: "Western",
    price: 999,
    oldPrice: 1499,
    image: "images/western-dress.jpg",
    description:
      "Stylish western dress with a modern silhouette for casual outings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Blue"],
    badge: "Trending"
  },

  {
    id: 5,
    name: "Stylish Cargo Pants",
    category: "Men",
    subcategory: "Cargos",
    price: 899,
    oldPrice: 1299,
    image: "images/cargo-pants.jpg",
    description:
      "Utility-inspired cargo pants with a modern relaxed fit.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Black", "Olive", "Beige"],
    badge: "Popular"
  },

  {
    id: 6,
    name: "Women's Cotton Top",
    category: "Women",
    subcategory: "Tops",
    price: 499,
    oldPrice: 699,
    image: "images/cotton-top.jpg",
    description:
      "Soft cotton top with an easy everyday fit.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Pink", "Black"],
    badge: "Value Pick"
  },

  {
    id: 8,
    name: "Premium Casual Shirt",
    category: "Men",
    subcategory: "Shirts",
    price: 799,
    oldPrice: 1099,
    image: "images/casual-shirt.jpg",
    description:
      "Premium casual shirt designed for smart everyday styling.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Black", "Blue"],
    badge: "New"
  }
];

/* =========================================================
   CART
   ========================================================= */

const CART_KEY = "STYLE_DOCK_CART";

let cart = [];

try {
  const savedCart = localStorage.getItem(CART_KEY);

  if (savedCart) {
    const parsed = JSON.parse(savedCart);

    if (Array.isArray(parsed)) {
      cart = parsed;
    }
  }
} catch (error) {
  console.warn("Could not load cart:", error);
  cart = [];
}

/* =========================================================
   STORE STATE
   ========================================================= */

let currentCategory = "All";
let currentSearch = "";
let currentSort = "default";
let currentProductId = null;

let selectedProductSize = "";
let selectedProductColor = "";

let currentDeliveryOption = "Store Pickup";

/* =========================================================
   CART STORAGE
   ========================================================= */

function saveCart() {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.warn("Could not save cart:", error);
  }
}

/* =========================================================
   CART COUNT
   ========================================================= */

function updateCartCount() {
  const count = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const elements = [
    $("cartCount"),
    $("cart-count"),
    $("cartBadge")
  ];

  elements.forEach((element) => {
    if (element) {
      element.textContent = count;
      element.hidden = count <= 0;
    }
  });
}

/* =========================================================
   CART TOTAL
   ========================================================= */

function getCartSubtotal() {
  return cart.reduce(
    (total, item) =>
      total + Number(item.price || 0) * Number(item.quantity || 0),
    0
  );
}

/* =========================================================
   PRODUCT FINDER
   ========================================================= */

function getProduct(productId) {
  return PRODUCTS.find(
    (product) => product.id === Number(productId)
  );
}

/* =========================================================
   PRODUCT FILTERING
   ========================================================= */

function getFilteredProducts() {
  let products = [...PRODUCTS];

  if (currentCategory && currentCategory !== "All") {
    const category = currentCategory.toLowerCase();

    products = products.filter((product) => {
      return (
        product.category.toLowerCase() === category ||
        product.subcategory.toLowerCase() === category
      );
    });
  }

  if (currentSearch.trim()) {
    const query = currentSearch.trim().toLowerCase();

    products = products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.subcategory.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    });
  }

  switch (currentSort) {
    case "low":
    case "price-low":
      products.sort((a, b) => a.price - b.price);
      break;

    case "high":
    case "price-high":
      products.sort((a, b) => b.price - a.price);
      break;

    case "name":
      products.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
      break;

    case "default":
    default:
      break;
  }

  return products;
}

/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {
  const discount =
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice - product.price) /
            product.oldPrice) *
            100
        )
      : 0;

  return `
    <article class="product-card" data-product-id="${product.id}">
      <button
        type="button"
        class="product-image-btn"
        data-product-open="${product.id}"
        aria-label="View ${escapeHTML(product.name)}"
      >
        <div class="product-image-wrap">

          ${
            product.badge
              ? `<span class="product-badge">
                   ${escapeHTML(product.badge)}
                 </span>`
              : ""
          }

          <img
            class="product-image"
            src="${escapeHTML(product.image)}"
            alt="${escapeHTML(product.name)}"
            loading="lazy"
            onerror="this.style.opacity='.25';"
          />
        </div>
      </button>

      <div class="product-info">

        <p class="product-category">
          ${escapeHTML(product.subcategory)}
        </p>

        <h3 class="product-name">
          ${escapeHTML(product.name)}
        </h3>

        <div class="product-price-row">
          <strong class="product-price">
            ${money(product.price)}
          </strong>

          ${
            product.oldPrice
              ? `<del>${money(product.oldPrice)}</del>`
              : ""
          }

          ${
            discount
              ? `<span class="discount">
                   ${discount}% OFF
                 </span>`
              : ""
          }
        </div>

        <button
          type="button"
          class="btn btn-gold product-add-btn"
          data-product-add="${product.id}"
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

function renderProducts() {
  const container =
    $("productsGrid") ||
    $("productGrid") ||
    $("products");

  if (!container) return;

  const products = getFilteredProducts();

  if (!products.length) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>No products found</h3>
        <p>Try another search or category.</p>
        <button
          type="button"
          class="btn btn-gold"
          id="noResultClear"
        >
          View All Products
        </button>
      </div>
    `;

    $("noResultClear")?.addEventListener(
      "click",
      clearFilters
    );

    return;
  }

  container.innerHTML = products
    .map(createProductCard)
    .join("");

  container
    .querySelectorAll("[data-product-open]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        openProduct(button.dataset.productOpen);
      });
    });

  container
    .querySelectorAll("[data-product-add]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        const productId = Number(
          button.dataset.productAdd
        );

        openProduct(productId);
      });
    });
}

/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function openProduct(productId) {
  const product = getProduct(productId);

  if (!product) {
    showToast("Product not found.");
    return;
  }

  const modal =
    $("productModal");

  const content =
    $("modalContent") ||
    $("productModalContent");

  if (!modal || !content) {
    showToast("Product window could not open.");
    return;
  }

  currentProductId = product.id;

  selectedProductSize =
    product.sizes?.[0] || "";

  selectedProductColor =
    product.colors?.[0] || "";

  content.innerHTML = `
    <div class="product-modal-inner">

      <div class="modal-product-image">
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          onerror="this.style.opacity='.25';"
        />
      </div>

      <div class="modal-product-details">

        <p class="product-category">
          ${escapeHTML(product.category)}
          ·
          ${escapeHTML(product.subcategory)}
        </p>

        <h2>
          ${escapeHTML(product.name)}
        </h2>

        <p class="modal-description">
          ${escapeHTML(product.description)}
        </p>

        <div class="modal-price">
          <strong>${money(product.price)}</strong>
          ${
            product.oldPrice
              ? `<del>${money(product.oldPrice)}</del>`
              : ""
          }
        </div>

        ${
          product.sizes?.length
            ? `
              <div class="option-group">
                <label>Size</label>
                <div class="option-list" id="productSizeOptions">
                  ${product.sizes
                    .map(
                      (size, index) => `
                        <button
                          type="button"
                          class="option-btn ${
                            index === 0
                              ? "selected"
                              : ""
                          }"
                          data-size="${escapeHTML(size)}"
                        >
                          ${escapeHTML(size)}
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
              <div class="option-group">
                <label>Color</label>
                <div class="option-list" id="productColorOptions">
                  ${product.colors
                    .map(
                      (color, index) => `
                        <button
                          type="button"
                          class="option-btn ${
                            index === 0
                              ? "selected"
                              : ""
                          }"
                          data-color="${escapeHTML(color)}"
                        >
                          ${escapeHTML(color)}
                        </button>
                      `
                    )
                    .join("")}
                </div>
              </div>
            `
            : ""
        }

        <div class="quantity-control">
          <button
            type="button"
            id="modalQtyMinus"
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span id="modalQty">1</span>

          <button
            type="button"
            id="modalQtyPlus"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          class="btn btn-gold full"
          id="modalAddToCart"
        >
          Add to Cart
        </button>

      </div>
    </div>
  `;

  modal.hidden = false;
  document.body.style.overflow = "hidden";

  let quantity = 1;

  const qtyElement = $("modalQty");

  $("modalQtyMinus")?.addEventListener(
    "click",
    () => {
      quantity = Math.max(1, quantity - 1);

      if (qtyElement) {
        qtyElement.textContent = quantity;
      }
    }
  );

  $("modalQtyPlus")?.addEventListener(
    "click",
    () => {
      quantity++;

      if (qtyElement) {
        qtyElement.textContent = quantity;
      }
    }
  );

  document
    .querySelectorAll("[data-size]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("[data-size]")
          .forEach((item) =>
            item.classList.remove("selected")
          );

        button.classList.add("selected");

        selectedProductSize =
          button.dataset.size;
      });
    });

  document
    .querySelectorAll("[data-color]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        document
          .querySelectorAll("[data-color]")
          .forEach((item) =>
            item.classList.remove("selected")
          );

        button.classList.add("selected");

        selectedProductColor =
          button.dataset.color;
      });
    });

  $("modalAddToCart")?.addEventListener(
    "click",
    () => {
      addToCart(
        product.id,
        quantity,
        selectedProductSize,
        selectedProductColor
      );

      closeProductModal();
    }
  );
}

function closeProductModal() {
  const modal = $("productModal");

  if (!modal) return;

  modal.hidden = true;
  document.body.style.overflow = "";
}

/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
  productId,
  quantity = 1,
  size = "",
  color = ""
) {
  const product = getProduct(productId);

  if (!product) {
    showToast("Product not found.");
    return;
  }

  const qty = Math.max(
    1,
    Number(quantity) || 1
  );

  const existing = cart.find((item) => {
    return (
      Number(item.productId) === product.id &&
      String(item.size || "") === String(size || "") &&
      String(item.color || "") === String(color || "")
    );
  });

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size || "",
      color: color || "",
      quantity: qty
    });
  }

  saveCart();
  renderCart();
  updateCartCount();

  showToast(
    `${product.name} added to cart.`
  );
}

/* =========================================================
   REMOVE FROM CART
   ========================================================= */

function removeFromCart(index) {
  if (
    index < 0 ||
    index >= cart.length
  ) {
    return;
  }

  cart.splice(index, 1);

  saveCart();
  renderCart();
  updateCartCount();
}

/* =========================================================
   CHANGE CART QUANTITY
   ========================================================= */

function changeCartQuantity(index, change) {
  if (
    index < 0 ||
    index >= cart.length
  ) {
    return;
  }

  cart[index].quantity =
    Number(cart[index].quantity || 1) +
    Number(change || 0);

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  renderCart();
  updateCartCount();
}

/* =========================================================
   RENDER CART
   ========================================================= */

function renderCart() {
  const container =
    $("cartItems") ||
    $("cartList");

  const subtotalElement =
    $("cartSubtotal") ||
    $("subtotal");

  const totalElement =
    $("cartTotal") ||
    $("total");

  if (container) {
    if (!cart.length) {
      container.innerHTML = `
        <div class="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add something you love from STYLE DOCK.</p>
        </div>
      `;
    } else {
      container.innerHTML = cart
        .map(
          (item, index) => `
            <div class="cart-item">

              <div class="cart-item-image">
                <img
                  src="${escapeHTML(item.image || "")}"
                  alt="${escapeHTML(item.name)}"
                  onerror="this.style.opacity='.25';"
                />
              </div>

              <div class="cart-item-info">

                <h4>
                  ${escapeHTML(item.name)}
                </h4>

                ${
                  item.size
                    ? `<p>Size: ${escapeHTML(item.size)}</p>`
                    : ""
                }

                ${
                  item.color
                    ? `<p>Color: ${escapeHTML(item.color)}</p>`
                    : ""
                }

                <strong>
                  ${money(item.price)}
                </strong>

                <div class="cart-item-controls">

                  <button
                    type="button"
                    data-cart-minus="${index}"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>
                    ${Number(item.quantity || 1)}
                  </span>

                  <button
                    type="button"
                    data-cart-plus="${index}"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                  <button
                    type="button"
                    class="remove-cart-item"
                    data-cart-remove="${index}"
                  >
                    Remove
                  </button>

                </div>

              </div>

            </div>
          `
        )
        .join("");

      container
        .querySelectorAll("[data-cart-minus]")
        .forEach((button) => {
          button.addEventListener(
            "click",
            () =>
              changeCartQuantity(
                Number(button.dataset.cartMinus),
                -1
              )
          );
        });

      container
        .querySelectorAll("[data-cart-plus]")
        .forEach((button) => {
          button.addEventListener(
            "click",
            () =>
              changeCartQuantity(
                Number(button.dataset.cartPlus),
                1
              )
          );
        });

      container
        .querySelectorAll("[data-cart-remove]")
        .forEach((button) => {
          button.addEventListener(
            "click",
            () =>
              removeFromCart(
                Number(button.dataset.cartRemove)
              )
          );
        });
    }
  }

  const subtotal = getCartSubtotal();

  if (subtotalElement) {
    subtotalElement.textContent =
      money(subtotal);
  }

  if (totalElement) {
    totalElement.textContent =
      money(subtotal);
  }
}

/* =========================================================
   CART OPEN / CLOSE
   ========================================================= */

function openCart() {
  const cartModal =
    $("cartModal");

  const cartDrawer =
    $("cartDrawer");

  const target =
    cartModal || cartDrawer;

  if (!target) return;

  target.hidden = false;
  document.body.style.overflow = "hidden";

  renderCart();
}

function closeCart() {
  const cartModal =
    $("cartModal");

  const cartDrawer =
    $("cartDrawer");

  [cartModal, cartDrawer].forEach(
    (element) => {
      if (element) {
        element.hidden = true;
      }
    }
  );

  document.body.style.overflow = "";
}

/* =========================================================
   CHECKOUT MODAL
   ========================================================= */

function openCheckout() {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const checkoutModal =
    $("checkoutModal");

  if (!checkoutModal) {
    showToast("Checkout window could not open.");
    return;
  }

  checkoutModal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeCheckout() {
  const checkoutModal =
    $("checkoutModal");

  if (!checkoutModal) return;

  checkoutModal.hidden = true;
  document.body.style.overflow = "";
}

/* =========================================================
   DELIVERY OPTION
   ========================================================= */

function setupDeliveryOption() {
  const options =
    document.querySelectorAll(
      'input[name="deliveryOption"]'
    );

  options.forEach((input) => {
    input.addEventListener(
      "change",
      () => {
        if (input.checked) {
          currentDeliveryOption =
            input.value;
        }
      }
    );
  });
}

/* =========================================================
   CHECKOUT
   ========================================================= */

function getCheckoutValue(id) {
  const element = $(id);

  return element
    ? element.value.trim()
    : "";
}

function setupCheckout() {
  const checkoutBtn =
    $("checkoutBtn");

  const closeCheckoutBtn =
    $("closeCheckout");

  const checkoutModal =
    $("checkoutModal");

  if (checkoutBtn) {
    checkoutBtn.addEventListener(
      "click",
      openCheckout
    );
  }

  if (closeCheckoutBtn) {
    closeCheckoutBtn.addEventListener(
      "click",
      closeCheckout
    );
  }

  if (checkoutModal) {
    checkoutModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target === checkoutModal
        ) {
          closeCheckout();
        }
      }
    );
  }

  const orderBtn =
    $("placeOrderBtn") ||
    $("whatsappOrderBtn");

  if (orderBtn) {
    orderBtn.addEventListener(
      "click",
      sendWhatsAppOrder
    );
  }
}

/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function sendWhatsAppOrder() {
  if (!cart.length) {
    showToast("Your cart is empty.");
    return;
  }

  const name =
    getCheckoutValue("customerName") ||
    getCheckoutValue("checkoutName") ||
    getCheckoutValue("name");

  const mobile =
    getCheckoutValue("customerPhone") ||
    getCheckoutValue("checkoutPhone") ||
    getCheckoutValue("phone");

  const address =
    getCheckoutValue("customerAddress") ||
    getCheckoutValue("checkoutAddress") ||
    getCheckoutValue("address");

  const note =
    getCheckoutValue("customerNote") ||
    getCheckoutValue("checkoutNote") ||
    getCheckoutValue("note");

  if (!name) {
    showToast("Please enter your name.");
    return;
  }

  if (!mobile) {
    showToast("Please enter your mobile number.");
    return;
  }

  let message =
    `Hello STYLE DOCK!\n\n` +
    `*NEW ORDER*\n\n` +
    `Name: ${name}\n` +
    `Mobile: ${mobile}\n` +
    `Delivery: ${currentDeliveryOption}\n`;

  if (address) {
    message += `Address: ${address}\n`;
  }

  if (note) {
    message += `Note: ${note}\n`;
  }

  message += `\n*PRODUCTS*\n`;

  cart.forEach((item, index) => {
    message +=
      `\n${index + 1}. ${item.name}\n` +
      `Price: ${money(item.price)}\n` +
      `Quantity: ${item.quantity}\n`;

    if (item.size) {
      message += `Size: ${item.size}\n`;
    }

    if (item.color) {
      message += `Color: ${item.color}\n`;
    }
  });

  message +=
    `\n*TOTAL: ${money(getCartSubtotal())}*`;

  const whatsappNumber =
    "918881717710";

  const url =
    `https://wa.me/${whatsappNumber}?text=` +
    encodeURIComponent(message);

  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}

/* =========================================================
   CATEGORIES
   ========================================================= */

function setupCategories() {
  const categoryButtons =
    document.querySelectorAll(
      "[data-category]"
    );

  categoryButtons.forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        currentCategory =
          button.dataset.category ||
          "All";

        categoryButtons.forEach(
          (item) =>
            item.classList.remove("active")
        );

        button.classList.add("active");

        renderProducts();

        const shop =
          $("shop");

        if (shop) {
          shop.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    );
  });
}

/* =========================================================
   SEARCH
   ========================================================= */

function setupSearch() {
  const searchInput =
    $("searchInput") ||
    $("search");

  if (!searchInput) return;

  searchInput.addEventListener(
    "input",
    () => {
      currentSearch =
        searchInput.value || "";

      renderProducts();
    }
  );
}

/* =========================================================
   SORT
   ========================================================= */

function setupSort() {
  const sortSelect =
    $("sortSelect") ||
    $("sort");

  if (!sortSelect) return;

  sortSelect.addEventListener(
    "change",
    () => {
      currentSort =
        sortSelect.value || "default";

      renderProducts();
    }
  );
}

/* =========================================================
   CLEAR FILTERS
   ========================================================= */

function clearFilters() {
  currentCategory = "All";
  currentSearch = "";
  currentSort = "default";

  const searchInput =
    $("searchInput") ||
    $("search");

  if (searchInput) {
    searchInput.value = "";
  }

  const sortSelect =
    $("sortSelect") ||
    $("sort");

  if (sortSelect) {
    sortSelect.value = "default";
  }

  document
    .querySelectorAll("[data-category]")
    .forEach((button) => {
      button.classList.remove("active");

      if (
        button.dataset.category === "All"
      ) {
        button.classList.add("active");
      }
    });

  renderProducts();
}

function setupClearFilters() {
  const button =
    $("clearFilters");

  if (button) {
    button.addEventListener(
      "click",
      clearFilters
    );
  }
}

/* =========================================================
   OFFERS
   ========================================================= */

function setupOffers() {
  const offersBtn =
    $("offersBtn");

  if (!offersBtn) return;

  offersBtn.addEventListener(
    "click",
    () => {
      const offers =
        $("offers") ||
        $("offersSection");

      if (offers) {
        offers.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      } else {
        showToast(
          "Check our latest offers on Instagram @the.styledock"
        );
      }
    }
  );
}

/* =========================================================
   PRODUCT MODAL SETUP
   ========================================================= */

function setupProductModal() {
  const modal =
    $("productModal");

  const closeButton =
    $("closeProductModal") ||
    $("closeModal");

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeProductModal
    );
  }

  if (modal) {
    modal.addEventListener(
      "click",
      (event) => {
        if (event.target === modal) {
          closeProductModal();
        }
      }
    );
  }
}

/* =========================================================
   CART SETUP
   ========================================================= */

function setupCart() {
  const cartBtn =
    $("cartBtn") ||
    $("openCart");

  if (cartBtn) {
    cartBtn.addEventListener(
      "click",
      openCart
    );
  }

  const closeCartBtn =
    $("closeCart");

  if (closeCartBtn) {
    closeCartBtn.addEventListener(
      "click",
      closeCart
    );
  }

  const cartModal =
    $("cartModal");

  if (cartModal) {
    cartModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target === cartModal
        ) {
          closeCart();
        }
      }
    );
  }

  const continueShopping =
    $("continueShopping");

  if (continueShopping) {
    continueShopping.addEventListener(
      "click",
      closeCart
    );
  }
}

/* =========================================================
   AUTH — SIGN IN / SIGN UP UI
   ========================================================= */

function openAuthModal() {
  const modal =
    $("authModal");

  if (!modal) {
    showToast(
      "Sign in window is not available."
    );
    return;
  }

  modal.hidden = false;

  document.body.style.overflow =
    "hidden";

  setTimeout(() => {
    $("authPhone")?.focus();
  }, 80);
}

function closeAuthModal() {
  const modal =
    $("authModal");

  if (!modal) return;

  modal.hidden = true;

  document.body.style.overflow =
    "";
}

function setupAuthUI() {
  const authBtn =
    $("authBtn");

  const closeAuth =
    $("closeAuth");

  const authModal =
    $("authModal");

  if (authBtn) {
    authBtn.addEventListener(
      "click",
      openAuthModal
    );
  }

  if (closeAuth) {
    closeAuth.addEventListener(
      "click",
      closeAuthModal
    );
  }

  if (authModal) {
    authModal.addEventListener(
      "click",
      (event) => {
        if (
          event.target === authModal
        ) {
          closeAuthModal();
        }
      }
    );
  }
}

/* =========================================================
   KEYBOARD CONTROLS
   ========================================================= */

function setupKeyboardControls() {
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key !== "Escape") {
        return;
      }

      const authModal =
        $("authModal");

      if (
        authModal &&
        !authModal.hidden
      ) {
        closeAuthModal();
        return;
      }

      const productModal =
        $("productModal");

      if (
        productModal &&
        !productModal.hidden
      ) {
        closeProductModal();
        return;
      }

      const cartModal =
        $("cartModal");

      if (
        cartModal &&
        !cartModal.hidden
      ) {
        closeCart();
        return;
      }

      const checkoutModal =
        $("checkoutModal");

      if (
        checkoutModal &&
        !checkoutModal.hidden
      ) {
        closeCheckout();
      }
    }
  );
}

/* =========================================================
   HEADER SEARCH TOGGLE
   ========================================================= */

function setupHeaderSearch() {
  const searchButton =
    $("searchBtn");

  const searchWrap =
    $("searchWrap");

  if (
    !searchButton ||
    !searchWrap
  ) {
    return;
  }

  searchButton.addEventListener(
    "click",
    () => {
      searchWrap.classList.toggle(
        "open"
      );

      if (
        searchWrap.classList.contains(
          "open"
        )
      ) {
        (
          $("searchInput") ||
          $("search")
        )?.focus();
      }
    }
  );
}

/* =========================================================
   MOBILE MENU
   ========================================================= */

function setupMobileMenu() {
  const menuBtn =
    $("menuBtn");

  const mobileMenu =
    $("mobileMenu");

  if (!menuBtn || !mobileMenu) {
    return;
  }

  menuBtn.addEventListener(
    "click",
    () => {
      mobileMenu.classList.toggle(
        "open"
      );
    }
  );
}

/* =========================================================
   AUTH BUTTON HELPERS
   ========================================================= */

function updateAuthButtonText(text) {
  const element =
    $("authBtnText");

  if (!element) return;

  element.textContent =
    text || "Sign In / Sign Up";
}

/*
 * These functions are intentionally simple.
 * firebase-auth.js remains responsible for:
 * - sending OTP
 * - verifying OTP
 * - Firebase authentication
 * - user account state
 */

window.StyleDockAuthUI = {
  open: openAuthModal,
  close: closeAuthModal,
  setButtonText: updateAuthButtonText
};

/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.openProduct = openProduct;
window.closeProductModal =
  closeProductModal;

window.addToCart = addToCart;
window.removeFromCart =
  removeFromCart;

window.changeCartQuantity =
  changeCartQuantity;

window.renderProducts =
  renderProducts;

window.renderCart =
  renderCart;

window.updateCartCount =
  updateCartCount;

window.openCart = openCart;
window.closeCart = closeCart;

window.openCheckout =
  openCheckout;

window.closeCheckout =
  closeCheckout;

window.sendWhatsAppOrder =
  sendWhatsAppOrder;

window.clearFilters =
  clearFilters;

window.openAuthModal =
  openAuthModal;

window.closeAuthModal =
  closeAuthModal;

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initStyleDock() {
  renderProducts();
  renderCart();
  updateCartCount();

  setupCategories();
  setupSearch();
  setupSort();

  setupProductModal();
  setupCart();
  setupCheckout();
  setupDeliveryOption();

  setupOffers();
  setupClearFilters();

  setupAuthUI();
  setupKeyboardControls();

  setupHeaderSearch();
  setupMobileMenu();

  console.log(
    "STYLE DOCK website initialized."
  );
}

/* =========================================================
   START APP
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initStyleDock,
    { once: true }
  );
} else {
  initStyleDock();
}

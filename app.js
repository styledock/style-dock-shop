const WHATSAPP_NUMBER = "918881717710";

const PRODUCTS = [
  {
    id: 1,
    name: "Classic Baggy Jeans",
    category: "Jeans",
    gender: "Men",
    price: 450,
    oldPrice: 549,
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue"],
    stock: 10,
    description: "Relaxed baggy-fit jeans for an easy everyday streetwear look.",
    featured: true,
    new: true
  },
  {
    id: 2,
    name: "Premium Oversized Tee",
    category: "Tees",
    gender: "Men",
    price: 399,
    oldPrice: 499,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["White"],
    stock: 12,
    description: "Clean oversized silhouette with a comfortable everyday fit.",
    featured: true,
    new: true
  },
  {
    id: 3,
    name: "Everyday Women's Kurti",
    category: "Kurtis",
    gender: "Women",
    price: 599,
    oldPrice: 749,
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=900&q=85",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Maroon"],
    stock: 8,
    description: "Easy everyday kurti with a comfortable silhouette.",
    featured: true,
    new: false
  },
  {
    id: 4,
    name: "Relaxed Cargo Pants",
    category: "Men",
    gender: "Men",
    price: 699,
    oldPrice: 899,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Olive"],
    stock: 7,
    description: "Relaxed cargo styling with practical pockets.",
    featured: true,
    new: true
  },{
    id: 5,
    name: "Classic Casual Shirt",
    category: "Men",
    gender: "Men",
    price: 649,
    oldPrice: 799,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black"],
    stock: 9,
    description: "Versatile casual shirt for everyday outfits.",
    featured: false,
    new: true
  },
  {
    id: 6,
    name: "Women's Everyday Dress",
    category: "Women",
    gender: "Women",
    price: 799,
    oldPrice: 999,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=900&q=85",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    stock: 6,
    description: "Simple modern dress for an effortless everyday look.",
    featured: true,
    new: true
  },
  {
    id: 7,
    name: "Kids Casual Outfit",
    category: "Kids",
    gender: "Kids",
    price: 499,
    oldPrice: 649,
    image: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=900&q=85",
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    colors: ["Blue"],
    stock: 5,
    description: "Comfortable casual kidswear for everyday adventures.",
    featured: false,
    new: true
  },
  {
    id: 8,
    name: "Minimal Everyday Watch",
    category: "Accessories",
    gender: "Unisex",
    price: 899,
    oldPrice: 1199,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=900&q=85",
    sizes: ["FREE"],
    colors: ["Black"],
    stock: 4,
    description: "Minimal everyday watch designed to complete your outfit.",
    featured: false,
    new: false
  }
];

let cart = JSON.parse(localStorage.getItem("styleDockCart") || "[]");

let currentCategory = "All";
let currentSearch = "";
let currentProduct = null;
let selectedSize = null;
let selectedColor = null;

const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartBtn = document.getElementById("cartBtn");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const clearCart = document.getElementById("clearCart");
const whatsappOrder = document.getElementById("whatsappOrder");

const overlay = document.getElementById("overlay");

const productModal = document.getElementById("productModal");
const closeModal = document.getElementById("closeModal");
const modalContent = document.getElementById("modalContent");

const toast = document.getElementById("toast");

const offersBtn = document.getElementById("offersBtn");
const clearFilters = document.getElementById("clearFilters");

function formatPrice(price) {
  return "₹" + Number(price).toLocaleString("en-IN");
}

function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

function saveCart() {
  localStorage.setItem("styleDockCart", JSON.stringify(cart));
}

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(window.styleDockToastTimer);

  window.styleDockToastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getFilteredProducts() {
  let list = [...PRODUCTS];

  if (currentCategory !== "All") {
    list = list.filter(product =>
      product.category === currentCategory ||
      product.gender === currentCategory
    );
  }

  if (currentSearch.trim()) {
    const query = currentSearch.toLowerCase();

    list = list.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.gender.toLowerCase().includes(query) ||
      product.colors.join(" ").toLowerCase().includes(query)
    );
  }

  return list;
}

function sortProducts(list) {
  const value = sortSelect ? sortSelect.value :
     "featured";

  if (value === "low") {
    return list.sort((a, b) => a.price - b.price);
  }

  if (value === "high") {
    return list.sort((a, b) => b.price - a.price);
  }

  if (value === "new") {
    return list.sort((a, b) => Number(b.new) - Number(a.new));
  }

  return list.sort((a, b) => {
    if (a.featured !== b.featured) {
      return Number(b.featured) - Number(a.featured);
    }

    return b.id - a.id;
  });
}

function productCard(product) {
  const discount = discountPercent(
    product.price,
    product.oldPrice
  );

  const stockText =
    product.stock <= 0
      ? "Out of stock"
      : product.stock <= 3
        ? `Only ${product.stock} left`
        : "In stock";

  return `
    <article class="product-card">

      <div style="position:relative">

        <img
          src="${product.image}"
          alt="${escapeHtml(product.name)}"
          loading="lazy"
          onerror="this.src='tsd-logo.png'"
        >

        ${
          product.new
            ? `
              <span style="
                position:absolute;
                top:12px;
                left:12px;
                background:#10251f;
                color:#fff;
                padding:6px 9px;
                border-radius:999px;
                font-size:10px;
                font-weight:800;
              ">
                NEW
              </span>
            `
            : ""
        }

        ${
          discount
            ? `
              <span style="
                position:absolute;
                top:12px;
                right:12px;
                background:#c7a45a;
                color:#15140f;
                padding:6px 9px;
                border-radius:999px;
                font-size:10px;
                font-weight:800;
              ">
                ${discount}% OFF
              </span>
            `
            : ""
        }

      </div>

      <div class="product-info">

        <p style="margin-bottom:5px">
          ${escapeHtml(product.gender)}
          ·
          ${escapeHtml(product.category)}
        </p>

        <h3>
          ${escapeHtml(product.name)}
        </h3>

        <div class="product-price">

          ${formatPrice(product.price)}

          ${
            product.oldPrice
              ? `
                <del style="
                  color:#999;
                  font-size:12px;
                  margin-left:5px;
                ">
                  ${formatPrice(product.oldPrice)}
                </del>
              `
              : ""
          }

        </div>

        <p style="
          margin-top:5px;
          color:${product.stock <= 3 ? "#a55a35" : "#55745f"};
          font-weight:700;
        ">
          ${stockText}
        </p>

        <button
          type="button"
          class="btn btn-dark"
          style="width:100%;margin-top:10px"
          onclick="openProduct(${product.id})"
        >
          View details
        </button>

      </div>

    </article>
  `;
}

function renderProducts() {
  if (!productGrid) return;

  let list = getFilteredProducts();

  list = sortProducts(list);

  if (resultCount) {
    resultCount.textContent =
      `${list.length} ${list.length === 1 ? "style" : "styles"}`;
  }

  if (!list.length) {
    productGrid.innerHTML = "";

    if (emptyState) {
      emptyState.hidden = false;
    }

    return;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }

  productGrid.innerHTML =
    list.map(productCard).join("");
}

function openProduct(productId) {
  const product = PRODUCTS.find(
    p => p.id === Number(productId)
  );

  if (!product) {
    showToast("Product not found.");
    return;
  }

  if (!productModal || !modalContent) {
    showToast("Product window could not open.");
    return;
  }

  currentProduct = product;

  selectedSize =
    product.sizes?.[0] || null;

  selectedColor =
    product.colors?.[0] || null;

  const discount = discountPercent(
    product.price,
    product.oldPrice
  );

  modalContent.innerHTML = `

    <div style="
      display:grid;
      grid-template-columns:minmax(0,1fr) minmax(0,1fr);
      gap:25px;
    ">

      <div>

        <img
          src="${product.image}"
          alt="${escapeHtml(product.name)}"
          style="
            width:100%;
            aspect-ratio:4/5;
            object-fit:cover;
            border-radius:18px;
            background:#f0ede6;
          "
          onerror="this.src='tsd-logo.png'"
        >

      </div>

      <div>

        <p class="eyebrow" style="color:#c7a45a">
          ${escapeHtml(product.gender)}
          ·
          ${escapeHtml(product.category)}
        </p>

        <h2 style="
          margin:0 0 10px;
          font-family:'Playfair Display',Georgia,serif;
          font-size:clamp(28px,4vw,42px);
          line-height:1.05;
        ">
          ${escapeHtml(product.name)}
        </h2>

        <div style="
          display:flex;
          align-items:center;
          gap:10px;
          margin:15px 0;
        ">

          <strong style="
            color:#10251f;
            font-size:25px;
          ">
            ${formatPrice(product.price)}
          </strong>

          ${
            product.oldPrice
              ? `
                <del style="color:#999">
                  ${formatPrice(product.oldPrice)}
                </del>
              `
              : ""
          }

          ${
            discount
              ? `
                <span style="
                  padding:5px 8px;
                  border-radius:999px;
                  background:#eee4ca;
                  color:#705a2e;
                  font-size:11px;
                  font-weight:800;
                ">
                  ${discount}% OFF
                </span>
              `
              : ""
          }

        </div>

        <p style="
          color:#77766f;
          font-size:14px;
          line-height:1.7;
        ">
          ${escapeHtml(product.description)}
        </p>

        <div style="margin-top:22px">

          <strong style="
            display:block;
            margin-bottom:9px;
          ">
            Select size
          </strong>

          <div
            id="sizeOptions"
            style="
              display:flex;
              flex-wrap:wrap;
              gap:8px;
            "
          >

            ${product.sizes.map(size => `
              <button
                type="button"
                class="size-option"
                data-size="${escapeHtml(size)}"
                style="
                  min-width:48px;
                  min-height:40px;
                  padding:0 12px;
                  border:1px solid #ddd7cb;
                  border-radius:10px;
                  background:white;
                  font-weight:700;
                "
              >
                ${escapeHtml(size)}
              </button>
            `).join("")}

          </div>

        </div>

        <div style="margin-top:20px">

          <strong style="
            display:block;
            margin-bottom:9px;
          ">
            Color
          </strong>

          <div
            id="colorOptions"
            style="
              display:flex;
              flex-wrap:wrap;
              gap:8px;
            "
          >

            ${product.colors.map(color => `
              <button
                type="button"
                class="color-option"
                data-color="${escapeHtml(color)}"
                style="
                  min-height:40px;
                  padding:0 14px;
                  border:1px solid #ddd7cb;
                  border-radius:10px;
                  background:white;
                  font-weight:700;
                "
              >
                ${escapeHtml(color)}
              </button>
            `).join("")}

          </div>

        </div>

        <div style="
          margin-top:22px;
          padding:12px 14px;
          border-radius:12px;
          background:#f3f0e8;
          color:#55534c;
          font-size:12px;
        ">
          ${
            product.stock > 0
              ? `✓ ${product.stock} pieces currently available`
              : "Currently out of stock"
          }
        </div>

        <button
          type="button"
          id="modalAddToCart
           "
          class="btn btn-gold"
          style="width:100%;margin-top:15px"
          ${product.stock <= 0 ? "disabled" : ""}
        >
          ${product.stock > 0 ? "Add to cart" : "Out of stock"}
        </button>

        <button
          type="button"
          id="modalBuyNow"
          class="btn btn-dark"
          style="width:100%;margin-top:9px"
          ${product.stock <= 0 ? "disabled" : ""}
        >
          Buy now
        </button>

      </div>

    </div>
  `;

  setupProductOptions();

  productModal.hidden = false;

  document.body.style.overflow = "hidden";
}

function setupProductOptions() {
  const sizeButtons =
    document.querySelectorAll(".size-option");

  const colorButtons =
    document.querySelectorAll(".color-option");

  sizeButtons.forEach(button => {

    if (button.dataset.size === selectedSize) {
      selectButtonStyle(button, true);
    }

    button.addEventListener("click", () => {

      selectedSize =
        button.dataset.size;

      sizeButtons.forEach(btn => {
        selectButtonStyle(
          btn,
          btn === button
        );
      });

    });

  });

  colorButtons.forEach(button => {

    if (button.dataset.color === selectedColor) {
      selectButtonStyle(button, true);
    }

    button.addEventListener("click", () => {

      selectedColor =
        button.dataset.color;

      colorButtons.forEach(btn => {
        selectButtonStyle(
          btn,
          btn === button
        );
      });

    });

  });

  const addButton =
    document.getElementById("modalAddToCart");

  if (addButton) {

    addButton.addEventListener("click", () => {

      addToCart(
        currentProduct,
        selectedSize,
        selectedColor
      );

    });

  }

  const buyButton =
    document.getElementById("modalBuyNow");

  if (buyButton) {

    buyButton.addEventListener("click", () => {

      addToCart(
        currentProduct,
        selectedSize,
        selectedColor
      );

      closeProductModal();

      openCart();

    });

  }
}

function selectButtonStyle(button, active) {

  if (active) {

    button.style.background = "#10251f";
    button.style.color = "#fff";
    button.style.borderColor = "#10251f";

  } else {

    button.style.background = "white";
    button.style.color = "#171816";
    button.style.borderColor = "#ddd7cb";

  }
}

function addToCart(product, size, color) {

  if (!product || product.stock <= 0) {

    showToast("This product is out of stock.");

    return;
  }

  const existing = cart.find(item =>
    item.productId === product.id &&
    item.size === size &&
    item.color === color
  );

  if (existing) {

    if (existing.quantity >= product.stock) {

      showToast(
        "Maximum available stock reached."
      );

      return;
    }

    existing.quantity += 1;

  } else {

    cart.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: size,
      color: color,
      quantity: 1
    });

  }

  saveCart();

  renderCart();

  updateCartCount();
   showToast("Added to your cart.");
}

function removeFromCart(index) {

  cart.splice(index, 1);

  saveCart();

  renderCart();

  updateCartCount();
}

function changeQuantity(index, change) {

  const item = cart[index];

  if (!item) return;

  const product =
    PRODUCTS.find(
      product => product.id === item.productId
    );

  if (!product) return;

  const newQuantity =
    item.quantity + change;

  if (newQuantity <= 0) {

    removeFromCart(index);

    return;
  }

  if (newQuantity > product.stock) {

    showToast(
      "Maximum available stock reached."
    );

    return;
  }

  item.quantity = newQuantity;

  saveCart();

  renderCart();

  updateCartCount();
}

function cartTotalValue() {

  return cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );
}

function updateCartCount() {

  if (!cartCount) return;

  const count =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  cartCount.textContent = count;
}

function renderCart() {

  if (!cartItems) return;

  if (!cart.length) {

    cartItems.innerHTML = `
      <div style="
        padding:45px 15px;
        text-align:center;
        color:#77766f;
      ">

        <div style="
          font-size:38px;
          margin-bottom:10px;
        ">
          🛍️
        </div>

        <strong style="
          display:block;
          color:#171816;
          font-size:17px;
          margin-bottom:5px;
        ">
          Your cart is empty
        </strong>

        <span style="font-size:13px">
          Add something you love.
        </span>

      </div>
    `;

  } else {

    cartItems.innerHTML = cart.map(
      (item, index) => `

      <div style="
        display:grid;
        grid-template-columns:76px 1fr auto;
        gap:12px;
        padding:15px 0;
        border-bottom:1px solid #e7e2d8;
      ">

        <img
          src="${item.image}"
          alt="${escapeHtml(item.name)}"
          style="
            width:76px;
            height:92px;
            object-fit:cover;
            border-radius:12px;
          "
          onerror="this.src='tsd-logo.png'"
        >

        <div>

          <strong style="
            display:block;
            font-size:13px;
          ">
            ${escapeHtml(item.name)}
          </strong>

          <div style="
            margin-top:5px;
            color:#77766f;
            font-size:11px;
          ">
            Size: ${escapeHtml(item.size || "—")}
            ·
            Color: ${escapeHtml(item.color || "—")}
          </div>

          <div style="
            margin-top:6px;
            color:#10251f;
            font-weight:800;
          ">
            ${formatPrice(item.price)}
          </div>

          <div style="
            display:flex;
            align-items:center;
            gap:7px;
            margin-top:9px;
          ">

            <button
              type="button"
              onclick="changeQuantity(${index},-1)"
              style="
                width:29px;
                height:29px;
              "
            >
              −
            </button>

            <strong>
              ${item.quantity}
            </strong>

            <button
              type="button"
              onclick="changeQuantity(${index},1)"
              style="
                width:29px;
                height:29px;
              "
            >
              +
            </button>

          </div>

        </div>

        <button
          type="button"
          onclick="removeFromCart(${index})"
          style="
            border:0;
            background:none;
            color:#9a4035;
            font-size:20px;
          "
        >
          ×
        </button>

      </div>

    `
    ).join("");

  }

  if (cartTotal) {

    cartTotal.textContent =
      formatPrice(cartTotalValue());

  }
}

function openCart() {

  if (!cartDrawer) return;

  cartDrawer.setAttribute(
    "aria-hidden",
    "false"
  );

  if (overlay) {
    overlay.hidden = false;
  }

  document.body.style.overflow = "hidden";
}

function closeCartDrawer() {

  if (!cartDrawer) return;

  cartDrawer.setAttribute(
    "aria-hidden",
    "true"
  );

  if (overlay) {
    overlay.hidden = true;
  }

  document.body.style.overflow = "";
}

function closeProductModal() {

  if (!productModal) return;

  productModal.hidden = true;

  document.body.style.overflow = "";
}

function sendWhatsAppOrder() {

  if (!cart.length) {

    showToast("Your cart is empty.");

    return;
  }

  let message =
    "Hello STYLE DOCK! 👋\n\n" +
    "I want to order:\n\n";

  cart.forEach((item, index) => {

    message +=
      `${index + 1}. ${item.name}\n` +
      `Size: ${item.size || "N/A"}\n` +
      `Color: ${item.color || "N/A"}\n` +
      `Qty: ${item.quantity}\n` +
      `Price: ${formatPrice(item.price)}\n\n`;

  });

  message +=
    `Total: ${formatPrice(cartTotalValue())}\n\n` +
    "Please confirm availability. Thank you!";

  const url =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(message);

  window.open(url, "_blank");
}

function performSearch() {

  currentSearch =
    searchInput
      ? searchInput.value.trim()
      : "";

  renderProducts();

  document
    .getElementById("shop")
    ?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
}

function setCategory(category) {

  currentCategory = category;

  document
    .querySelectorAll(".cat")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.cat === category
      );

    });

  renderProducts();
}

document
  .querySelectorAll(".cat")
  .forEach(button => {

    button.addEventListener(
      "click",
      () => setCategory(button.dataset.cat)
    );

  });

if (searchBtn) {

  searchBtn.addEventListener(
    "click",
    performSearch
  );

}

if (searchInput) {

  searchInput.addEventListener(
    "keydown",
    event => {

      if (event.key === "Enter") {
        performSearch();
      }

    }
  );

  searchInput.addEventListener(
    "input",
    () => {

      currentSearch =
        searchInput.value.trim();

      renderProducts();

    }
  );

}

if (sortSelect) {

  sortSelect.addEventListener(
    "change",
    renderProducts
  );

}

if (cartBtn) {

  cartBtn.addEventListener(
    "click",
    openCart
  );

}

if (closeCart) {

  closeCart.addEventListener(
    "click",
    closeCartDrawer
  );

}

if (overlay) {

  overlay.addEventListener(
    "click",
    closeCartDrawer
  );

}

if (clearCart) {

  clearCart.addEventListener(
    "click",
    () => {

      cart = [];

      saveCart();

      renderCart();

      updateCartCount();

      showToast("Cart cleared.");

    }
  );

}

if (whatsappOrder) {

  whatsappOrder.addEventListener(
    "click",
    sendWhatsAppOrder
  );

}

if (closeModal) {

  closeModal.addEventListener(
    "click",
    closeProductModal
  );

}

if (productModal) {

  productModal.addEventListener(
    "click",
    event => {

      if (event.target === productModal) {
        closeProductModal();
      }

    }
  );

}

if (offersBtn) {

  offersBtn.addEventListener(
    "click",
    () => {

      document
        .getElementById("offers")
        ?.scrollIntoView({
          behavior: "smooth"
        });

    }
  );

}

if (clearFilters) {

  clearFilters.addEventListener(
    "click",
    () => {

      currentCategory = "All";

      currentSearch = "";

      if (searchInput) {
        searchInput.value = "";
      }

      if (sortSelect) {
        sortSelect.value = "featured";
      }

      document
        .querySelectorAll(".cat")
        .forEach(button => {

          button.classList.toggle(
            "active",
            button.dataset.cat === "All"
          );

        });

      renderProducts();

    }
  );

}

document.addEventListener(
  "keydown",
  event => {

    if (event.key !== "Escape") return;

    if (
      productModal &&
      !productModal.hidden
    ) {
      closeProductModal();
    }

    if (
      cartDrawer &&
      cartDrawer.getAttribute(
        "aria-hidden"
      ) === "false"
    ) {
      closeCartDrawer();
    }

  }
);

renderProducts();
renderCart();
updateCartCount();

/* Make functions available to HTML buttons */
window.openProduct = openProduct;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.closeProductModal = closeProductModal;
     

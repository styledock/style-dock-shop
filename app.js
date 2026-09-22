  
/* =========================================================
   STYLE DOCK — COMPLETE APP.JS
   ========================================================= */

const PRODUCTS = [
  {
    id: 1,
    name: "Premium Oversized T-Shirt",
    category: "Men",
    type: "Tees",
    price: 599,
    oldPrice: 799,
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Black", "White"],
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1000&q=85"
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
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=85"
  }
];


/* =========================================================
   STATE
   ========================================================= */

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let cart = [];


/* =========================================================
   LOAD CART
   ========================================================= */

try {
  cart = JSON.parse(
    localStorage.getItem("styleDockCart")
  ) || [];
} catch (error) {
  cart = [];
}


/* =========================================================
   HELPERS
   ========================================================= */

function $(id) {
  return document.getElementById(id);
}

function getDiscount(product) {
  if (!product.oldPrice || product.oldPrice <= product.price) {
    return 0;
  }

  return Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );
}

function saveCart() {
  localStorage.setItem(
    "styleDockCart",
    JSON.stringify(cart)
  );

  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const cartCount = $("cartCount");

  if (cartCount) {
    cartCount.textContent = count;
  }
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {
  const discount = getDiscount(product);

  return `
    <article class="product-card">

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
          type="button"
          class="quick-view-btn"
          onclick="openProduct(${product.id})"
        >
          Quick View
        </button>

      </div>

      <div class="product-info">

        <div class="product-category">
          ${product.category} · ${product.type}
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
          type="button"
          class="add-cart-btn"
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

function renderProducts(products = PRODUCTS) {
  const grid = $("productGrid");
  const emptyState = $("emptyState");
  const resultCount = $("resultCount");

  if (!grid) return;

  if (!products.length) {
    grid.innerHTML = "";

    if (emptyState) {
      emptyState.hidden = false;
    }

    if (resultCount) {
      resultCount.textContent = "0 products";
    }

    return;
  }

  if (emptyState) {
    emptyState.hidden = true;
  }

  grid.innerHTML = products
    .map(createProductCard)
    .join("");

  if (resultCount) {
    resultCount.textContent =
      `${products.length} product${products.length === 1 ? "" : "s"}`;
  }
}


/* =========================================================
   FILTER
   ========================================================= */

let activeCategory = "All";

function filterProducts() {
  const searchInput = $("searchInput");

  const searchText = searchInput
    ? searchInput.value.trim().toLowerCase()
    : "";

  let products = PRODUCTS.filter((product) => {

    const categoryMatch =
      activeCategory === "All" ||
      product.category === activeCategory ||
      product.type === activeCategory;

    const searchMatch =
      !searchText ||
      product.name.toLowerCase().includes(searchText) ||
      product.category.toLowerCase().includes(searchText) ||
      product.type.toLowerCase().includes(searchText) ||
      product.colors.some((color) =>
        color.toLowerCase().includes(searchText)
      );

    return categoryMatch && searchMatch;
  });


  /* SORT */

  const sortSelect = $("sortSelect");

  if (sortSelect) {

    if (sortSelect.value === "low") {
      products.sort(
        (a, b) => a.price - b.price
      );
    }

    if (sortSelect.value === "high") {
      products.sort(
        (a, b) => b.price - a.price
      );
    }

    if (sortSelect.value === "new") {
      products.reverse();
    }
  }

  renderProducts(products);
}

/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategories() {

  const buttons = document.querySelectorAll(".cat");

  buttons.forEach((button) => {

    button.addEventListener("click", () => {

      activeCategory =
        button.dataset.cat || "All";

      buttons.forEach((btn) => {
        btn.classList.remove("active");
      });

      button.classList.add("active");

      filterProducts();

      const shop = $("shop");

      if (shop) {
        shop.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  });

  const shopJeansButton =
    document.querySelector('.offer-banner [data-cat="Jeans"]');

  if (shopJeansButton) {

    shopJeansButton.addEventListener("click", () => {

      activeCategory = "Jeans";

      buttons.forEach((btn) => {

        btn.classList.toggle(
          "active",
          btn.dataset.cat === "Jeans"
        );

      });

      filterProducts();

      const shop = $("shop");

      if (shop) {
        shop.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }

    });

  }

}

function setupSearch() {

  const input = $("searchInput");

  if (input) {
    input.addEventListener(
      "input",
      filterProducts
    );
  }

  const searchButton = $("searchBtn");

  if (searchButton) {
     searchButton.addEventListener(
      "click",
      filterProducts
    );
  }

  const mobileSearchButton =
    $("mobileSearchBtn");

  if (mobileSearchButton) {

    mobileSearchButton.addEventListener(
      "click",
      () => {

        const searchWrap = $("searchWrap");

        if (searchWrap) {
          searchWrap.classList.toggle("open");
        }

        if (input) {
          input.focus();
        }

      }
    );

  }
}


/* =========================================================
   SORT
   ========================================================= */

function setupSort() {

  const sortSelect = $("sortSelect");

  if (sortSelect) {
    sortSelect.addEventListener(
      "change",
      filterProducts
    );
  }
}


/* =========================================================
   PRODUCT MODAL
   ========================================================= */

function openProduct(productId) {

  const product = PRODUCTS.find(
    (item) => item.id === Number(productId)
  );

  if (!product) {
    showToast("Product not found.");
    return;
  }

  const modal = $("productModal");
  const content = $("modalContent");

  if (!modal || !content) {
    showToast("Product window could not open.");
    return;
  }

  currentProduct = product;

  selectedSize =
    product.sizes?.[0] || null;

  selectedColor =
    product.colors?.[0] || null;

  const discount = getDiscount(product);

  content.innerHTML = `
    <div class="product-modal-inner">

      <div class="modal-product-image-wrap">

        ${
          discount
            ? `<span class="discount-badge">${discount}% OFF</span>`
            : ""
        }

        <img
          class="modal-product-image"
          src="${product.image}"
          alt="${product.name}"
          onerror="this.src='https://via.placeholder.com/700x900?text=STYLE+DOCK'"
        >

      </div>

      <div class="modal-product-details">

        <p class="eyebrow">
          ${product.category} · ${product.type}
        </p>

        <h2 id="productModalTitle">
          ${product.name}
        </h2>

        <div class="modal-price">

          <strong>₹${product.price}</strong>

          ${
            product.oldPrice
              ? `<span class="old-price">₹${product.oldPrice}</span>`
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
            class="btn btn-gold"
            onclick="addCurrentProductToCart()"
          >
            Add to Cart
          </button>

          <button
            type="button"
            class="btn btn-dark"
            onclick="buyCurrentProductOnWhatsApp()"
          >
            Buy on WhatsApp
          </button>

        </div>

        <div class="product-note">
  ✓ Premium Quality<br>
  ✓ Easy WhatsApp Ordering
</div>

      </div>

    </div>
  `;

  modal.hidden = false;
  modal.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE PRODUCT MODAL
   ========================================================= */

function closeProductModal() {

  const modal = $("productModal");

  if (!modal) return;

  modal.hidden = true;
  modal.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}


/* =========================================================
   MODAL CLOSE BUTTON
   ========================================================= */

function setupProductModal() {

  const closeButton = $("closeModal");

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeProductModal
    );
  }

  const modal = $("productModal");

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
   SIZE
   ========================================================= */

function selectSize(size) {

  selectedSize = size;

  document
    .querySelectorAll(".size-option")
    .forEach((button) => {

      button.classList.toggle(
        "selected",
        button.dataset.size === size
      );

    });
}


/* =========================================================
   COLOR
   ========================================================= */

function selectColor(color) {

  selectedColor = color;

  document
    .querySelectorAll(".color-option")
    .forEach((button) => {

      button.classList.toggle(
        "selected",
        button.dataset.color === color
      );

    });
}


/* =========================================================
   ADD TO CART
   ========================================================= */

function addToCart(
  productId,
  size = null,
  color = null
) {

  const product = PRODUCTS.find(
    (item) => item.id === Number(productId)
  );

  if (!product) {
    showToast("Product not found.");
    return;
  }

  if (!size) {
    size = product.sizes?.[0] || null;
  }

  if (!color) {
    color = product.colors?.[0] || null;
  }


  const existing = cart.find(
    (item) =>
      Number(item.productId) === product.id &&
      item.size === size &&
      item.color === color
  );


  if (existing) {

    existing.quantity =
      Number(existing.quantity || 0) + 1;

  } else {

    cart.push({
      productId: product.id,
      size: size,
      color: color,
      quantity: 1
    });

  }


  saveCart();

  renderCart();

  showToast(
    `${product.name} added to cart`
  );
}


/* =========================================================
   ADD CURRENT PRODUCT
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

  setTimeout(() => {
    openCart();
  }, 200);
}


/* =========================================================
   CART TOTAL
   ========================================================= */

function getCartTotal() {

  return cart.reduce(
    (total, item) => {

      const product = PRODUCTS.find(
        (p) => p.id === Number(item.productId)
      );

      if (!product) return total;

      return (
        total +
        product.price *
          Number(item.quantity || 0)
      );

    },
    0
  );
}


/* =========================================================
   CART RENDER
   ========================================================= */

function renderCart() {

  const cartItems = $("cartItems");

  if (!cartItems) return;


  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        <div style="font-size:42px;">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add something you love from STYLE DOCK.</p>
      </div>
    `;

    updateCartCount();

    updateCheckoutTotal();

    return;
  }


  cartItems.innerHTML = cart
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

            <h3>${product.name}</h3>

            <p>
              ${
                item.size
                  ? `Size: ${item.size}`
                  : ""
              }
              ${
                item.color
                  ? ` · Color: ${item.color}`
                  : ""
              }
            </p>

            <strong>
              ₹${product.price}
            </strong>

            <div class="cart-quantity">

              <button
                type="button"
                onclick="changeCartQuantity(${index}, -1)"
              >
                −
              </button>

              <span>
                ${item.quantity}
              </span>

              <button
                type="button"
                onclick="changeCartQuantity(${index}, 1)"
              >
                +
              </button>
              </div>

            <button
              type="button"
              class="remove-cart"
              onclick="removeFromCart(${index})"
            >
              Remove
            </button>

          </div>

        </div>
      `;

    })
    .join("");


  updateCartCount();
  updateCheckoutTotal();
}


/* =========================================================
   QUANTITY
   ========================================================= */

function changeCartQuantity(
  index,
  change
) {

  if (!cart[index]) return;

  cart[index].quantity =
    Number(cart[index].quantity || 0) +
    change;


  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }


  saveCart();

  renderCart();
}


/* =========================================================
   REMOVE
   ========================================================= */

function removeFromCart(index) {

  if (!cart[index]) return;

  cart.splice(index, 1);

  saveCart();

  renderCart();

  showToast("Product removed from cart");
}


/* =========================================================
   OPEN CART
   ========================================================= */

function openCart() {

  const drawer = $("cartDrawer");
  const overlay = $("overlay");

  if (!drawer) {
    showToast("Cart could not open.");
    return;
  }

  renderCart();

  drawer.classList.add("open");
  drawer.setAttribute(
    "aria-hidden",
    "false"
  );

  if (overlay) {
    overlay.hidden = false;
    overlay.classList.add("open");
  }

  document.body.style.overflow = "hidden";
}


/* =========================================================
   CLOSE CART
   ========================================================= */

function closeCart() {

  const drawer = $("cartDrawer");
  const overlay = $("overlay");

  if (drawer) {

    drawer.classList.remove("open");

    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

  }

  if (overlay) {

    overlay.classList.remove("open");
    overlay.hidden = true;

  }

  document.body.style.overflow = "";
}


/* =========================================================
   CART EVENTS
   ========================================================= */

function setupCart() {

  const cartButton = $("cartBtn");
  const closeButton = $("closeCart");
  const overlay = $("overlay");

  if (cartButton) {
    cartButton.addEventListener(
      "click",
      openCart
    );
  }

  if (closeButton) {
    closeButton.addEventListener(
      "click",
      closeCart
    );
  }

  if (overlay) {
    overlay.addEventListener(
      "click",
      closeCart
    );
  }

}


/* =========================================================
   CHECKOUT TOTAL
   ========================================================= */

function updateCheckoutTotal() {

  const checkoutTotal =
    $("checkoutTotal");

  if (checkoutTotal) {

    checkoutTotal.textContent =
      `₹${getCartTotal().toLocaleString("en-IN")}`;

  }
}


/* =========================================================
   DELIVERY OPTION
   ========================================================= */

function setupDeliveryOption() {

  const deliveryOption =
    $("deliveryOption");

  const addressField =
    $("addressField");

  const pincodeField =
    $("pincodeField");

  const address =
    $("customerAddress");

  const pincode =
    $("customerPincode");


  if (!deliveryOption) return;


  function updateFields() {

    const homeDelivery =
      deliveryOption.value ===
      "Home Delivery";


    if (addressField) {
      addressField.style.display =
        homeDelivery ? "" : "none";
    }

    if (pincodeField) {
      pincodeField.style.display =
        homeDelivery ? "" : "none";
    }

    if (address) {
      address.required =
        homeDelivery;
    }

    if (pincode) {
      pincode.required =
        homeDelivery;
    }

  }


  deliveryOption.addEventListener(
    "change",
    updateFields
  );

  updateFields();
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function setupCheckout() {

  const form =
    $("checkoutForm");

  const whatsappButton =
    $("whatsappOrder");

  if (whatsappButton) {

    whatsappButton.addEventListener(
      "click",
      () => {

        if (!cart.length) {
          showToast("Your cart is empty.");
          return;
        }

        const checkoutBox =
          $("checkoutBox");

        if (checkoutBox) {
          checkoutBox.hidden = false;
        }

        updateCheckoutTotal();

      }
    );

  }


  if (!form) return;


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();

      if (!cart.length) {
        showToast("Your cart is empty.");
        return;
      }


      const name =
        $("customerName")?.value.trim();

      const phone =
        $("customerPhone")?.value.trim();

      const delivery =
        $("deliveryOption")?.value;

      const address =
        $("customerAddress")?.value.trim();

      const pincode =
        $("customerPincode")?.value.trim();

      const note =
        $("orderNote")?.value.trim();


      if (!name || !phone || !delivery) {

        showToast(
          "Please fill all required details."
        );

        return;
      }


      if (!/^[0-9]{10}$/.test(phone)) {

        showToast(
          "Enter a valid 10-digit mobile number."
        );

        return;
      }


      if (
        delivery === "Home Delivery" &&
        (
          !address ||
          !/^[0-9]{6}$/.test(pincode)
        )
      ) {

        showToast(
          "Please enter address and valid pincode."
        );

        return;
      }


      sendWhatsAppOrder({
        name,
        phone,
        delivery,
        address,
        pincode,
        note
      });

    }
  );
}


/* =========================================================
   WHATSAPP ORDER
   ========================================================= */

function sendWhatsAppOrder(customer) {

  const whatsappNumber =
    "918881717710";

  let message =
    "Hello STYLE DOCK!%0A%0A" +
    "*NEW ORDER*%0A%0A";


  message +=
    `Name: ${encodeURIComponent(customer.name)}%0A`;

  message +=
    `Mobile: ${encodeURIComponent(customer.phone)}%0A`;

  message +=
    `Delivery: ${encodeURIComponent(customer.delivery)}%0A`;


  if (
    customer.delivery ===
    "Home Delivery"
  ) {

    message +=
      `Address: ${encodeURIComponent(customer.address)}%0A`;

    message +=
      `Pincode: ${encodeURIComponent(customer.pincode)}%0A`;

  }


  if (customer.note) {

    message +=
      `Note: ${encodeURIComponent(customer.note)}%0A`;

  }


  message += "%0A*PRODUCTS*%0A";


  cart.forEach((item, index) => {

    const product = PRODUCTS.find(
      (p) => p.id === Number(item.productId)
    );

    if (!product) return;


    message +=
      `${index + 1}. ${encodeURIComponent(product.name)}%0A`;

    message +=
      `Price: ₹${product.price}%0A`;

    message +=
      `Quantity: ${item.quantity}%0A`;

    if (item.size) {

      message +=
        `Size: ${encodeURIComponent(item.size)}%0A`;

    }

    if (item.color) {

      message +=
        `Color: ${encodeURIComponent(item.color)}%0A`;

    }

    message += "%0A";

  });


  message +=
    `*TOTAL: ₹${getCartTotal().toLocaleString("en-IN")}*%0A%0A`;

  message +=
    "Please confirm availability.";


  window.open(
    `https://wa.me/${whatsappNumber}?text=${message}`,
    "_blank"
  );
}


/* =========================================================
   DIRECT WHATSAPP FROM PRODUCT
   ========================================================= */

function buyCurrentProductOnWhatsApp() {

  if (!currentProduct) {
    showToast("Product not found.");
    return;
  }


  const whatsappNumber =
    "918881717710";


  let message =
    "Hello STYLE DOCK!%0A%0A" +
    "*PRODUCT ENQUIRY*%0A%0A";


  message +=
    `Product: ${encodeURIComponent(currentProduct.name)}%0A`;

  message +=
    `Price: ₹${currentProduct.price}%0A`;


  if (selectedSize) {

    message +=
      `Size: ${encodeURIComponent(selectedSize)}%0A`;

  }


  if (selectedColor) {

    message +=
      `Color: ${encodeURIComponent(selectedColor)}%0A`;

  }


  message +=
    "%0APlease confirm availability.";


  window.open(
    `https://wa.me/${whatsappNumber}?text=${message}`,
    "_blank"
  );
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;

  toast.classList.add("show");

  clearTimeout(
    window.styleDockToastTimer
  );

  window.styleDockToastTimer =
    setTimeout(() => {

      toast.classList.remove("show");

    }, 2200);
}


/* =========================================================
   OFFERS BUTTON
   ========================================================= */

function setupOffers() {

  const offersButton =
    $("offersBtn");

  if (offersButton) {

    offersButton.addEventListener(
      "click",
      () => {

        const offers =
          $("offers");

        if (offers) {

          offers.scrollIntoView({
            behavior: "smooth"
          });

        }

      }
    );

  }

}


/* =========================================================
   CLEAR FILTERS
   ========================================================= */

function setupClearFilters() {

  const button =
    $("clearFilters");

  if (!button) return;

  button.addEventListener(
    "click",
    () => {

      activeCategory = "All";

      const search =
        $("searchInput");

      if (search) {
        search.value = "";
      }


      document
        .querySelectorAll(".cat")
        .forEach((cat) => {

          cat.classList.toggle(
            "active",
            cat.dataset.cat === "All"
          );

        });


      const sort =
        $("sortSelect");

      if (sort) {
        sort.value = "featured";
      }


      filterProducts();

    }
  );

}


/* =========================================================
   ESCAPE KEY
   ========================================================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (event.key !== "Escape") return;

    closeProductModal();
    closeCart();

  }
);


/* =========================================================
   INITIALIZE
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

}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState ===
  "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initStyleDock
  );

} else {

  initStyleDock();

}


/* =========================================================
   GLOBAL FUNCTIONS
   ========================================================= */

window.PRODUCTS = PRODUCTS;

window.openProduct =
  openProduct;

window.closeProductModal =
  closeProductModal;

window.selectSize =
  selectSize;

window.selectColor =
  selectColor;

window.addToCart =
  addToCart;

window.addCurrentProductToCart =
  addCurrentProductToCart;

window.changeCartQuantity =
  changeCartQuantity;

window.removeFromCart =
  removeFromCart;

window.openCart =
  openCart;

window.closeCart =
  closeCart;

window.buyCurrentProductOnWhatsApp =
  buyCurrentProductOnWhatsApp;

window.orderOnWhatsApp =
  function () {

    if (!cart.length) {
      showToast("Your cart is empty.");
      return;
    }

    sendWhatsAppOrder({
      name: "Customer",
      phone: "",
      delivery: "Store Pickup",
      address: "",
      pincode: "",
      note: ""
    });

  };

window.filterProducts =
  filterProducts;

window.showToast =
  showToast;

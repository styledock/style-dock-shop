/* =========================================================
   STYLE DOCK — STORE ENGINE
   ========================================================= */


/* ================= PRODUCTS ================= */

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


/* ================= STATE ================= */

let currentProduct = null;
let selectedSize = null;
let selectedColor = null;
let activeCategory = "All";
let cart = [];


/* ================= DOM HELPER ================= */

function $(id) {
  return document.getElementById(id);
}


/* ================= CART LOAD ================= */

try {

  const savedCart =
    JSON.parse(
      localStorage.getItem("styleDockCart")
    );

  if (Array.isArray(savedCart)) {

    cart = savedCart.filter((item) => {

      const product = PRODUCTS.find(
        (p) => p.id === Number(item.productId)
      );

      return (
        product &&
        Number(item.quantity) > 0
      );

    });

  }

} catch (error) {

  cart = [];

}


/* ================= PRODUCT HELPERS ================= */

function getProduct(productId) {

  return PRODUCTS.find(
    (product) =>
      product.id === Number(productId)
  );

}


function getDiscount(product) {

  if (
    !product.oldPrice ||
    product.oldPrice <= product.price
  ) {
    return 0;
  }

  return Math.round(
    (
      (product.oldPrice - product.price) /
      product.oldPrice
    ) * 100
  );

}


/* ================= CART HELPERS ================= */

function getCartTotal() {

  return cart.reduce(
    (total, item) => {

      const product =
        getProduct(item.productId);

      if (!product) {
        return total;
      }

      return (
        total +
        product.price *
        Number(item.quantity || 0)
      );

    },
    0
  );

}


function updateCartCount() {

  const count =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  const cartCount =
    $("cartCount");

  if (cartCount) {
    cartCount.textContent = count;
  }

}


function saveCart() {

  localStorage.setItem(
    "styleDockCart",
    JSON.stringify(cart)
  );

  updateCartCount();

}


/* ================= TOAST ================= */

let toastTimer = null;

function showToast(message) {

  const toast = $("toast");

  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer =
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2400);

}


/* ================= PRODUCT CARD ================= */

function createProductCard(product) {

  const discount =
    getDiscount(product);

  return `

    <article class="product-card">

      <div class="product-image-wrap">

        ${
          discount
            ? `
              <span class="discount-badge">
                ${discount}% OFF
              </span>
            `
            : ""
        }

        <img
          class="product-image"
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
          onerror="this.onerror=null;this.src='tsd-logo.png';"
        />

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

        <h3>
          ${product.name}
        </h3>

        <div class="product-price">

          <strong>
            ₹${product.price.toLocaleString("en-IN")}
          </strong>

          ${
            product.oldPrice
              ? `
                <span class="old-price">
                  ₹${product.oldPrice.toLocaleString("en-IN")}
                </span>
              `
              : ""
          }

        </div>

        <button
          type="button"
          class="add-cart-btn"
          onclick="openProduct(${product.id})"
        >
          Select Size & Add to Cart
        </button>

      </div>

    </article>

  `;

}


/* ================= RENDER PRODUCTS ================= */

function renderProducts(products = PRODUCTS) {

  const grid =
    $("productGrid");

  const emptyState =
    $("emptyState");

  const resultCount =
    $("resultCount");

  if (!grid) return;


  if (!products.length) {

    grid.innerHTML = "";

    if (emptyState) {
      emptyState.hidden = false;
    }

    if (resultCount) {
      resultCount.textContent =
        "0 products";
    }

    return;
  }


  if (emptyState) {
    emptyState.hidden = true;
  }


  grid.innerHTML =
    products
      .map(createProductCard)
      .join("");


  if (resultCount) {

    resultCount.textContent =
      `${products.length} ${
        products.length === 1
          ? "product"
          : "products"
      }`;

  }

}


/* ================= FILTER + SORT ================= */

function filterProducts() {

  const searchInput =
    $("searchInput");

  const searchText =
    searchInput
      ? searchInput.value
          .trim()
          .toLowerCase()
      : "";


  let products =
    PRODUCTS.filter((product) => {

      const categoryMatch =
        activeCategory === "All" ||
        product.category === activeCategory ||
        product.type === activeCategory;


      const searchMatch =
        !searchText ||

        product.name
          .toLowerCase()
          .includes(searchText) ||

        product.category
          .toLowerCase()
          .includes(searchText) ||

        product.type
          .toLowerCase()
          .includes(searchText) ||

        product.colors.some(
          (color) =>
            color
              .toLowerCase()
              .includes(searchText)
        );

      return (
        categoryMatch &&
        searchMatch
      );

    });


  const sort =
    $("sortSelect")
      ? $("sortSelect").value
      : "featured";


  if (sort === "low") {

    products.sort(
      (a, b) =>
        a.price - b.price
    );

  }


  if (sort === "high") {

    products.sort(
      (a, b) =>
        b.price - a.price
    );

  }


  if (sort === "new") {

    products.sort(
      (a, b) =>
        b.id - a.id
    );

  }


  renderProducts(products);

}


/* ================= CATEGORIES ================= */

function setCategory(category) {

  activeCategory =
    category || "All";


  document
    .querySelectorAll(".cat")
    .forEach((button) => {

      button.classList.toggle(
        "active",
        button.dataset.cat === activeCategory
      );

    });


  filterProducts();

}


function setupCategories() {

  document
    .querySelectorAll(".cat")
    .forEach((button) => {

      button.addEventListener(
        "click",
        () => {

          setCategory(
            button.dataset.cat
          );

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


  const shopJeans =
    $("shopJeansBtn");

  if (shopJeans) {

    shopJeans.addEventListener(
      "click",
      () => {

        setCategory("Jeans");

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

  }

}


/* ================= SEARCH ================= */

function setupSearch() {

  const input =
    $("searchInput");

  if (input) {

    input.addEventListener(
      "input",
      filterProducts
    );

  }


  const button =
    $("searchBtn");

  if (button) {

    button.addEventListener(
      "click",
      filterProducts
    );

  }

}


/* ================= SORT ================= */

function setupSort() {

  const select =
    $("sortSelect");

  if (select) {

    select.addEventListener(
      "change",
      filterProducts
    );

  }

}


/* ================= PRODUCT MODAL ================= */

function openProduct(productId) {

  const product =
    getProduct(productId);

  if (!product) {

    showToast(
      "Product not found."
    );

    return;
  }


  const modal =
    $("productModal");

  const content =
    $("modalContent");

  if (!modal || !content) {

    showToast(
      "Product window could not open."
    );

    return;
  }


  currentProduct = product;

  selectedSize =
    product.sizes?.[0] || null;

  selectedColor =
    product.colors?.[0] || null;


  const discount =
    getDiscount(product);


  content.innerHTML = `

    <div class="product-modal-inner">

      <div class="modal-product-image-wrap">

        ${
          discount
            ? `
              <span class="discount-badge">
                ${discount}% OFF
              </span>
            `
            : ""
        }

        <img
          class="modal-product-image"
          src="${product.image}"
          alt="${product.name}"
          onerror="this.onerror=null;this.src='tsd-logo.png';"
        />

      </div>


      <div class="modal-product-details">

        <p class="eyebrow">
          ${product.category} · ${product.type}
        </p>

        <h2 id="productModalTitle">
          ${product.name}
        </h2>


        <div class="modal-price">

          <strong>
            ₹${product.price.toLocaleString("en-IN")}
          </strong>

          ${
            product.oldPrice
              ? `
                <span class="old-price">
                  ₹${product.oldPrice.toLocaleString("en-IN")}
                </span>
              `
              : ""
          }

        </div>


        ${
          product.sizes?.length
            ? `

              <div class="option-section">

                <h4>
                  Select Size
                </h4>

                <div class="option-list">

                  ${product.sizes
                    .map(
                      (size) => `

                        <button
                          type="button"
                          class="option-btn size-option ${
                            size === selectedSize
                              ? "selected"
                              : ""
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

                <h4>
                  Select Color
                </h4>

                <div class="option-list">

                  ${product.colors
                    .map(
                      (color) => `

                        <button
                          type="button"
                          class="option-btn color-option ${
                            color === selectedColor
                              ? "selected"
                              : ""
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


        <div class="product-note">

          ✓ Premium Quality<br />
          ✓ Easy WhatsApp Ordering

        </div>


        <button
          type="button"
          class="btn btn-gold full"
          onclick="addCurrentProductToCart()"
        >
          Add to Cart
        </button>

      </div>

    </div>

  `;


  modal.hidden = false;

  modal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow =
    "hidden";

}


function closeProductModal() {

  const modal =
    $("productModal");

  if (!modal) return;

  modal.hidden = true;

  modal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow =
    "";

  currentProduct = null;

}


function setupProductModal() {

  const close =
    $("closeModal");

  const modal =
    $("productModal");


  if (close) {

    close.addEventListener(
      "click",
      closeProductModal
    );

  }


  if (modal) {

    modal.addEventListener(
      "click",
      (event) => {

        if (
          event.target === modal
        ) {
          closeProductModal();
        }

      }
    );

  }

}


/* ================= SIZE / COLOR ================= */

function selectSize(size) {

  selectedSize =
    size;


  document
    .querySelectorAll(".size-option")
    .forEach((button) => {

      button.classList.toggle(
        "selected",
        button.dataset.size === size
      );

    });

}


function selectColor(color) {

  selectedColor =
    color;


  document
    .querySelectorAll(".color-option")
    .forEach((button) => {

      button.classList.toggle(
        "selected",
        button.dataset.color === color
      );

    });

}


/* ================= ADD TO CART ================= */

function addCurrentProductToCart() {

  if (!currentProduct) {

    showToast(
      "Please select a product."
    );

    return;
  }


  addToCart(
    currentProduct.id,
    selectedSize,
    selectedColor
  );

}


function addToCart(
  productId,
  size = null,
  color = null
) {

  const product =
    getProduct(productId);

  if (!product) {

    showToast(
      "Product not found."
    );

    return;
  }


  const finalSize =
    size ||
    product.sizes?.[0] ||
    null;

  const finalColor =
    color ||
    product.colors?.[0] ||
    null;


  const existing =
    cart.find(
      (item) =>
        Number(item.productId) ===
          Number(productId) &&
        item.size === finalSize &&
        item.color === finalColor
    );


  if (existing) {

    existing.quantity =
      Number(existing.quantity || 0) + 1;

  } else {

    cart.push({

      productId:
        Number(productId),

      quantity: 1,

      size: finalSize,

      color: finalColor

    });

  }


  saveCart();

  renderCart();

  showToast(
    "Added to cart ✓"
  );


  closeProductModal();

  openCart();

}


/* ================= RENDER CART ================= */

function renderCart() {

  const cartItems =
    $("cartItems");

  const cartTotal =
    $("cartTotal");

  if (!cartItems) return;


  cart =
    cart.filter(
      (item) =>
        getProduct(item.productId)
    );


  if (!cart.length) {

    cartItems.innerHTML = `

      <div class="empty-cart">

        <div class="empty-cart-icon">
          🛒
        </div>

        <h3>
          Your cart is empty
        </h3>

        <p>
          Add something you love from STYLE DOCK.
        </p>

      </div>

    `;

  } else {

    cartItems.innerHTML =
      cart
        .map(
          (item, index) => {

            const product =
              getProduct(
                item.productId
              );

            return `

              <div class="cart-item">

                <img
                  src="${product.image}"
                  alt="${product.name}"
                  onerror="this.onerror=null;this.src='tsd-logo.png';"
                />


                <div class="cart-item-info">

                  <h3>
                    ${product.name}
                  </h3>

                  <p class="cart-meta">

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


                  <strong class="cart-price">
                    ₹${product.price.toLocaleString("en-IN")}
                  </strong>


                  <div class="cart-quantity">

                    <button
                      type="button"
                      onclick="changeCartQuantity(${index}, -1)"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span>
                      ${item.quantity}
                    </span>

                    <button
                      type="button"
                      onclick="changeCartQuantity(${index}, 1)"
                      aria-label="Increase quantity"
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

          }
        )
        .join("");

  }


  const total =
    getCartTotal();


  if (cartTotal) {

    cartTotal.textContent =
      `₹${total.toLocaleString("en-IN")}`;

  }


  updateCheckoutTotal();

  updateCartCount();

  saveCartSilently();

}


function saveCartSilently() {

  localStorage.setItem(
    "styleDockCart",
    JSON.stringify(cart)
  );

}


/* ================= QUANTITY ================= */

function changeCartQuantity(
  index,
  change
) {

  if (!cart[index]) return;


  cart[index].quantity =
    Number(cart[index].quantity || 0) +
    change;


  if (
    cart[index].quantity <= 0
  ) {

    cart.splice(
      index,
      1
    );

  }


  saveCart();

  renderCart();

}


/* ================= REMOVE ================= */

function removeFromCart(index) {

  if (!cart[index]) return;


  cart.splice(
    index,
    1
  );


  saveCart();

  renderCart();

  showToast(
    "Product removed from cart."
  );

}


/* ================= CART OPEN ================= */

function openCart() {

  const drawer =
    $("cartDrawer");

  const overlay =
    $("overlay");

  if (!drawer) return;


  renderCart();


  drawer.classList.add("open");

  drawer.setAttribute(
    "aria-hidden",
    "false"
  );


  if (overlay) {

    overlay.hidden = false;

    overlay.classList.add(
      "open"
    );

  }


  document.body.style.overflow =
    "hidden";

}


function closeCart() {

  const drawer =
    $("cartDrawer");

  const overlay =
    $("overlay");


  if (drawer) {

    drawer.classList.remove(
      "open"
    );

    drawer.setAttribute(
      "aria-hidden",
      "true"
    );

  }


  if (overlay) {

    overlay.classList.remove(
      "open"
    );

    overlay.hidden = true;

  }


  document.body.style.overflow =
    "";

}


function setupCart() {

  const cartButton =
    $("cartBtn");

  const closeButton =
    $("closeCart");

  const overlay =
    $("overlay");


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


/* ================= CHECKOUT ================= */

function updateCheckoutTotal() {

  const total =
    $("checkoutTotal");

  if (total) {

    total.textContent =
      `₹${getCartTotal().toLocaleString("en-IN")}`;

  }

}


function setupDeliveryOption() {

  const delivery =
    $("deliveryOption");

  const addressField =
    $("addressField");

  const pincodeField =
    $("pincodeField");

  const address =
    $("customerAddress");

  const pincode =
    $("customerPincode");


  if (!delivery) return;


  function updateFields() {

    const homeDelivery =
      delivery.value ===
      "Home Delivery";


    if (addressField) {

      addressField.style.display =
        homeDelivery
          ? ""
          : "none";

    }


    if (pincodeField) {

      pincodeField.style.display =
        homeDelivery
          ? ""
          : "none";

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


  delivery.addEventListener(
    "change",
    updateFields
  );


  updateFields();

}


function closeCheckout() {

  const checkoutBox =
    $("checkoutBox");

  if (checkoutBox) {

    checkoutBox.hidden = true;

  }

}


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

          showToast(
            "Your cart is empty."
          );

          return;
        }


        const checkoutBox =
          $("checkoutBox");

        if (checkoutBox) {

          checkoutBox.hidden =
            false;

        }


        updateCheckoutTotal();

      }
    );

  }


  const closeButton =
    $("closeCheckout");

  if (closeButton) {

    closeButton.addEventListener(
      "click",
      closeCheckout
    );

  }


  if (!form) return;


  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      if (!cart.length) {

        showToast(
          "Your cart is empty."
        );

        return;
      }


      const name =
        $("customerName")
          ?.value
          .trim();

      const phone =
        $("customerPhone")
          ?.value
          .trim();

      const delivery =
        $("deliveryOption")
          ?.value;

      const address =
        $("customerAddress")
          ?.value
          .trim();

      const pincode =
        $("customerPincode")
          ?.value
          .trim();

      const note =
        $("orderNote")
          ?.value
          .trim();


      if (
        !name ||
        !phone ||
        !delivery
      ) {

        showToast(
          "Please fill all required details."
        );

        return;
      }


      if (
        !/^[0-9]{10}$/.test(phone)
      ) {

        showToast(
          "Enter a valid 10-digit mobile number."
        );

        return;
      }


      if (
        delivery ===
          "Home Delivery" &&
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


/* ================= WHATSAPP ================= */

function sendWhatsAppOrder(customer) {

  const whatsappNumber =
    "918881717710";


  let message =
    "Hello STYLE DOCK!\n\n" +
    "*NEW ORDER*\n\n";


  message +=
    `Name: ${customer.name}\n`;

  message +=
    `Mobile: ${customer.phone}\n`;

  message +=
    `Delivery: ${customer.delivery}\n`;


  if (
    customer.delivery ===
    "Home Delivery"
  ) {

    message +=
      `Address: ${customer.address}\n`;

    message +=
      `Pincode: ${customer.pincode}\n`;

  }


  if (customer.note) {

    message +=
      `Note: ${customer.note}\n`;

  }


  message +=
    "\n*PRODUCTS*\n";


  cart.forEach(
    (item, index) => {

      const product =
        getProduct(
          item.productId
        );

      if (!product) return;


      message +=
        `${index + 1}. ${product.name}\n`;

      message +=
        `Price: ₹${product.price}\n`;

      message +=
        `Quantity: ${item.quantity}\n`;


      if (item.size) {

        message +=
          `Size: ${item.size}\n`;

      }


      if (item.color) {

        message +=
          `Color: ${item.color}\n`;

      }


      message += "\n";

    }
  );


  message +=
    `*TOTAL: ₹${getCartTotal().toLocaleString("en-IN")}*\n\n`;

  message +=
    "Please confirm availability.";


  const url =
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

}


/* ================= CLEAR FILTERS ================= */

function setupClearFilters() {

  const button =
    $("clearFilters");

  if (!button) return;


  button.addEventListener(
    "click",
    () => {

      activeCategory =
        "All";


      const search =
        $("searchInput");

      if (search) {

        search.value =
          "";

      }


      const sort =
        $("sortSelect");

      if (sort) {

        sort.value =
          "featured";

      }


      document
        .querySelectorAll(".cat")
        .forEach((cat) => {

          cat.classList.toggle(
            "active",
            cat.dataset.cat ===
              "All"
          );

        });


      filterProducts();

    }
  );

}


/* ================= OFFERS ================= */

function setupOffers() {

  const offersButton =
    $("offersBtn");

  if (!offersButton) return;


  offersButton.addEventListener(
    "click",
    () => {

      const offers =
        $("offers");

      if (offers) {

        offers.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

    }
  );

}


/* ================= KEYBOARD ================= */

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key !==
      "Escape"
    ) {
      return;
    }


    const checkoutBox =
      $("checkoutBox");

    if (
      checkoutBox &&
      !checkoutBox.hidden
    ) {

      closeCheckout();

      return;

    }


    closeProductModal();

    closeCart();

  }
);


/* ================= INIT ================= */

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


/* ================= GLOBALS ================= */

window.PRODUCTS =
  PRODUCTS;

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

window.closeCheckout =
  closeCheckout;

window.filterProducts =
  filterProducts;

window.showToast =
  showToast;

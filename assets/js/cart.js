// Sample products data (you can move this to a separate file later)
const products = [
    {
        id: "detox1",
        name: "Detox Protocol",
        price: 2400,
        image: "./assets/img/feature_prod_01.png",
        rating: 4.5,
        reviews: 24
    },
    {
        id: "vitd3k2",
        name: "Vitamin D3 & K2",
        price: 4800,
        image: "./assets/img/feature_prod_02.png",
        rating: 5,
        reviews: 48
    },
    {
        id: "selamino",
        name: "Selamino Complex",
        price: 3600,
        image: "./assets/img/feature_prod_03.png",
        rating: 5,
        reviews: 74
    }
    // ← add more products here
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Format price in GBP style
function formatPrice(price) {
    return "£" + (price / 100).toFixed(2);
}

// Get cart from localStorage
function getCart() {
    try {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        // Silently fail - invalid cart data
        return [];
    }
}

// Render products (if you want dynamic – otherwise keep HTML static and just add event listeners)
function renderProducts() {
    const container = document.getElementById('products-container');
    if (!container) return;

    container.innerHTML = products.map(product => {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(product.rating)) {
                stars += '<i class="fas fa-star text-warning"></i>';
            } else if (i - 0.5 === product.rating) {
                stars += '<i class="fas fa-star-half-alt text-warning"></i>';
            } else {
                stars += '<i class="far fa-star text-warning"></i>';
            }
        }

        return `
            <div class="col-md-4">
                <div class="card h-100 border-0 shadow-sm product-card hover-lift rounded-4 overflow-hidden">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}">
                    <div class="card-body text-center p-4">
                        <h5 class="fw-bold mb-2">${product.name}</h5>
                        <div class="mb-2">
                            ${stars}
                            <span class="text-muted ms-2">(${product.reviews})</span>
                        </div>
                        <p class="text-success fw-bold fs-4 mb-3">${formatPrice(product.price)}</p>
                        <button type="button"
                                class="btn btn-success rounded-pill px-4 add-to-cart"
                                data-id="${product.id}"
                                data-name="${product.name}"
                                data-price="${product.price}"
                                data-image="${product.image}">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render cart items for cart page
function renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const orderSummaryEl = document.getElementById('orderSummary');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    const debugEl = document.getElementById('cartDebug');

    // Verify elements exist
    if (!cartItemsEl || !orderSummaryEl || !checkoutBtn || !emptyCartMessage) {
        const missingElements = [];
        if (!cartItemsEl) missingElements.push('cartItems');
        if (!orderSummaryEl) missingElements.push('orderSummary');
        if (!checkoutBtn) missingElements.push('checkoutBtn');
        if (!emptyCartMessage) missingElements.push('emptyCartMessage');
        const msg = 'Missing elements: ' + missingElements.join(', ');
        if (debugEl) {
            debugEl.textContent = msg;
            debugEl.classList.remove('d-none');
        }
        return;
    }

    const cartData = getCart();

    if (debugEl) {
        debugEl.textContent = 'Loaded ' + (cartData ? cartData.length : 0) + ' items from localStorage';
        debugEl.classList.remove('d-none');
    }

    if (!cartData || cartData.length === 0) {
        cartItemsEl.innerHTML = '';
        orderSummaryEl.innerHTML = '';
        checkoutBtn.classList.add('d-none');
        emptyCartMessage.classList.remove('d-none');
        return;
    }

    emptyCartMessage.classList.add('d-none');
    checkoutBtn.classList.remove('d-none');

    // Render cart items with responsive design
    let html = '';
    cartData.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        html += `
            <tr class="cart-item border-bottom">
                <td class="ps-4 py-4">
                    <div class="d-flex align-items-center flex-wrap">
                        <img src="${item.image}" alt="${item.name}" class="me-3 rounded mb-2 mb-md-0" style="width: 60px; height: 60px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 fw-bold">${item.name}</h6>
                            <small class="text-muted d-block d-md-none">Price: ${formatPrice(item.price)}</small>
                            <small class="text-muted d-block d-md-none">Qty: ${item.quantity}</small>
                        </div>
                    </div>
                </td>
                <td class="text-center py-4 d-none d-md-table-cell">${formatPrice(item.price)}</td>
                <td class="text-center py-4">
                    <div class="d-flex justify-content-center align-items-center">
                        <button class="quantity-btn me-2" onclick="changeQuantity(${index}, -1)">–</button>
                        <span class="px-3 fw-bold">${item.quantity}</span>
                        <button class="quantity-btn ms-2" onclick="changeQuantity(${index}, 1)">+</button>
                    </div>
                </td>
                <td class="text-end pe-4 py-4 fw-bold">${formatPrice(itemTotal)}</td>
                <td class="py-4 text-end">
                    <button class="btn btn-sm btn-outline-danger rounded-circle" onclick="removeItem(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });


    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const delivery = subtotal > 5000 ? 0 : 500;
    const total = subtotal + delivery;
    const itemCount = cartData.reduce((sum, item) => sum + item.quantity, 0);

    // Render order summary
    orderSummaryEl.innerHTML = `
        <div class="d-flex justify-content-between mb-3">
            <span>Subtotal (${itemCount} items)</span>
            <span class="fw-bold">${formatPrice(subtotal)}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
            <span>Delivery</span>
            <span class="text-success">${delivery === 0 ? 'Free' : formatPrice(delivery)}</span>
        </div>
        <div class="d-flex justify-content-between mb-3">
            <span>Discount</span>
            <span class="text-danger">- £0.00</span>
        </div>
        <hr>
        <div class="d-flex justify-content-between mb-4">
            <h5 class="mb-0">Total</h5>
            <h5 class="mb-0 text-success">${formatPrice(total)}</h5>
        </div>
    `;

    localStorage.setItem('cartTotal', total);
}

// Change item quantity
function changeQuantity(index, delta) {
    const cartData = getCart();
    if (cartData[index]) {
        cartData[index].quantity = Math.max(1, cartData[index].quantity + delta);
        localStorage.setItem('cart', JSON.stringify(cartData));
    }
    renderCart();
    updateCartCount();
}

// Remove item from cart
function removeItem(index) {
    const cartData = getCart();
    cartData.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cartData));
    renderCart();
    updateCartCount();
}

// Add item to cart
function addToCart(id, name, price, image) {
    // ensure price is integer pence
    let p = parseInt(price, 10);
    if (isNaN(p) || p < 0) p = 0;
    let item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += 1;
    } else {
        cart.push({ id, name, price: p, image, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    // Optional feedback
    const btn = document.querySelector(`.add-to-cart[data-id="${id}"]`);
    if (btn) {
        const orig = btn.innerHTML;
        btn.innerHTML = 'Added ✓';
        btn.disabled = true;
        setTimeout(() => {
            btn.innerHTML = orig;
            btn.disabled = false;
        }, 1200);
    }
}

// Save to localStorage
function saveCart() {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        // Silently fail - storage not available
    }
}

// Reload cart from localStorage
function reloadCart() {
    try {
        const saved = localStorage.getItem('cart');
        if (saved) {
            cart = JSON.parse(saved);
        }
    } catch (e) {
        // Silently fail - storage not available
    }
}

// Update cart badge
function updateCartCount() {
    const countEl = document.getElementById('cart-count');
    const countMobileEl = document.getElementById('cart-count-mobile');

    const total = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (countEl) {
        countEl.textContent = total;
    }

    if (countMobileEl) {
        countMobileEl.textContent = total;
    }
}

// Update user badge and ensure user icon links point to dashboard
function updateUserBadge() {
    // compute badge count based on stored user data
    let count = 0;
    try {
        const user = JSON.parse(localStorage.getItem('user') || 'null');
        if (user) {
            if (user.notifications) {
                count = user.notifications;
            }
            if (count === 0) {
                // show at least a dot/1 if user exists
                count = 1;
            }
        }
    } catch (e) {
        // ignore parse errors
    }

    // iterate through all anchors that have a user icon
    document.querySelectorAll('.nav-icon').forEach(anchor => {
        if (!anchor.querySelector('.fa-user')) return;
        // ensure it links to dashboard
        anchor.setAttribute('href', 'user-dashboard.html');

        // find or create badge
        let badge = anchor.querySelector('.position-absolute.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary';
            badge.style.display = 'none';
            anchor.appendChild(badge);
        }

        if (count > 0) {
            badge.textContent = count;
            badge.style.display = '';
        } else {
            badge.style.display = 'none';
        }
    });
}

// ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    reloadCart();
    updateCartCount();
    updateUserBadge();

    // Initialize cart rendering if on cart page
    if (document.getElementById('cartItems')) {
        renderCart();
    }
});

document.addEventListener('click', e => {
    // support clicks on icon or child elements inside button
    const btn = e.target.closest('.add-to-cart');
    if (btn) {
        addToCart(
            btn.dataset.id,
            btn.dataset.name,
            btn.dataset.price,
            btn.dataset.image
        );
    }
});

// Init on page load
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();       // comment out if keeping static HTML
    updateCartCount();
    updateUserBadge();
});
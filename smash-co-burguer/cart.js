if (localStorage.getItem("smashCurrency") !== "USD") {
    localStorage.removeItem("cart");
    localStorage.removeItem("deliveryInfo");
    localStorage.removeItem("currentOrder");
    localStorage.removeItem("orderNumber");
    localStorage.setItem("smashCurrency", "USD");
}

function getCart() {
    try {
        const stored = JSON.parse(localStorage.getItem("cart") || "[]");
        return Array.isArray(stored) ? stored.filter(item =>
            item && typeof item.id === "string" && typeof item.name === "string" &&
            Number.isFinite(Number(item.price)) && Number.isFinite(Number(item.quantity)) &&
            Number(item.price) >= 0 && Number(item.quantity) > 0
        ) : [];
    } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        console.error("The saved cart was invalid and has been cleared.", error);
        localStorage.removeItem("cart");
        return [];
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existing = cart.find(item => item.id === product.id);
    if (existing) existing.quantity += product.quantity;
    else cart.push(product);
    saveCart(cart);
}

function updateCartCount() {
    const count = getCart().reduce((total, item) => total + Number(item.quantity), 0);
    document.querySelectorAll(".cart-count").forEach(element => {
        element.textContent = count;
        element.setAttribute("aria-label", `${count} items in cart`);
    });
}

function changeQuantity(id, amount) {
    const cart = getCart();
    const item = cart.find(product => product.id === id);
    if (!item) return;
    item.quantity += amount;
    saveCart(cart.filter(product => product.quantity > 0));
    renderCart();
}

function removeItem(id) {
    saveCart(getCart().filter(item => item.id !== id));
    renderCart();
}

function getSubtotal() {
    return getCart().reduce((total, item) => total + Number(item.price) * Number(item.quantity), 0);
}

function getDeliveryFee() {
    let deliveryInfo;
    try {
        deliveryInfo = JSON.parse(localStorage.getItem("deliveryInfo") || "null");
    } catch (error) {
        if (!(error instanceof SyntaxError)) throw error;
        console.error("The saved delivery details were invalid.", error);
        localStorage.removeItem("deliveryInfo");
    }
    if (deliveryInfo && deliveryInfo.speed === "priority") return 5.99;
    return getSubtotal() >= 35 ? 0 : 3.99;
}

function renderCart() {
    const container = document.getElementById("cart-content");
    if (!container) return;
    if (!container.dataset.actionsBound) {
        container.addEventListener("click", event => {
            const button = event.target.closest("[data-action]");
            if (!button || !container.contains(button)) return;
            if (button.dataset.action === "remove") removeItem(button.dataset.id);
            if (button.dataset.action === "increase") changeQuantity(button.dataset.id, 1);
            if (button.dataset.action === "decrease") changeQuantity(button.dataset.id, -1);
        });
        container.dataset.actionsBound = "true";
    }
    const cart = getCart();
    if (!cart.length) {
        container.innerHTML = `<div class="empty-state"><span class="empty-icon">🛍️</span><h2>Your next smash starts here.</h2><p>Your cart is empty. Pick your favorites from the menu.</p><a href="menu.html" class="btn btn-primary">Explore the menu <span>↗</span></a></div>`;
        return;
    }

    const subtotal = getSubtotal();
    const deliveryInfo = localStorage.getItem("deliveryInfo");
    const delivery = deliveryInfo ? getDeliveryFee() : null;
    container.innerHTML = `
        <div class="cart-layout">
            <section class="cart-items" aria-label="Items in your cart">
                ${cart.map(item => `
                    <article class="cart-item">
                        <div class="cart-item-image">${item.image ? `<img src="${escapeHTML(item.image)}" alt="">` : escapeHTML(item.emoji || "🍔")}</div>
                        <div class="cart-item-info">
                            <h2>${escapeHTML(item.name)}</h2>
                            <p>${escapeHTML(item.description || "Made fresh, the way we like it.")}</p>
                            <button type="button" class="remove-item" data-action="remove" data-id="${escapeHTML(item.id)}">Remove</button>
                        </div>
                        <div class="cart-item-right">
                            <strong>${formatPrice(item.price * item.quantity)}</strong>
                            <div class="cart-quantity">
                                <button type="button" data-action="decrease" data-id="${escapeHTML(item.id)}" aria-label="Decrease quantity">−</button>
                                <span>${item.quantity}</span>
                                <button type="button" data-action="increase" data-id="${escapeHTML(item.id)}" aria-label="Aumentar quantidade">+</button>
                            </div>
                        </div>
                    </article>`).join("")}
                <a class="continue-shopping" href="menu.html">← Keep browsing</a>
            </section>
            <aside class="summary">
                <h2>Order summary <span>✳</span></h2>
                <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div>
                <div class="summary-row"><span>Delivery</span><strong>${delivery === null ? "Calculated next" : formatPrice(delivery)}</strong></div>
                <div class="summary-row total"><span>Total</span><strong>${formatPrice(subtotal + (delivery || 0))}</strong></div>
                <p class="summary-note">${delivery === null ? "Delivery is calculated in the next step." : "Fee reflects your selected delivery speed."}</p>
                <a href="delivery.html" class="btn btn-primary">Enter delivery details <span>→</span></a>
                <div class="safe-checkout">🔒 Secure checkout · Demo order</div>
            </aside>
        </div>`;

}

function renderCheckoutSummary(elementId) {
    const container = document.getElementById(elementId);
    if (!container) return;
    const cart = getCart();
    if (!cart.length) {
        container.innerHTML = `<h2>Your cart is empty</h2><p>Head back to the menu and pick your favorites.</p><a href="menu.html" class="btn btn-primary">View the menu</a>`;
        return;
    }
    const subtotal = getSubtotal();
    const delivery = getDeliveryFee();
    container.innerHTML = `
        <h2>Your order <span>${cart.reduce((sum, item) => sum + item.quantity, 0)} items</span></h2>
        <div class="mini-items">${cart.map(item => `<div class="order-mini-item"><span>${item.quantity} × ${escapeHTML(item.name)}</span><strong>${formatPrice(item.price * item.quantity)}</strong></div>`).join("")}</div>
        <div class="summary-row"><span>Subtotal</span><strong>${formatPrice(subtotal)}</strong></div>
        <div class="summary-row"><span>Delivery</span><strong>${formatPrice(delivery)}</strong></div>
        <div class="checkout-total"><span>Total</span><strong>${formatPrice(subtotal + delivery)}</strong></div>`;
}

updateCartCount();
renderCart();

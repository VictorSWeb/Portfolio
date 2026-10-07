const checkoutForm = document.getElementById("checkout-form");
const deliveryInfo = JSON.parse(localStorage.getItem("deliveryInfo") || "null");

if (!getCart().length) {
    window.location.replace("menu.html");
} else if (!deliveryInfo || !deliveryInfo.address) {
    window.location.replace("delivery.html");
} else {
    const destination = document.getElementById("checkout-address");
    destination.textContent = `${deliveryInfo.address}${deliveryInfo.unit ? `, ${deliveryInfo.unit}` : ""} · ${deliveryInfo.city}, ${deliveryInfo.state} ${deliveryInfo.zip}`;
    checkoutForm.addEventListener("submit", event => {
        event.preventDefault();
        if (!checkoutForm.reportValidity()) return;
        const name = document.getElementById("customer-name").value.trim();
        const phone = document.getElementById("customer-phone").value.trim();
        const payment = checkoutForm.querySelector('input[name="payment"]:checked').value;
        const orderNumber = `SC${Date.now().toString().slice(-6)}`;
        const order = {
            orderNumber,
            name,
            phone,
            payment,
            deliveryInfo,
            items: getCart(),
            subtotal: getSubtotal(),
            delivery: getDeliveryFee(),
            placedAt: Date.now(),
            status: 0
        };
        localStorage.setItem("currentOrder", JSON.stringify(order));
        localStorage.setItem("orderNumber", orderNumber);
        localStorage.removeItem("cart");
        window.location.href = "confirmation.html";
    });
}

renderCheckoutSummary("checkout-summary");

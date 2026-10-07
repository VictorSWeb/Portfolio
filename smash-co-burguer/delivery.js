const deliveryForm = document.getElementById("delivery-form");
const deliveryInputs = ["address", "unit", "city", "state", "zip"];

try {
    const savedDelivery = JSON.parse(localStorage.getItem("deliveryInfo") || "null");
    if (savedDelivery) {
        deliveryInputs.forEach(id => {
            const input = document.getElementById(id);
            if (input && savedDelivery[id]) input.value = savedDelivery[id];
        });
        if (savedDelivery.speed) {
            const speed = deliveryForm.querySelector(`input[name="speed"][value="${savedDelivery.speed}"]`);
            if (speed) speed.checked = true;
        }
    }
} catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.error("Could not load the saved delivery address.", error);
    localStorage.removeItem("deliveryInfo");
}

deliveryForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!getCart().length) {
        window.location.href = "menu.html";
        return;
    }
    if (!deliveryForm.reportValidity()) return;
    const info = Object.fromEntries(deliveryInputs.map(id => [id, document.getElementById(id).value.trim()]));
    info.speed = deliveryForm.querySelector('input[name="speed"]:checked').value;
    localStorage.setItem("deliveryInfo", JSON.stringify(info));
    window.location.href = "checkout.html";
});

deliveryForm.querySelectorAll('input[name="speed"]').forEach(input => {
    input.addEventListener("change", () => {
        const previous = JSON.parse(localStorage.getItem("deliveryInfo") || "{}");
        previous.speed = input.value;
        localStorage.setItem("deliveryInfo", JSON.stringify(previous));
        renderCheckoutSummary("delivery-summary");
    });
});

renderCheckoutSummary("delivery-summary");

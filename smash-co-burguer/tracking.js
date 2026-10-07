let currentOrder;
try {
    currentOrder = JSON.parse(localStorage.getItem("currentOrder") || "null");
} catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.error("The saved order data was invalid.", error);
    localStorage.removeItem("currentOrder");
}

const title = document.getElementById("order-title");
const statusLabel = document.getElementById("eta");
const timelineSteps = [...document.querySelectorAll(".step")];

if (!currentOrder) {
    title.textContent = "No active order";
    statusLabel.textContent = "Place an order";
    document.getElementById("tracking-message").textContent = "Once you place an order, you’ll be able to follow it here.";
    timelineSteps.forEach(step => step.classList.add("inactive"));
} else {
    title.textContent = `Order ${currentOrder.orderNumber}`;
    document.getElementById("tracking-message").textContent = `We’re getting your order ready, ${currentOrder.name}.`;

    function updateTracking() {
        const elapsed = Math.max(0, Date.now() - currentOrder.placedAt);
        const status = Math.min(3, Math.floor(elapsed / 45000));
        timelineSteps.forEach((step, index) => {
            step.classList.toggle("completed", index < status);
            step.classList.toggle("current", index === status);
        });
        const labels = ["Order confirmed", "On the griddle", "Out for delivery", "Delivered!"];
        statusLabel.textContent = labels[status];
        if (status < 3) window.setTimeout(updateTracking, 5000);
    }

    updateTracking();
}

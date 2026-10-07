let order;
try {
    order = JSON.parse(localStorage.getItem("currentOrder") || "null");
} catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.error("The saved order data was invalid.", error);
    localStorage.removeItem("currentOrder");
}

if (order && order.orderNumber) {
    document.getElementById("order-number").textContent = `Your order number: ${order.orderNumber}`;
    document.getElementById("confirmation-copy").textContent = `All set, ${order.name}! Your order is in and ready to track.`;
} else {
    document.getElementById("confirmation-title").innerHTML = "HUNGRY<br>YET?";
    document.getElementById("confirmation-copy").textContent = "You don’t have an active order yet. Pick your favorites and we’ll take it from there.";
    document.getElementById("order-number").remove();
    document.getElementById("track-order").remove();
}

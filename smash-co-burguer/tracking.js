let currentOrder;
try {
    currentOrder = JSON.parse(localStorage.getItem("currentOrder") || "null");
} catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.error("Os dados do pedido salvo estavam inválidos.", error);
    localStorage.removeItem("currentOrder");
}

const title = document.getElementById("order-title");
const statusLabel = document.getElementById("eta");
const timelineSteps = [...document.querySelectorAll(".step")];

if (!currentOrder) {
    title.textContent = "Nenhum pedido ativo";
    statusLabel.textContent = "Faça um pedido";
    document.getElementById("tracking-message").textContent = "Depois de fazer um pedido, você poderá acompanhá-lo por aqui.";
    timelineSteps.forEach(step => step.classList.add("inactive"));
} else {
    title.textContent = `Pedido ${currentOrder.orderNumber}`;
    document.getElementById("tracking-message").textContent = `Estamos preparando seu pedido, ${currentOrder.name}.`;

    function updateTracking() {
        const elapsed = Math.max(0, Date.now() - currentOrder.placedAt);
        const status = Math.min(3, Math.floor(elapsed / 45000));
        timelineSteps.forEach((step, index) => {
            step.classList.toggle("completed", index < status);
            step.classList.toggle("current", index === status);
        });
        const labels = ["Pedido confirmado", "Na chapa", "Saiu para entrega", "Entregue!"];
        statusLabel.textContent = labels[status];
        if (status < 3) window.setTimeout(updateTracking, 5000);
    }

    updateTracking();
}

let order;
try {
    order = JSON.parse(localStorage.getItem("currentOrder") || "null");
} catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    console.error("Os dados do pedido salvo estavam inválidos.", error);
    localStorage.removeItem("currentOrder");
}

if (order && order.orderNumber) {
    document.getElementById("order-number").textContent = `Número do pedido: ${order.orderNumber}`;
    document.getElementById("confirmation-copy").textContent = `Tudo certo, ${order.name}! Seu pedido foi recebido e já pode ser acompanhado.`;
} else {
    document.getElementById("confirmation-title").innerHTML = "BATEU<br>A FOME?";
    document.getElementById("confirmation-copy").textContent = "Você ainda não tem um pedido ativo. Escolha seus favoritos e a gente cuida do resto.";
    document.getElementById("order-number").remove();
    document.getElementById("track-order").remove();
}

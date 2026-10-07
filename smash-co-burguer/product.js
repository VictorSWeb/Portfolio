const productId = new URLSearchParams(window.location.search).get("id");
const product = menuProducts.find(item => item.id === productId);
const content = document.getElementById("product-content");
const preview = document.getElementById("product-preview");
const categoryNames = { burgers: "Burgers", sides: "Sides", drinks: "Drinks", combos: "Combos" };

if (!product) {
    content.innerHTML = `
        <div class="eyebrow">Oops, this one's gone</div>
        <h1>We couldn't find that item.</h1>
        <p>Head back to the menu and pick something delicious.</p>
        <a href="menu.html" class="btn btn-primary">Back to menu</a>`;
} else {
    document.title = `${product.name} — Smash & Co.`;
    preview.innerHTML = `<img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}">`;
    const optionsMarkup = product.category === "burgers" ? `
        <div class="option-group">
            <h3>Choose your sauce</h3>
            <div class="option-list">
                <label class="option"><span><input type="radio" name="sauce" value="house sauce" data-price="0" checked> House sauce</span><small>Included</small></label>
                <label class="option"><span><input type="radio" name="sauce" value="spicy sauce" data-price="0.75"> Spicy sauce</span><small>+ $0.75</small></label>
            </div>
        </div>
        <div class="option-group">
            <h3>Make it yours <small>optional</small></h3>
            <div class="option-list">
                <label class="option"><span><input type="checkbox" class="extra" value="extra cheese" data-price="1.25"> Extra cheese</span><small>+ $1.25</small></label>
                <label class="option"><span><input type="checkbox" class="extra" value="crispy bacon" data-price="1.75"> Crispy bacon</span><small>+ $1.75</small></label>
                <label class="option"><span><input type="checkbox" class="extra" value="jalapeños" data-price="0.99"> Jalapeños</span><small>+ $0.99</small></label>
            </div>
        </div>` : "";
    content.innerHTML = `
        <div class="product-meta"><span>${categoryNames[product.category] || escapeHTML(product.category)}</span><span>★ 4.9 · 300+ reviews</span></div>
        <h1>${escapeHTML(product.name)}</h1>
        <p class="product-description">${escapeHTML(product.description)}</p>
        <div class="price-large" id="total-price">${formatPrice(product.price)}</div>
        ${optionsMarkup}
        <div class="product-purchase">
            <div class="quantity" aria-label="Quantidade">
                <button type="button" id="minus" aria-label="Decrease quantity">−</button>
                <strong id="quantity" aria-live="polite">1</strong>
                <button type="button" id="plus" aria-label="Increase quantity">+</button>
            </div>
            <button class="add-cart-large" id="add-cart" type="button">Add to cart · <span id="button-price">${formatPrice(product.price)}</span></button>
        </div>
        <p class="product-note">♨️ Made fresh to order · 🛵 Estimated delivery: 30–45 min</p>`;

    let quantity = 1;
    const quantityLabel = document.getElementById("quantity");
    const totalPrice = document.getElementById("total-price");
    const buttonPrice = document.getElementById("button-price");

    function getUnitPrice() {
        const sauce = document.querySelector('input[name="sauce"]:checked');
        const extras = [...document.querySelectorAll(".extra:checked")];
        return product.price + (sauce ? Number(sauce.dataset.price) : 0) + extras.reduce((total, extra) => total + Number(extra.dataset.price), 0);
    }

    function updatePrice() {
        const total = getUnitPrice() * quantity;
        totalPrice.textContent = formatPrice(total);
        buttonPrice.textContent = formatPrice(total);
    }

    content.querySelectorAll('input[name="sauce"], .extra').forEach(input => input.addEventListener("change", updatePrice));
    document.getElementById("plus").addEventListener("click", () => {
        quantity += 1;
        quantityLabel.textContent = quantity;
        updatePrice();
    });
    document.getElementById("minus").addEventListener("click", () => {
        quantity = Math.max(1, quantity - 1);
        quantityLabel.textContent = quantity;
        updatePrice();
    });
    document.getElementById("add-cart").addEventListener("click", () => {
        const sauce = document.querySelector('input[name="sauce"]:checked');
        const extras = [...document.querySelectorAll(".extra:checked")].map(extra => extra.value);
        addToCart({
            id: `${product.id}-${sauce ? sauce.value : "padrao"}-${extras.sort().join("-")}`,
            baseId: product.id,
            name: product.name,
            price: getUnitPrice(),
            quantity,
            emoji: product.emoji,
            image: product.image,
            description: [sauce ? sauce.value : "", ...extras].filter(Boolean).join(" · ") || "Preparado do jeitinho da casa"
        });
        window.location.href = "cart.html";
    });
}

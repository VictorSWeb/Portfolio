const grid = document.getElementById("product-grid");
const search = document.getElementById("search");
const categoryButtons = document.querySelectorAll(".category-btn");
const categoryNames = { burgers: "burgers", sides: "sides", drinks: "drinks", combos: "combos" };
const requestedCategory = new URLSearchParams(window.location.search).get("category");
let currentCategory = ["burgers", "sides", "drinks", "combos"].includes(requestedCategory) ? requestedCategory : "all";

function renderProducts() {
    const query = search.value.trim().toLocaleLowerCase("en-US");
    const filtered = menuProducts.filter(product => {
        const categoryMatch = currentCategory === "all" || product.category === currentCategory;
        const searchMatch = `${product.name} ${product.description}`.toLocaleLowerCase("en-US").includes(query);
        return categoryMatch && searchMatch;
    });

    categoryButtons.forEach(button => {
        const active = button.dataset.category === currentCategory;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    grid.innerHTML = filtered.length
        ? filtered.map(product => `
            <article class="product-card">
                <a class="product-image" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="Ver ${escapeHTML(product.name)}">
                    <img src="${escapeHTML(product.image)}" alt="${escapeHTML(product.name)}" loading="lazy">
                    <span class="product-badge">${product.category === "combos" ? "Fan favorite" : "Made fresh"}</span>
                </a>
                <div class="product-info">
                    <div class="product-meta"><span>${categoryNames[product.category] || escapeHTML(product.category)}</span><span>★ 4,9</span></div>
                    <h3><a href="product.html?id=${encodeURIComponent(product.id)}">${escapeHTML(product.name)}</a></h3>
                    <p>${escapeHTML(product.description)}</p>
                    <div class="product-bottom">
                        <strong class="product-price">${formatPrice(product.price)}</strong>
                        <a class="add-btn" href="product.html?id=${encodeURIComponent(product.id)}" aria-label="Personalizar ${escapeHTML(product.name)}">+</a>
                    </div>
                </div>
            </article>`).join("")
        : `<div class="no-results"><span>🍔</span><h2>Nothing on the menu matches.</h2><p>Try another search or pick a different category.</p></div>`;
}

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        currentCategory = button.dataset.category;
        renderProducts();
    });
});

search.addEventListener("input", renderProducts);
renderProducts();

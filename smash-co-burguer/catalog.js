const menuProducts = [
    {
        id: "classic-smash",
        name: "Classic Smash",
        category: "burgers",
        price: 12.9,
        emoji: "🍔",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        description: "Two smashed beef patties, melted cheddar, pickles, and house sauce on a toasted brioche bun."
    },
    {
        id: "bbq-bacon",
        name: "BBQ Bacon",
        category: "burgers",
        price: 14.9,
        emoji: "🥓",
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=85",
        description: "Handcrafted beef, crispy bacon, cheddar, caramelized onions, and smoky barbecue sauce."
    },
    {
        id: "hot-smash",
        name: "Hot Smash",
        category: "burgers",
        price: 13.9,
        emoji: "🌶️",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
        description: "Two smashed beef patties, pepper jack, jalapeños, and our spicy house mayo."
    },
    {
        id: "mushroom-melt",
        name: "Mushroom Melt",
        category: "burgers",
        price: 13.9,
        emoji: "🍄",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=85",
        description: "Juicy beef, Swiss cheese, buttery mushrooms, and roasted garlic sauce."
    },
    {
        id: "veggie-smash",
        name: "Veggie Smash",
        category: "burgers",
        price: 11.9,
        emoji: "🥬",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=85",
        description: "Plant-based patty, cheese, crisp lettuce, tomato, and herbed mayo."
    },
    {
        id: "classic-fries",
        name: "House Fries",
        category: "sides",
        price: 4.9,
        emoji: "🍟",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
        description: "Golden, crispy on the outside and fluffy inside. Finished with our house seasoning."
    },
    {
        id: "loaded-fries",
        name: "Loaded Fries",
        category: "sides",
        price: 7.9,
        emoji: "🍟",
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=85",
        description: "Crispy fries loaded with creamy cheddar, bacon bits, and fresh scallions."
    },
    {
        id: "onion-rings",
        name: "Onion rings",
        category: "sides",
        price: 5.9,
        emoji: "🧅",
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85",
        description: "Beer-battered onion rings, made to order and served with house barbecue sauce."
    },
    {
        id: "house-lemonade",
        name: "House Lemonade",
        category: "drinks",
        price: 3.9,
        emoji: "🍋",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
        description: "Fresh-squeezed lemons, a hint of mint, and plenty of ice. 14 oz."
    },
    {
        id: "cola",
        name: "Ice-Cold Cola",
        category: "drinks",
        price: 2.9,
        emoji: "🥤",
        image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85",
        description: "Classic cola, served ice cold. 12 oz."
    },
    {
        id: "smash-combo",
        name: "Classic Combo",
        category: "combos",
        price: 18.9,
        emoji: "🍔",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        description: "A Classic Smash, house fries, and an ice-cold cola. The perfect trio."
    },
    {
        id: "double-combo",
        name: "Double Combo",
        category: "combos",
        price: 23.9,
        emoji: "🔥",
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=85",
        description: "A BBQ Bacon, loaded fries, and two ice-cold colas. Made to share (if you want)."
    }
];

function formatPrice(value) {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
    }).format(value);
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

const menuProducts = [
    {
        id: "classic-smash",
        name: "Smash Clássico",
        category: "burgers",
        price: 12.9,
        emoji: "🍔",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        description: "Dois discos de carne prensados na chapa, cheddar derretido, picles e molho da casa no pão brioche tostado."
    },
    {
        id: "bbq-bacon",
        name: "Barbecue com Bacon",
        category: "burgers",
        price: 14.9,
        emoji: "🥓",
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=85",
        description: "Carne artesanal, bacon crocante, cheddar, cebola caramelizada e molho barbecue defumado."
    },
    {
        id: "hot-smash",
        name: "Smash Picante",
        category: "burgers",
        price: 13.9,
        emoji: "🌶️",
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=900&q=85",
        description: "Dois discos de carne prensados na chapa, queijo pepper jack, jalapeños e maionese picante da casa."
    },
    {
        id: "mushroom-melt",
        name: "Cogumelos e Queijo",
        category: "burgers",
        price: 13.9,
        emoji: "🍄",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=85",
        description: "Carne suculenta, queijo suíço, cogumelos na manteiga e molho de alho assado."
    },
    {
        id: "veggie-smash",
        name: "Smash Vegetariano",
        category: "burgers",
        price: 11.9,
        emoji: "🥬",
        image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=900&q=85",
        description: "Disco vegetal, queijo, alface crocante, tomate e maionese com ervas."
    },
    {
        id: "classic-fries",
        name: "Batata da Casa",
        category: "sides",
        price: 4.9,
        emoji: "🍟",
        image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85",
        description: "Dourada e crocante por fora, macia por dentro e finalizada com o tempero da casa."
    },
    {
        id: "loaded-fries",
        name: "Batata Completa",
        category: "sides",
        price: 7.9,
        emoji: "🍟",
        image: "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?auto=format&fit=crop&w=900&q=85",
        description: "Batatas crocantes cobertas com cheddar cremoso, bacon em pedaços e cebolinha fresca."
    },
    {
        id: "onion-rings",
        name: "Anéis de Cebola",
        category: "sides",
        price: 5.9,
        emoji: "🧅",
        image: "https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=900&q=85",
        description: "Anéis de cebola empanados na cerveja, preparados na hora e servidos com molho barbecue da casa."
    },
    {
        id: "house-lemonade",
        name: "Limonada da Casa",
        category: "drinks",
        price: 3.9,
        emoji: "🍋",
        image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
        description: "Limões espremidos na hora, um toque de hortelã e bastante gelo. 414 ml."
    },
    {
        id: "cola",
        name: "Refrigerante de Cola",
        category: "drinks",
        price: 2.9,
        emoji: "🥤",
        image: "https://images.unsplash.com/photo-1581636625402-29b2a704ef13?auto=format&fit=crop&w=900&q=85",
        description: "Refrigerante de cola clássico, servido bem gelado. 355 ml."
    },
    {
        id: "smash-combo",
        name: "Combo Clássico",
        category: "combos",
        price: 18.9,
        emoji: "🍔",
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85",
        description: "Um Smash Clássico, batata da casa e um refrigerante de cola bem gelado. O trio perfeito."
    },
    {
        id: "double-combo",
        name: "Combo Duplo",
        category: "combos",
        price: 23.9,
        emoji: "🔥",
        image: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=900&q=85",
        description: "Um Barbecue com Bacon, batata completa e dois refrigerantes de cola bem gelados. Para dividir — se quiser."
    }
];

function formatPrice(value) {
    return new Intl.NumberFormat("pt-BR", {
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

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");
const triageOptions = document.querySelectorAll(".triage-option");
const triageResult = document.querySelector("#triage-result");
const faqItems = document.querySelectorAll(".faq-item");

function closeNavigation(restoreFocus = false) {
    if (!menuToggle || !navigation) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir navegação");
    navigation.classList.remove("is-open");

    if (restoreFocus) {
        menuToggle.focus();
    }
}

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Abrir navegação" : "Fechar navegação");
        navigation.classList.toggle("is-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => closeNavigation());
    });
}

triageOptions.forEach(option => {
    option.addEventListener("click", () => {
        triageOptions.forEach(item => item.classList.remove("is-selected"));
        option.classList.add("is-selected");

        const prompt = document.createElement("span");
        prompt.className = "result-prompt";
        prompt.textContent = "UM PONTO DE PARTIDA";

        const guidance = document.createElement("p");
        guidance.textContent = option.dataset.advice;

        triageResult.replaceChildren(prompt, guidance);
    });
});

faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
        if (!item.open) return;

        faqItems.forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.removeAttribute("open");
            }
        });
    });
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation(true);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 680 && menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation();
    }
});

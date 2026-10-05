const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");

function closeNavigation(restoreFocus = false) {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");

    if (restoreFocus) {
        menuToggle.focus();
    }
}

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
});

navigation.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => closeNavigation());
});

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation(true);
    }
});

window.addEventListener("resize", () => {
    if (window.innerWidth > 680 && menuToggle.getAttribute("aria-expanded") === "true") {
        closeNavigation();
    }
});

"use strict";

const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#site-navigation");

function closeNavigation(restoreFocus = false) {
    if (!menuToggle || !navigation) return;

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir navegação");
    navigation.classList.remove("is-open");

    if (restoreFocus) menuToggle.focus();
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

    document.addEventListener("keydown", event => {
        if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
            closeNavigation(true);
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 760 && menuToggle.getAttribute("aria-expanded") === "true") {
            closeNavigation();
        }
    });
}

document.querySelectorAll("[data-current-year]").forEach(element => {
    element.textContent = String(new Date().getFullYear());
});

const projectSearch = document.querySelector("#project-search");
const projectFilters = document.querySelectorAll("[data-filter]");
const projects = document.querySelectorAll("[data-project]");
const projectCount = document.querySelector("#project-count");
const emptyResults = document.querySelector("#empty-results");

if (projectSearch && projectFilters.length && projects.length && projectCount && emptyResults) {
    let activeFilter = "all";

    function updateProjects() {
        const query = projectSearch.value.trim().toLocaleLowerCase("pt-BR");
        let visibleCount = 0;

        projects.forEach(project => {
            const matchesFilter = activeFilter === "all" || project.dataset.category === activeFilter;
            const matchesSearch = project.textContent.toLocaleLowerCase("pt-BR").includes(query);
            const isVisible = matchesFilter && matchesSearch;
            project.hidden = !isVisible;
            if (isVisible) visibleCount += 1;
        });

        projectCount.textContent = `${visibleCount} ${visibleCount === 1 ? "projeto encontrado" : "projetos encontrados"}`;
        emptyResults.hidden = visibleCount !== 0;
    }

    projectSearch.addEventListener("input", updateProjects);
    projectFilters.forEach(button => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;
            projectFilters.forEach(filter => {
                filter.setAttribute("aria-pressed", String(filter === button));
            });
            updateProjects();
        });
    });

    updateProjects();
}

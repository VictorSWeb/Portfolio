function toggleService(service) {
    const details = service.nextElementSibling;
    const hint = service.querySelector(".service-hint");

    details.classList.toggle("open");

    if (details.classList.contains("open")) {
        hint.textContent = "HIDE DETAILS ↑";
    } else {
        hint.textContent = "VIEW DETAILS ↗";
    }
}
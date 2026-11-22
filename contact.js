"use strict";

const contactForm = document.querySelector("#contact-form");
const contactFields = document.querySelector("#contact-fields");
const contactStatus = document.querySelector("#contact-status");
const contactSubmit = document.querySelector("#contact-submit");
const contactMessage = document.querySelector("#contact-message");
const configuredEndpoint = window.PORTFOLIO_CONTACT_ENDPOINT;

function isValidContactEndpoint(value) {
    if (!value) return false;

    try {
        const url = new URL(value);
        const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
        const isSecure = url.protocol === "https:";
        const isLocalDevelopment = url.protocol === "http:" && isLocalHost;
        return (isSecure || isLocalDevelopment) && url.pathname.endsWith("/functions/v1/contact");
    } catch {
        return false;
    }
}

function makeSubmissionId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    const bytes = new Uint8Array(16);
    window.crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function showContactStatus(message, state) {
    contactStatus.textContent = message;
    contactStatus.dataset.state = state;
}

if (contactForm && contactFields && contactStatus && contactSubmit) {
    if (contactMessage) {
        contactMessage.addEventListener("input", () => {
            const characterCount = Array.from(contactMessage.value.trim()).length;
            contactMessage.setCustomValidity(characterCount > 0 && characterCount < 20
                ? "A mensagem precisa ter pelo menos 20 caracteres."
                : "");
        });
    }

    if (isValidContactEndpoint(configuredEndpoint)) {
        let submissionId = null;
        contactFields.disabled = false;
        showContactStatus("O formulário está pronto para receber sua mensagem.", "ready");

        contactForm.addEventListener("submit", async event => {
            event.preventDefault();
            if (!contactForm.reportValidity()) return;

            const formData = new FormData(contactForm);
            const payload = {
                id: submissionId || (submissionId = makeSubmissionId()),
                name: String(formData.get("name") || "").trim(),
                email: String(formData.get("email") || "").trim(),
                subject: String(formData.get("subject") || "").trim(),
                message: String(formData.get("message") || "").trim(),
                consent: formData.get("consent") === "on",
                website: String(formData.get("website") || "").trim()
            };

            contactFields.disabled = true;
            contactSubmit.textContent = "Enviando…";
            showContactStatus("Enviando sua mensagem.", "sending");

            const controller = new AbortController();
            const timeoutId = window.setTimeout(() => controller.abort(), 15000);

            try {
                const response = await fetch(configuredEndpoint, {
                    method: "POST",
                    mode: "cors",
                    credentials: "omit",
                    cache: "no-store",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                    signal: controller.signal
                });

                let result;
                try {
                    result = await response.json();
                } catch {
                    showContactStatus("Não foi possível confirmar o envio. Seus dados continuam no formulário; tente novamente ou use um dos contatos diretos.", "error");
                    return;
                }

                if (!response.ok || result.accepted !== true) {
                    showContactStatus(typeof result.message === "string" ? result.message : "Não foi possível enviar a mensagem. Tente novamente ou use um dos contatos diretos.", "error");
                    return;
                }

                contactForm.reset();
                submissionId = null;
                if (result.notification_sent === true) {
                    showContactStatus("Mensagem recebida. Obrigado pelo contato.", "success");
                } else {
                    showContactStatus("Sua mensagem foi recebida, mas o aviso por e-mail não foi confirmado. Se for urgente, use o e-mail direto.", "error");
                }
            } catch (error) {
                const message = error && error.name === "AbortError"
                    ? "O envio excedeu o tempo esperado. Seus dados continuam no formulário; tente novamente ou use um dos contatos diretos."
                    : "Não foi possível confirmar o envio. Seus dados continuam no formulário; tente novamente ou use um dos contatos diretos.";
                showContactStatus(message, "error");
            } finally {
                window.clearTimeout(timeoutId);
                contactFields.disabled = false;
                contactSubmit.innerHTML = 'Enviar mensagem <span aria-hidden="true">↗</span>';
            }
        });
    } else {
        contactFields.disabled = true;
        showContactStatus("O formulário online ainda não está configurado. Você pode me escrever diretamente pelo e-mail ou WhatsApp.", "error");
    }
}

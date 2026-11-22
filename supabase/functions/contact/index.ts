type ContactPayload = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    consent: boolean;
    website: string;
};

type SubmissionResult = {
    result: "created" | "duplicate" | "rate_limited";
    notification_status: "pending" | "sent" | "failed" | null;
};

type ContactEnvironment = {
    supabaseUrl: string;
    serviceRoleKey: string;
    resendApiKey: string;
    recipient: string;
    sender: string;
    siteOrigin: string;
};

const allowedSubjects = new Set([
    "Oportunidade profissional",
    "Projeto",
    "Colaboração",
    "Outro assunto",
]);
const developmentOrigins = new Set([
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]);
const maxBodyBytes = 24_000;
const upstreamTimeoutMs = 10_000;

function readSiteOrigin(): string | null {
    const siteOrigin = Deno.env.get("SITE_ORIGIN");
    if (!siteOrigin) return null;

    try {
        const origin = new URL(siteOrigin);
        const isLocalHost = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
        const isSecure = origin.protocol === "https:" || (origin.protocol === "http:" && isLocalHost);
        return isSecure && origin.origin === siteOrigin ? siteOrigin : null;
    } catch {
        return null;
    }
}

function readEnvironment(siteOrigin: string): ContactEnvironment | null {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")?.replace(/\/+$/, "");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const recipient = Deno.env.get("CONTACT_EMAIL_TO");
    const sender = Deno.env.get("CONTACT_EMAIL_FROM");

    if (!supabaseUrl || !serviceRoleKey || !resendApiKey || !recipient || !sender) {
        return null;
    }

    try {
        const supabase = new URL(supabaseUrl);
        const supabaseIsLocal = ["localhost", "127.0.0.1", "[::1]"].includes(supabase.hostname);
        const supabaseIsSecure = supabase.protocol === "https:" || (supabase.protocol === "http:" && supabaseIsLocal);
        if (!supabaseIsSecure) {
            return null;
        }
    } catch {
        return null;
    }

    return { supabaseUrl, serviceRoleKey, resendApiKey, recipient, sender, siteOrigin };
}

function corsHeaders(origin: string): Headers {
    return new Headers({
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "content-type",
        "Vary": "Origin",
    });
}

function jsonResponse(
    body: Record<string, unknown>,
    status: number,
    origin: string | null,
): Response {
    const headers = new Headers({
        "Cache-Control": "no-store",
        "Content-Type": "application/json; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Vary": "Origin",
    });

    if (origin) {
        corsHeaders(origin).forEach((value, key) => headers.set(key, value));
    }

    return new Response(JSON.stringify(body), { status, headers });
}

function isAllowedOrigin(origin: string, siteOrigin: string): boolean {
    return origin === siteOrigin || developmentOrigins.has(origin);
}

function validatePayload(value: unknown): ContactPayload | null {
    if (typeof value !== "object" || value === null || Array.isArray(value)) return null;

    const input = value as Record<string, unknown>;
    const fields = ["id", "name", "email", "subject", "message", "website"];
    if (fields.some(field => typeof input[field] !== "string")) return null;
    if (typeof input.consent !== "boolean") return null;

    const payload: ContactPayload = {
        id: (input.id as string).trim(),
        name: (input.name as string).trim(),
        email: (input.email as string).trim().toLowerCase(),
        subject: (input.subject as string).trim(),
        message: (input.message as string).trim(),
        consent: input.consent,
        website: (input.website as string).trim(),
    };

    const nameLength = Array.from(payload.name).length;
    const messageLength = Array.from(payload.message).length;
    const validUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.id);
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(payload.email);
    if (
        !validUuid ||
        nameLength < 1 ||
        nameLength > 100 ||
        payload.email.length > 254 ||
        !validEmail ||
        !allowedSubjects.has(payload.subject) ||
        messageLength < 20 ||
        messageLength > 5000 ||
        payload.consent !== true
    ) {
        return null;
    }

    return payload;
}

async function readRequestBody(
    request: Request,
): Promise<{ body: string; tooLarge: boolean }> {
    const reader = request.body?.getReader();
    if (!reader) return { body: "", tooLarge: false };

    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            totalBytes += value.byteLength;
            if (totalBytes > maxBodyBytes) {
                await reader.cancel();
                return { body: "", tooLarge: true };
            }

            chunks.push(value);
        }
    } finally {
        reader.releaseLock();
    }

    const bodyBytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
        bodyBytes.set(chunk, offset);
        offset += chunk.byteLength;
    }

    return {
        body: new TextDecoder("utf-8", { fatal: true }).decode(bodyBytes),
        tooLarge: false,
    };
}

async function createSubmission(
    environment: ContactEnvironment,
    payload: ContactPayload,
): Promise<SubmissionResult | null> {
    const response = await fetch(`${environment.supabaseUrl}/rest/v1/rpc/submit_contact_submission`, {
        method: "POST",
        headers: {
            "apikey": environment.serviceRoleKey,
            "Authorization": `Bearer ${environment.serviceRoleKey}`,
            "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(upstreamTimeoutMs),
        body: JSON.stringify({
            p_id: payload.id,
            p_name: payload.name,
            p_email: payload.email,
            p_subject: payload.subject,
            p_message: payload.message,
            p_consent: payload.consent,
        }),
    });

    if (!response.ok) {
        console.error(`Contact database RPC returned HTTP ${response.status}.`);
        return null;
    }

    const result: unknown = await response.json();
    if (!Array.isArray(result) || result.length !== 1 || typeof result[0] !== "object" || result[0] === null) {
        console.error("Contact database RPC returned an unexpected response.");
        return null;
    }

    const row = result[0] as Record<string, unknown>;
    if (row.result !== "created" && row.result !== "duplicate" && row.result !== "rate_limited") {
        console.error("Contact database RPC returned an unexpected response.");
        return null;
    }

    const notificationStatus = row.notification_status;
    if (
        notificationStatus !== null &&
        notificationStatus !== "pending" &&
        notificationStatus !== "sent" &&
        notificationStatus !== "failed"
    ) {
        console.error("Contact database RPC returned an unexpected response.");
        return null;
    }

    return { result: row.result, notification_status: notificationStatus };
}

async function updateNotificationStatus(
    environment: ContactEnvironment,
    id: string,
    status: "sent" | "failed",
): Promise<void> {
    const url = new URL(`${environment.supabaseUrl}/rest/v1/contact_submissions`);
    url.searchParams.set("id", `eq.${id}`);

    const response = await fetch(url, {
        method: "PATCH",
        headers: {
            "apikey": environment.serviceRoleKey,
            "Authorization": `Bearer ${environment.serviceRoleKey}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal",
        },
        signal: AbortSignal.timeout(upstreamTimeoutMs),
        body: JSON.stringify({ notification_status: status }),
    });

    if (!response.ok) {
        console.error(`Contact notification status update returned HTTP ${response.status}.`);
    }
}

async function sendNotification(
    environment: ContactEnvironment,
    payload: ContactPayload,
): Promise<boolean> {
    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${environment.resendApiKey}`,
            "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(upstreamTimeoutMs),
        body: JSON.stringify({
            from: environment.sender,
            to: [environment.recipient],
            reply_to: payload.email,
            subject: `Portfolio contact: ${payload.subject}`,
            text: [
                `Name: ${payload.name}`,
                `Email: ${payload.email}`,
                `Subject: ${payload.subject}`,
                "",
                payload.message,
            ].join("\n"),
        }),
    });

    if (!response.ok) {
        console.error(`Resend returned HTTP ${response.status}.`);
        return false;
    }

    return true;
}

Deno.serve(async (request: Request): Promise<Response> => {
    const origin = request.headers.get("Origin");
    const siteOrigin = readSiteOrigin();
    if (!siteOrigin) {
        console.error("Contact function is missing a valid site origin.");
        return jsonResponse({ error: "contact_service_unavailable", message: "O formulário está temporariamente indisponível." }, 503, null);
    }

    if (!origin || !isAllowedOrigin(origin, siteOrigin)) {
        return jsonResponse({ error: "origin_not_allowed", message: "Esta origem não pode enviar mensagens." }, 403, null);
    }

    const environment = readEnvironment(siteOrigin);
    if (!environment) {
        console.error("Contact function is missing required server configuration.");
        return jsonResponse({ error: "contact_service_unavailable", message: "O formulário está temporariamente indisponível." }, 503, origin);
    }

    if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== "POST") {
        return jsonResponse({ error: "method_not_allowed", message: "Método não permitido." }, 405, origin);
    }

    if (!(request.headers.get("Content-Type") || "").toLowerCase().includes("application/json")) {
        return jsonResponse({ error: "unsupported_media_type", message: "Envie os dados no formato JSON." }, 415, origin);
    }

    const declaredLength = Number(request.headers.get("Content-Length") || 0);
    if (declaredLength > maxBodyBytes) {
        return jsonResponse({ error: "payload_too_large", message: "A mensagem excede o tamanho permitido." }, 413, origin);
    }

    let body: { body: string; tooLarge: boolean };
    try {
        body = await readRequestBody(request);
    } catch {
        return jsonResponse({ error: "invalid_request", message: "Não foi possível ler a solicitação." }, 400, origin);
    }

    if (body.tooLarge) {
        return jsonResponse({ error: "payload_too_large", message: "A mensagem excede o tamanho permitido." }, 413, origin);
    }

    let parsedBody: unknown;
    try {
        parsedBody = JSON.parse(body.body);
    } catch {
        return jsonResponse({ error: "invalid_json", message: "O formato da solicitação é inválido." }, 400, origin);
    }

    const payload = validatePayload(parsedBody);
    if (!payload) {
        return jsonResponse({ error: "invalid_contact_data", message: "Confira os campos e o consentimento antes de enviar." }, 422, origin);
    }

    if (payload.website) {
        return jsonResponse({ error: "invalid_contact_data", message: "Não foi possível enviar a mensagem." }, 400, origin);
    }

    let submission: SubmissionResult | null;
    try {
        submission = await createSubmission(environment, payload);
    } catch {
        console.error("Contact database request failed.");
        return jsonResponse({ error: "contact_service_unavailable", message: "Não foi possível receber a mensagem agora. Tente novamente mais tarde." }, 503, origin);
    }

    if (!submission) {
        return jsonResponse({ error: "contact_service_unavailable", message: "Não foi possível receber a mensagem agora. Tente novamente mais tarde." }, 503, origin);
    }

    if (submission.result === "rate_limited") {
        return jsonResponse({ error: "rate_limit_exceeded", message: "Limite de mensagens atingido para este endereço. Tente novamente mais tarde." }, 429, origin);
    }

    if (submission.result === "duplicate") {
        const notificationSent = submission.notification_status === "sent";
        return jsonResponse({
            accepted: true,
            notification_sent: notificationSent,
            message: notificationSent
                ? "Mensagem recebida. Obrigado pelo contato."
                : "A mensagem foi registrada, mas o aviso por e-mail não foi confirmado.",
        }, 200, origin);
    }

    let notificationSent = false;
    try {
        notificationSent = await sendNotification(environment, payload);
    } catch {
        console.error("Contact notification request failed.");
    }

    try {
        await updateNotificationStatus(environment, payload.id, notificationSent ? "sent" : "failed");
    } catch {
        console.error("Contact notification status update failed.");
    }

    return jsonResponse({
        accepted: true,
        notification_sent: notificationSent,
        message: notificationSent
            ? "Mensagem recebida. Obrigado pelo contato."
            : "A mensagem foi registrada, mas o aviso por e-mail não foi confirmado.",
    }, notificationSent ? 200 : 202, origin);
});

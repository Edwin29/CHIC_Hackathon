export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: createCorsHeaders({
      "content-type": "application/json; charset=utf-8"
    })
  });
}

export function emptyCorsResponse(): Response {
  return new Response(null, {
    status: 204,
    headers: createCorsHeaders()
  });
}

function createCorsHeaders(headers: HeadersInit = {}): Headers {
  const corsHeaders = new Headers(headers);
  corsHeaders.set("access-control-allow-origin", "*");
  corsHeaders.set("access-control-allow-methods", "GET, OPTIONS");
  corsHeaders.set("access-control-allow-headers", "content-type");
  return corsHeaders;
}

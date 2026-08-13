import http from "node:http";
import { handler } from "../supabase/functions/weather-api/index.ts";

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://127.0.0.1:54321");

    if (url.pathname === "/") {
      response.writeHead(200, { "content-type": "application/json; charset=utf-8" });
      response.end(
        JSON.stringify({
          service: "gwinong-backend",
          status: "packet-3-weather-api",
          routes: ["/v1/weather/summary"]
        })
      );
      return;
    }

    const edgeResponse = await handler(
      new Request(url, {
        method: request.method,
        headers: request.headers
      })
    );

    response.writeHead(edgeResponse.status, Object.fromEntries(edgeResponse.headers));
    response.end(await edgeResponse.text());
  } catch (error) {
    response.writeHead(500, { "content-type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ error: "dev_server_error" }));
    console.error(error);
  }
});

server.listen(54321, "127.0.0.1", () => {
  console.log("Backend placeholder listening on http://127.0.0.1:54321");
});

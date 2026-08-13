import { createWeatherApplicationService } from "../_shared/weather/application.ts";
import { emptyCorsResponse, jsonResponse } from "../_shared/weather/http.ts";
import { isWeatherError } from "../_shared/weather/errors.ts";

declare const Deno:
  | {
      serve(handler: (request: Request) => Response | Promise<Response>): void;
    }
  | undefined;

const weatherService = createWeatherApplicationService();

export async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);

  if (request.method === "OPTIONS") {
    return emptyCorsResponse();
  }

  if (request.method !== "GET") {
    return jsonResponse({ error: "method_not_allowed" }, 405);
  }

  if (url.pathname !== "/v1/weather/summary") {
    return jsonResponse({ error: "not_found" }, 404);
  }

  const region = url.searchParams.get("region") ?? "";
  const crop = url.searchParams.get("crop") ?? undefined;

  try {
    const summary = await weatherService.getSummary({ region, crop });
    return jsonResponse(summary);
  } catch (error) {
    if (isWeatherError(error) && error.code === "unsupported_region") {
      return jsonResponse({ error: error.code }, 400);
    }

    return jsonResponse({ error: "upstream_error" }, 502);
  }
}

if (typeof Deno !== "undefined") {
  Deno.serve(handler);
}

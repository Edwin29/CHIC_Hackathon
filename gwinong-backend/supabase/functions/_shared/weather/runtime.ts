declare const Deno:
  | {
      env: {
        get(key: string): string | undefined;
      };
    }
  | undefined;

export function getKmaServiceKey(): string | null {
  if (typeof Deno !== "undefined") {
    return Deno.env.get("KMA_SERVICE_KEY") ?? null;
  }

  return process.env.KMA_SERVICE_KEY ?? null;
}


declare module "node:assert/strict" {
  interface Assert {
    equal(actual: unknown, expected: unknown, message?: string): void;
    deepEqual(actual: unknown, expected: unknown, message?: string): void;
    ok(value: unknown, message?: string): void;
    rejects(
      block: () => unknown | Promise<unknown>,
      error?: unknown,
      message?: string
    ): Promise<void>;
    throws(block: () => unknown, error?: unknown, message?: string): void;
  }

  const assert: Assert;
  export default assert;
}

declare module "node:test" {
  export function describe(name: string, fn: () => void): void;
  export function it(name: string, fn: () => void | Promise<void>): void;
}

declare const process: {
  env: Record<string, string | undefined>;
};

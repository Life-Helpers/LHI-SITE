import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

/**
 * Runs against a real Postgres when TEST_DATABASE_URL is set, e.g.
 *   TEST_DATABASE_URL=postgresql://user@localhost:5432/lhi_test npx vitest run src/lib/cms/db.test.ts
 */
const url = process.env.TEST_DATABASE_URL;

describe.skipIf(!url)("Postgres store", () => {
  it("reads the seed until saved, then keeps every concurrent change", async () => {
    process.env.DATABASE_URL = url;
    const { dbRead, dbUpdate } = await import("./db");
    const name = `test-${Date.now()}`;
    expect(await dbRead(name)).toBeUndefined();

    // 25 simultaneous appends must all survive (the advisory lock serialises them).
    await Promise.all(
      Array.from({ length: 25 }, (_, i) => dbUpdate<number[], void>(name, () => [], (items) => ({ data: [...items, i] }))),
    );
    const saved = await dbRead<number[]>(name);
    expect(saved?.slice().sort((a, b) => a - b)).toEqual(Array.from({ length: 25 }, (_, i) => i));

    const result = await dbUpdate<number[], number>(name, () => [], (items) => ({ data: items, result: items.length }));
    expect(result).toBe(25);
  });
});

import { describe, expect, it } from "vitest";
import { sha256 } from "@/src/lib/crypto";

describe("sha256", () => {
  it("produces a deterministic 64 char hash", () => {
    const hash = sha256(Buffer.from("plan-approval"));
    expect(hash).toHaveLength(64);
    expect(hash).toMatch(/^[a-f0-9]+$/);
    expect(hash).toEqual(sha256(Buffer.from("plan-approval")));
  });
});

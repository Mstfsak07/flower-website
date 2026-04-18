import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

function makeRequest(authHeader?: string) {
  return new Request("http://localhost/api/admin/orders", {
    headers: authHeader ? { authorization: authHeader } : undefined,
  });
}

describe("admin guard", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("allows requests in test mode when ADMIN_SECRET is missing", async () => {
    vi.stubEnv("NODE_ENV", "test");

    const { requireAdmin } = await import("./admin-guard");
    expect(requireAdmin(makeRequest())).toBeNull();
  });

  it("denies requests in production when ADMIN_SECRET is missing", async () => {
    vi.stubEnv("NODE_ENV", "production");

    const { requireAdmin } = await import("./admin-guard");
    const response = requireAdmin(makeRequest());

    expect(response?.status).toBe(401);
    await expect(response?.json()).resolves.toMatchObject({
      message: "Unauthorized: ADMIN_SECRET is required in production",
    });
  });

  it("denies requests with an invalid bearer token", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_SECRET", "top-secret");

    const { requireAdmin } = await import("./admin-guard");
    const response = requireAdmin(makeRequest("Bearer wrong-secret"));

    expect(response?.status).toBe(401);
  });

  it("allows requests with a valid bearer token", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("ADMIN_SECRET", "top-secret");

    const { requireAdmin } = await import("./admin-guard");
    expect(requireAdmin(makeRequest("Bearer top-secret"))).toBeNull();
  });
});

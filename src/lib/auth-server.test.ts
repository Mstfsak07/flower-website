import { beforeEach, describe, expect, it, vi } from "vitest";

describe("auth server helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("accepts demo admin credentials", async () => {
    const { verifyAdminCredentials } = await import("./auth-server");
    const user = verifyAdminCredentials("admin@lunacicek.test", "Admin123!");

    expect(user).toMatchObject({
      email: "admin@lunacicek.test",
      role: "ADMIN",
    });
  });

  it("reads a signed session from request cookies", async () => {
    const { createAuthSession, readAuthSessionFromRequest, verifyAdminCredentials } = await import(
      "./auth-server"
    );
    const adminUser = verifyAdminCredentials("admin@lunacicek.test", "Admin123!");
    const token = Buffer.from(JSON.stringify(createAuthSession(adminUser!))).toString("base64url");

    const { createHmac } = await import("node:crypto");
    const signature = createHmac("sha256", "cicekci-dev-session-secret")
      .update(token)
      .digest("base64url");

    const request = new Request("http://localhost/admin", {
      headers: {
        cookie: `cicekci_session=${token}.${signature}`,
      },
    });

    const session = readAuthSessionFromRequest(request);
    expect(session?.user.role).toBe("ADMIN");
  });
});

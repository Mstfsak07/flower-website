import { beforeEach, describe, expect, it, vi } from "vitest";

describe("auth server helpers", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("accepts demo admin credentials", async () => {
    const { verifyAdminCredentials } = await import("./auth-server");
    const user = verifyAdminCredentials("admin@irisatalier.test", "Admin123!");

    expect(user).toMatchObject({
      email: "admin@irisatalier.test",
      role: "ADMIN",
    });
  });

  it("keeps demo admin credentials enabled outside production even when database mode is active", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://demo:demo@db.example.com:5432/cicekci");

    const { verifyAdminCredentials } = await import("./auth-server");
    const user = verifyAdminCredentials("admin@irisatalier.test", "Admin123!");

    expect(user).toMatchObject({
      email: "admin@irisatalier.test",
      role: "ADMIN",
    });
  });

  it("disables demo admin credentials in production when database mode is active", async () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("DATABASE_URL", "postgresql://demo:demo@db.example.com:5432/cicekci");

    const { verifyAdminCredentials } = await import("./auth-server");
    const user = verifyAdminCredentials("admin@irisatalier.test", "Admin123!");

    expect(user).toBeNull();
  });

  it("reads a signed session from request cookies", async () => {
    vi.stubEnv("DATABASE_URL", "");

    const { createAuthSession, readAuthSessionFromRequest, verifyDemoAdminCredentials } = await import(
      "./auth-server"
    );
    const adminUser = verifyDemoAdminCredentials("admin@irisatalier.test", "Admin123!");
    expect(adminUser).not.toBeNull();
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

  it("authenticates persisted admin accounts through the shared account lookup", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://demo:demo@db.example.com:5432/cicekci");

    const findUnique = vi.fn().mockResolvedValue({
      id: "admin-1",
      email: "admin@example.com",
      name: "Admin User",
      phone: null,
      role: "ADMIN",
      passwordHash:
        "cdd7fce9cbd8e3d3522b0f794351bd3b7821cda6d7fe90582a35483a86082387",
    });

    vi.doMock("./prisma", () => ({
      prisma: {
        user: {
          findUnique,
        },
      },
    }));

    const { authenticateCustomerAccount } = await import("./auth-server");
    const user = await authenticateCustomerAccount("admin@example.com", "Admin123!");

    expect(findUnique).toHaveBeenCalledOnce();
    expect(user).toMatchObject({
      id: "admin-1",
      email: "admin@example.com",
      role: "ADMIN",
    });
  });

  it("skips repeated database attempts during cooldown after an unreachable error", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://demo:demo@db.example.com:5432/cicekci");

    const findUnique = vi
      .fn()
      .mockRejectedValue(new Error("PrismaClientInitializationError: can't reach database server"));

    vi.doMock("./prisma", () => ({
      prisma: {
        user: {
          findUnique,
        },
      },
    }));

    vi.doMock("next/headers", () => ({
      cookies: vi.fn(async () => ({
        get: () => undefined,
      })),
      headers: vi.fn(async () => new Headers()),
    }));

    const { authenticateCustomerAccount } = await import("./auth-server");

    const first = await authenticateCustomerAccount("missing@example.com", "wrongpass");
    const second = await authenticateCustomerAccount("missing@example.com", "wrongpass");

    expect(first).toBeNull();
    expect(second).toBeNull();
    expect(findUnique).toHaveBeenCalledOnce();
  });

  it("keeps the current session user when the database is unavailable", async () => {
    vi.stubEnv("DATABASE_URL", "postgresql://demo:demo@db.example.com:5432/cicekci");

    const findUnique = vi
      .fn()
      .mockRejectedValue(new Error("PrismaClientInitializationError: can't reach database server"));

    vi.doMock("./prisma", () => ({
      prisma: {
        user: {
          findUnique,
        },
      },
    }));

    vi.doMock("next/headers", () => ({
      cookies: vi.fn(async () => ({
        get: () => undefined,
      })),
      headers: vi.fn(async () => new Headers()),
    }));

    const { refreshSessionUser } = await import("./auth-server");
    const sessionUser = {
      id: "demo-admin",
      email: "admin@irisatalier.test",
      name: "Iris Atalier Admin",
      role: "ADMIN" as const,
    };

    const refreshed = await refreshSessionUser(sessionUser);

    expect(refreshed).toEqual(sessionUser);
  });
});

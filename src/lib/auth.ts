import type { AuthUser, UserRole } from "@/lib/types";

export function getUserRole(user: AuthUser | null | undefined): UserRole | undefined {
  return user?.role;
}

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === "ADMIN";
}

export function getDefaultRouteByRole(role: UserRole | null | undefined): string {
  return isAdminRole(role) ? "/admin" : "/hesabim";
}

export function sanitizeRedirectPath(path: string | null | undefined, fallback = "/hesabim") {
  if (!path || !path.startsWith("/") || path.startsWith("//")) {
    return fallback;
  }

  return path;
}

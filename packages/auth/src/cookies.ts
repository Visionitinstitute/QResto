/**
 * Returns the appropriate cookie domain for cross-subdomain authentication.
 * In production (*.meraresto.in), it returns '.meraresto.in' to allow session sharing.
 * In local development, it returns undefined to enable localhost cookies.
 */
export function getAuthCookieDomain(): string | undefined {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "meraresto.in";

  if (
    rootDomain.includes("localhost") ||
    rootDomain.includes("127.0.0.1") ||
    process.env.NODE_ENV !== "production"
  ) {
    return undefined;
  }

  // Ensure leading dot for wildcard subdomain traversal
  return rootDomain.startsWith(".") ? rootDomain : `.${rootDomain}`;
}

export function getSharedCookieOptions() {
  const domain = getAuthCookieDomain();
  return {
    domain,
    path: "/",
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };
}


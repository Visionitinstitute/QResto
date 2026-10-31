export interface DinerIdentity {
  username: string; // without @, e.g. "rahul_foodie"
  displayName: string; // e.g. "Rahul Sharma"
  phone?: string;
  favoriteHotels?: string[]; // slugs
  visitCount?: number;
  lastActive?: string;
}

const STORAGE_KEY = "meraresto_guest_identity";

/**
 * Sanitizes input string to a valid username handle:
 * only lowercase letters, numbers, and underscores (3-20 chars).
 */
export function sanitizeHandle(input: string): string {
  const cleaned = input
    .replace(/^@+/, "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 20);

  return cleaned || "diner";
}

/**
 * Ensures handle starts with '@' for visual display.
 */
export function formatHandle(handle: string): string {
  const clean = sanitizeHandle(handle);
  return `@${clean}`;
}

/**
 * Generates a clean, unique default handle from a guest's name.
 * e.g. "Rahul Sharma" -> "rahul_482"
 */
export function generateDefaultHandle(name: string): string {
  const firstWord = name.trim().split(/\s+/)[0] || "diner";
  const base = sanitizeHandle(firstWord).slice(0, 12);
  const randomSuffix = Math.floor(100 + Math.random() * 900);
  return `${base}_${randomSuffix}`;
}

/**
 * Retrieves the current diner identity from browser localStorage.
 */
export function getStoredDinerIdentity(): DinerIdentity | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && parsed.username) {
      return {
        username: sanitizeHandle(parsed.username),
        displayName: parsed.displayName || parsed.username,
        phone: parsed.phone || "",
        favoriteHotels: Array.isArray(parsed.favoriteHotels) ? parsed.favoriteHotels : [],
        visitCount: typeof parsed.visitCount === "number" ? parsed.visitCount : 1,
        lastActive: parsed.lastActive || new Date().toISOString(),
      };
    }
  } catch {
    // Ignore JSON parse errors
  }

  return null;
}

/**
 * Persists diner identity in localStorage and dispatches a storage event for reactive UI updates.
 */
export function saveDinerIdentity(updates: Partial<DinerIdentity>): DinerIdentity {
  if (typeof window === "undefined") {
    return {
      username: sanitizeHandle(updates.username || "guest"),
      displayName: updates.displayName || "Guest",
      ...updates,
    };
  }

  const existing = getStoredDinerIdentity();
  const username = sanitizeHandle(
    updates.username || existing?.username || generateDefaultHandle(updates.displayName || "diner")
  );

  const updated: DinerIdentity = {
    username,
    displayName: updates.displayName?.trim() || existing?.displayName || username,
    phone: updates.phone !== undefined ? updates.phone.trim() : existing?.phone || "",
    favoriteHotels: updates.favoriteHotels || existing?.favoriteHotels || [],
    visitCount: (existing?.visitCount || 0) + (updates.visitCount !== undefined ? 0 : 1),
    lastActive: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent("meraresto_identity_updated", { detail: updated }));
  } catch {
    // Storage quota or private browsing fallback
  }

  return updated;
}

/**
 * Toggle hotel in diner's favorites list
 */
export function toggleFavoriteHotel(slug: string): boolean {
  if (typeof window === "undefined") return false;
  const existing = getStoredDinerIdentity();
  if (!existing) return false;

  const currentFavs = existing.favoriteHotels || [];
  const exists = currentFavs.includes(slug);
  const updatedFavs = exists
    ? currentFavs.filter((s) => s !== slug)
    : [...currentFavs, slug];

  saveDinerIdentity({ ...existing, favoriteHotels: updatedFavs });
  return !exists;
}

/**
 * Checks if a hotel slug is bookmarked by diner.
 */
export function isHotelFavorite(slug: string): boolean {
  const existing = getStoredDinerIdentity();
  return Boolean(existing?.favoriteHotels?.includes(slug));
}


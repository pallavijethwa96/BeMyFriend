// BeMyFriend API client
// Works in the web app (uses localStorage) and can be adapted for React Native
// (swap the storage functions for AsyncStorage / SecureStore).
//
// Usage:
//   import { api } from "./api";
//   const { user, isNewUser } = await api.authVerify(challengeId, code);
//   const { groups } = await api.getGroups();

const BASE_URL = (typeof process !== "undefined" && process.env && process.env.API_BASE_URL) || "http://localhost:4000";

// ---- token storage (swap for native secure storage in the mobile app) ----
const storage = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
};
const ACCESS_KEY = "bmf_access";
const REFRESH_KEY = "bmf_refresh";

function getAccess() { return storage.get(ACCESS_KEY); }
function getRefresh() { return storage.get(REFRESH_KEY); }
function setTokens(access, refresh) {
  storage.set(ACCESS_KEY, access || null);
  if (refresh !== undefined) storage.set(REFRESH_KEY, refresh || null);
}
function clearTokens() { setTokens(null, null); }

// ---- core request with one automatic refresh-and-retry on 401 ----
async function request(path, { method = "GET", body, auth = true, _retried = false } = {}) {
  const headers = { "content-type": "application/json" };
  const token = getAccess();
  if (auth && token) headers.authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && !_retried && getRefresh()) {
    const refreshed = await tryRefresh();
    if (refreshed) return request(path, { method, body, auth, _retried: true });
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || { code: "error", message: "Request failed." });
  return data;
}

async function tryRefresh() {
  const refreshToken = getRefresh();
  if (!refreshToken) return false;
  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) { clearTokens(); return false; }
  const data = await res.json();
  setTokens(data.accessToken, data.refreshToken);
  return true;
}

class ApiError extends Error {
  constructor(status, error) { super(error.message); this.status = status; this.code = error.code; }
}

export const api = {
  // auth
  authStart: (email, phone) => request("/auth/start", { method: "POST", body: { email, phone }, auth: false }),
  async authVerify(challengeId, code) {
    const data = await request("/auth/verify", { method: "POST", body: { challengeId, code }, auth: false });
    setTokens(data.accessToken, data.refreshToken);
    return data; // { user, isNewUser }
  },
  async logout() {
    try { await request("/auth/logout", { method: "POST", body: { refreshToken: getRefresh() } }); } catch {}
    clearTokens();
  },
  isAuthed: () => !!getAccess(),

  // profile
  me: () => request("/me"),
  updateMe: (patch) => request("/me", { method: "PATCH", body: patch }),
  saveOnboarding: (profile) => request("/me/onboarding", { method: "PATCH", body: profile }),
  acceptConsent: (items) => request("/me/consent", { method: "POST", body: { items } }),
  deleteAccount: () => request("/me", { method: "DELETE" }),
  checkin: (mood) => request("/me/checkins", { method: "POST", body: { mood } }),

  // community
  getGroups: () => request("/groups"),
  getGroup: (slug) => request(`/groups/${slug}`),
  getFeed: (slug, cursor) => request(`/groups/${slug}/posts${cursor ? `?cursor=${encodeURIComponent(cursor)}` : ""}`),
  createPost: (slug, body, isAnonymous) => request(`/groups/${slug}/posts`, { method: "POST", body: { body, isAnonymous } }),
  getPost: (id) => request(`/posts/${id}`),
  deletePost: (id) => request(`/posts/${id}`, { method: "DELETE" }),
  support: (id) => request(`/posts/${id}/support`, { method: "POST" }),
  unsupport: (id) => request(`/posts/${id}/support`, { method: "DELETE" }),
  reply: (id, body, isAnonymous) => request(`/posts/${id}/replies`, { method: "POST", body: { body, isAnonymous } }),

  // aria
  ariaConversation: () => request("/aria/conversation"),
  ariaSend: (message) => request("/aria/messages", { method: "POST", body: { message } }),
  ariaClear: () => request("/aria/conversation", { method: "DELETE" }),

  // safety
  crisisResources: (country) => request(`/crisis-resources${country ? `?country=${encodeURIComponent(country)}` : ""}`, { auth: false }),
  report: (targetType, targetId, reason) => request("/reports", { method: "POST", body: { targetType, targetId, reason } }),
  getBlocks: () => request("/blocks"),
  block: (blockedUserId) => request("/blocks", { method: "POST", body: { blockedUserId } }),
  unblock: (userId) => request(`/blocks/${userId}`, { method: "DELETE" }),
};

export { ApiError };

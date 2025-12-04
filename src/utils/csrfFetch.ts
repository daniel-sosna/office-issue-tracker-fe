function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()!.split(";").shift() ?? null;
  return null;
}

export async function csrfFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
) {
  const token = getCookie("XSRF-TOKEN");

  const method = (init.method ?? "GET").toUpperCase();
  const headers = new Headers(init.headers ?? {});

  if (token && method !== "GET" && method !== "HEAD" && method !== "OPTIONS") {
    headers.set("X-XSRF-TOKEN", token);
  }

  return fetch(input, {
    ...init,
    headers,
    credentials: "include",
  });
}

export function stripHtml(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}
export function stripHtmlDescription(html: string): string {
  return html.replace(/<[^>]+>/g, "");
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("en-GB", { month: "long" });
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const then = new Date(dateString);

  const diffMs = now.getTime() - then.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) {
    return "just now";
  }

  const diffMinutes = Math.floor(diffSeconds / 60);

  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  }

  const hours = then.getHours().toString().padStart(2, "0");
  const minutes = then.getMinutes().toString().padStart(2, "0");
  const day = then.getDate().toString().padStart(2, "0");
  const month = then.toLocaleString("en-GB", { month: "long" });
  const year = then.getFullYear();

  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

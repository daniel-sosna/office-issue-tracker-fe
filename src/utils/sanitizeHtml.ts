import DOMPurify from "dompurify";

export function sanitizeHtml(dirty: string): string {
  if (typeof dirty !== "string") {
    return "";
  }

  const sanitizer = DOMPurify as unknown as { sanitize?: unknown };
  if (!sanitizer || typeof sanitizer.sanitize !== "function") {
    return "";
  }

  return (sanitizer.sanitize as (input: string) => string)(dirty);
}

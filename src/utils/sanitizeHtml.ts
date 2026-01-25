import createDOMPurify from "dompurify";

let DOMPurify: ReturnType<typeof createDOMPurify> | null = null;

export function sanitizeHtml(html: string): string {
  if (!DOMPurify && typeof window !== "undefined") {
    DOMPurify = createDOMPurify(window);
  }

  if (!DOMPurify) return "";

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a", "s"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

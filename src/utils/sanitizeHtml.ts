import createDOMPurify from "dompurify";

let DOMPurifyInstance: ReturnType<typeof createDOMPurify> | null = null;

export function sanitizeHtml(html: string): string {
  if (typeof window !== "undefined" && !DOMPurifyInstance) {
    DOMPurifyInstance = createDOMPurify(window);
  }

  if (!DOMPurifyInstance) return "";

  return DOMPurifyInstance.sanitize(html, {
    ALLOWED_TAGS: ["p", "br", "strong", "em", "ul", "ol", "li", "a", "s"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

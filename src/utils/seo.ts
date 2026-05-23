export interface SEOConfig {
  title: string;
  description: string;
  canonicalUrl: string;
}

/**
 * Dynamically updates head meta tags and canonical URLs for SEO optimization
 */
export function updateSEO(config: SEOConfig) {
  if (typeof window === "undefined") return;

  // Update Title
  document.title = config.title;

  const updateMeta = (nameOrProperty: string, content: string, isProperty = false) => {
    const attribute = isProperty ? "property" : "name";
    let el = document.querySelector(`meta[${attribute}="${nameOrProperty}"]`);
    if (!el) {
      el = document.createElement("meta");
      el.setAttribute(attribute, nameOrProperty);
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  updateMeta("title", config.title);
  updateMeta("description", config.description);
  updateMeta("og:title", config.title, true);
  updateMeta("og:description", config.description, true);
  updateMeta("twitter:title", config.title, true);
  updateMeta("twitter:description", config.description, true);

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute("href", config.canonicalUrl);
}

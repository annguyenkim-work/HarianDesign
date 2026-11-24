/**
 * Prefix a site-root path with Vite's configured base
 * (e.g. `/HarianDesign/` on GitHub Pages project sites).
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\//, '')}`;
}

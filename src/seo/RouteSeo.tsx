import { useLocation } from 'react-router-dom';
import Seo from './Seo';
import { getRouteSeoWithCanonical } from './routes';

/** Applies per-route meta tags from the central SEO route config. */
export default function RouteSeo() {
  const { pathname } = useLocation();
  const seo = getRouteSeoWithCanonical(pathname);

  return (
    <Seo
      title={seo.title}
      description={seo.description}
      keywords={seo.keywords}
      canonicalUrl={seo.canonicalUrl}
    />
  );
}

import { Helmet } from 'react-helmet-async';
import { DEFAULT_OG_IMAGE, SITE_NAME } from './site';

export interface SeoProps {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords?: string;
}

export default function Seo({
  title,
  description,
  canonicalUrl,
  keywords,
}: SeoProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={DEFAULT_OG_IMAGE} />
      <meta property="og:image:type" content="image/svg+xml" />
      <meta property="og:image:alt" content={SITE_NAME} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={DEFAULT_OG_IMAGE} />
      <meta property="twitter:image:alt" content={SITE_NAME} />
    </Helmet>
  );
}

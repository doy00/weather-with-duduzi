import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

const DEFAULT_OG_IMAGE = '/icons/icon-512x512.png';
const SITE_URL = 'https://galaxy-weather.app'; // 배포 후 실제 도메인으로 변경

export function SEO({
  title,
  description,
  keywords,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  ogUrl,
  canonical,
}: SEOProps) {
  const { t, i18n } = useTranslation('common');

  const defaultTitle = t('seo.defaultTitle');
  const defaultDescription = t('seo.defaultDescription');
  const defaultKeywords = t('seo.defaultKeywords');

  const fullTitle = title ? `${title} | Galaxy Weather` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalKeywords = keywords || defaultKeywords;
  const fullOgUrl = ogUrl || SITE_URL;
  const fullCanonical = canonical || fullOgUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  // 언어별 로케일 설정
  const ogLocale = i18n.language === 'ko' ? 'ko_KR' : 'en_US';
  const languageName = i18n.language === 'ko' ? 'Korean' : 'English';

  return (
    <Helmet htmlAttributes={{ lang: i18n.language }}>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:site_name" content="Galaxy Weather" />
      <meta property="og:locale" content={ogLocale} />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Galaxy Weather Team" />
      <meta name="language" content={languageName} />

      {/* Mobile App Capabilities */}
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="Galaxy Weather" />

      {/* PWA Theme */}
      <meta name="theme-color" content="#4facfe" />
    </Helmet>
  );
}

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
}

const DEFAULT_TITLE = 'Galaxy Weather - 실시간 날씨 정보';
const DEFAULT_DESCRIPTION = '실시간 날씨 정보와 시간별 예보를 제공하는 날씨 앱. 즐겨찾기 기능으로 여러 지역의 날씨를 한눈에 확인하세요.';
const DEFAULT_KEYWORDS = '날씨, 날씨 예보, 실시간 날씨, 시간별 예보, 일기예보, weather, forecast';
const DEFAULT_OG_IMAGE = '/icons/icon-512x512.png';
const SITE_URL = 'https://galaxy-weather.app'; // 배포 후 실제 도메인으로 변경

export function SEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogType = 'website',
  ogImage = DEFAULT_OG_IMAGE,
  ogUrl,
  canonical,
}: SEOProps) {
  const fullTitle = title ? `${title} | Galaxy Weather` : DEFAULT_TITLE;
  const fullOgUrl = ogUrl || SITE_URL;
  const fullCanonical = canonical || fullOgUrl;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph Tags */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:url" content={fullOgUrl} />
      <meta property="og:site_name" content="Galaxy Weather" />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />

      {/* Additional SEO Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Galaxy Weather Team" />
      <meta name="language" content="Korean" />

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

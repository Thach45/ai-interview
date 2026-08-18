import type { MetadataRoute } from 'next';

const siteUrl = 'https://arionxai.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-otp'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

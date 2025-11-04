/**
 * StructuredData - JSON-LD Schema.org markup components for SEO
 * Improves search engine understanding and enables rich snippets
 */

interface ArticleData {
  title: string;
  excerpt?: string | null;
  author?: string | null;
  published_at?: string | null;
  updated_at?: string | null;
  featured_image?: string | null;
  content_type: string;
  slug: string;
}

interface OrganizationData {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}

/**
 * Article Structured Data (for blog posts, case studies, guides, etc.)
 */
export function ArticleStructuredData({ article }: { article: ArticleData }) {
  const baseUrl = 'https://www.persx.ai';
  const contentTypeToPath: Record<string, string> = {
    'blog': 'blog',
    'case_study': 'case-studies',
    'implementation_guide': 'guides',
    'test_result': 'test-results',
    'best_practice': 'best-practices',
    'tool_guide': 'tools',
    'news': 'news',
  };

  const path = contentTypeToPath[article.content_type] || 'blog';
  const articleUrl = `${baseUrl}/${path}/${article.slug}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.title,
    author: {
      '@type': 'Person',
      name: article.author || 'PersX.ai Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'PersX.ai',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/icon.svg`,
      },
    },
    url: articleUrl,
    datePublished: article.published_at || new Date().toISOString(),
    dateModified: article.updated_at || article.published_at || new Date().toISOString(),
    ...(article.featured_image && {
      image: {
        '@type': 'ImageObject',
        url: article.featured_image,
      },
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Breadcrumb Structured Data
 */
export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; url: string }>;
}) {
  const baseUrl = 'https://www.persx.ai';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Organization Structured Data (for homepage and about page)
 */
export function OrganizationStructuredData({ org }: { org: OrganizationData }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    logo: org.logo,
    description: org.description,
    ...(org.sameAs && { sameAs: org.sameAs }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * Website Structured Data (for homepage)
 */
export function WebsiteStructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PersX.ai',
    url: 'https://www.persx.ai',
    description:
      'AI-powered personalization and experimentation strategy platform',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.persx.ai/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

/**
 * FAQ Structured Data (for pages with Q&A content)
 */
export function FAQStructuredData({
  faqs,
}: {
  faqs: Array<{ question: string; answer: string }>;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

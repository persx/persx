import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.persx.ai'

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/start`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/case-studies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/test-results`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/best-practices`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]

  // Fetch dynamic content from database
  try {
    const supabase = createClient()

    // Fetch all published content
    const { data: content, error } = await supabase
      .from('knowledge_base_content')
      .select('slug, content_type, updated_at, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })

    if (error) {
      console.error('Error fetching content for sitemap:', error)
      return staticPages
    }

    if (!content) {
      return staticPages
    }

    // Map content types to URL paths
    const contentTypeToPath: Record<string, string> = {
      'blog': 'blog',
      'case_study': 'case-studies',
      'implementation_guide': 'guides',
      'test_result': 'test-results',
      'best_practice': 'best-practices',
      'tool_guide': 'tools',
      'news': 'news',
    }

    // Generate dynamic entries
    const dynamicEntries: MetadataRoute.Sitemap = content.map((item) => {
      const path = contentTypeToPath[item.content_type] || 'blog'
      const lastMod = item.updated_at || item.published_at || new Date().toISOString()

      return {
        url: `${baseUrl}/${path}/${item.slug}`,
        lastModified: new Date(lastMod),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    })

    return [...staticPages, ...dynamicEntries]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}

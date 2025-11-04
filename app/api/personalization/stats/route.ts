import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const INDUSTRIES = [
  'eCommerce',
  'Healthcare',
  'Financial Services',
  'Education',
  'B2B/SaaS',
]

export async function GET() {
  try {
    const supabase = await createClient()

    // Fetch all static pages with content blocks
    const { data: pages, error } = await supabase
      .from('knowledge_base_content')
      .select('id, title, slug, content_blocks')
      .eq('content_type', 'static_page')
      .not('content_blocks', 'is', null)

    if (error) {
      console.error('Error fetching pages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch pages' },
        { status: 500 }
      )
    }

    if (!pages) {
      return NextResponse.json({
        totalPages: 0,
        pagesWithPersonalization: 0,
        totalBlocks: 0,
        blocksWithPersonalization: 0,
        coverageByIndustry: {},
        pageDetails: [],
      })
    }

    let totalBlocks = 0
    let blocksWithPersonalization = 0
    const coverageByIndustry: Record<string, number> = {}

    // Initialize industry coverage
    INDUSTRIES.forEach(industry => {
      coverageByIndustry[industry] = 0
    })

    const pageDetails = pages.map((page: any) => {
      const blocks = (page.content_blocks || []) as any[]
      const personalizedBlocks = blocks.filter(
        block => block.data?.personalization?.enabled
      )

      const industriesWithVariants = new Set<string>()
      const allIndustriesNeeded = new Set<string>()

      // Count blocks and variants
      blocks.forEach(block => {
        totalBlocks++

        if (block.data?.personalization?.enabled) {
          blocksWithPersonalization++

          const variants = block.data.personalization.industryVariants || {}

          // Count industries that have variants
          Object.keys(variants).forEach(industry => {
            if (variants[industry] && Object.keys(variants[industry]).length > 0) {
              industriesWithVariants.add(industry)
              coverageByIndustry[industry] = (coverageByIndustry[industry] || 0) + 1
            }
          })

          // All industries should ideally have variants if personalization is enabled
          INDUSTRIES.forEach(industry => allIndustriesNeeded.add(industry))
        }
      })

      const industries = Array.from(industriesWithVariants)
      const missingIndustries = Array.from(allIndustriesNeeded).filter(
        industry => !industriesWithVariants.has(industry)
      )

      return {
        id: page.id,
        title: page.title,
        slug: page.slug || '',
        totalBlocks: blocks.length,
        personalizedBlocks: personalizedBlocks.length,
        industries,
        missingIndustries,
      }
    })

    const pagesWithPersonalization = pageDetails.filter(
      (page: any) => page.personalizedBlocks > 0
    ).length

    return NextResponse.json({
      totalPages: pages.length,
      pagesWithPersonalization,
      totalBlocks,
      blocksWithPersonalization,
      coverageByIndustry,
      pageDetails: pageDetails.sort((a: any, b: any) => b.personalizedBlocks - a.personalizedBlocks),
    })
  } catch (error) {
    console.error('Error calculating personalization stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

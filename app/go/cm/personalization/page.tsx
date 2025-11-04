'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface PersonalizationStats {
  totalPages: number
  pagesWithPersonalization: number
  totalBlocks: number
  blocksWithPersonalization: number
  coverageByIndustry: Record<string, number>
  pageDetails: Array<{
    id: string
    title: string
    slug: string
    totalBlocks: number
    personalizedBlocks: number
    industries: string[]
    missingIndustries: string[]
  }>
}

const INDUSTRIES = [
  { id: "eCommerce", label: "eCommerce", icon: "🛒" },
  { id: "Healthcare", label: "Healthcare", icon: "🏥" },
  { id: "Financial Services", label: "Financial Services", icon: "💳" },
  { id: "Education", label: "Education", icon: "🎓" },
  { id: "B2B/SaaS", label: "B2B/SaaS", icon: "💼" },
]

export default function PersonalizationManagementPage() {
  const [stats, setStats] = useState<PersonalizationStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/personalization/stats')
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Failed to fetch personalization stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Personalization Management</h1>
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Personalization Management</h1>
          <div className="text-red-500">Failed to load personalization statistics</div>
        </div>
      </div>
    )
  }

  const personalizationPercentage = stats.totalPages > 0
    ? Math.round((stats.pagesWithPersonalization / stats.totalPages) * 100)
    : 0

  const blockPersonalizationPercentage = stats.totalBlocks > 0
    ? Math.round((stats.blocksWithPersonalization / stats.totalBlocks) * 100)
    : 0

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Personalization Management</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage personalized content variants across industries and scenarios
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Pages with Personalization
              </div>
              <div className="text-3xl font-bold mb-1">
                {stats.pagesWithPersonalization} / {stats.totalPages}
              </div>
              <div className="text-sm text-muted-foreground">
                {personalizationPercentage}% coverage
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Personalized Blocks
              </div>
              <div className="text-3xl font-bold mb-1">
                {stats.blocksWithPersonalization} / {stats.totalBlocks}
              </div>
              <div className="text-sm text-muted-foreground">
                {blockPersonalizationPercentage}% coverage
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Industries Supported
              </div>
              <div className="text-3xl font-bold mb-1">
                {INDUSTRIES.length}
              </div>
              <div className="text-sm text-muted-foreground">
                {INDUSTRIES.map(i => i.icon).join(' ')}
              </div>
            </CardContent>
          </Card>

          <Card className="card-elevated">
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground mb-1">
                Total Variants
              </div>
              <div className="text-3xl font-bold mb-1">
                {Object.values(stats.coverageByIndustry).reduce((sum, count) => sum + count, 0)}
              </div>
              <div className="text-sm text-muted-foreground">
                Across all industries
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Industry Coverage */}
        <Card className="card-elevated mb-8">
          <CardHeader>
            <CardTitle>Coverage by Industry</CardTitle>
            <CardDescription>Variant distribution across all industries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {INDUSTRIES.map(industry => {
                const coverage = stats.coverageByIndustry[industry.id] || 0
                const percentage = stats.blocksWithPersonalization > 0
                  ? Math.round((coverage / stats.blocksWithPersonalization) * 100)
                  : 0

                return (
                  <div key={industry.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span>{industry.icon}</span>
                        <span className="font-medium">{industry.label}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {coverage} variants ({percentage}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Page Details */}
        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Pages & Variants</CardTitle>
            <CardDescription>Personalization status for each page</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {stats.pageDetails.map(page => {
                const coveragePercentage = page.totalBlocks > 0
                  ? Math.round((page.personalizedBlocks / page.totalBlocks) * 100)
                  : 0

                return (
                  <div key={page.id} className="p-6 hover:bg-accent/30 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">{page.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          /{page.slug}
                        </p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/go/cm/content/${page.id}`}>
                          Edit Page
                        </Link>
                      </Button>
                    </div>

                    <div className="flex items-center gap-6 mb-3">
                      <div className="text-sm">
                        <span className="font-medium">{page.personalizedBlocks}</span>
                        <span className="text-gray-600 dark:text-gray-400"> / {page.totalBlocks} blocks personalized</span>
                        <span className="ml-2 text-gray-500">({coveragePercentage}%)</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {INDUSTRIES.map(industry => {
                        const hasVariant = page.industries.includes(industry.id)

                        return (
                          <Badge
                            key={industry.id}
                            variant={hasVariant ? "default" : "outline"}
                            className="flex items-center gap-1.5"
                          >
                            <span>{industry.icon}</span>
                            <span>{industry.label}</span>
                            {hasVariant ? <span>✓</span> : <span>−</span>}
                          </Badge>
                        )
                      })}
                    </div>

                    {page.missingIndustries.length > 0 && (
                      <Alert variant="destructive" className="mt-3">
                        <AlertTitle>⚠ Missing Variants</AlertTitle>
                        <AlertDescription>
                          This page needs personalization for: {page.missingIndustries.join(', ')}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                )
              })}

              {stats.pageDetails.length === 0 && (
                <div className="p-8 text-center text-muted-foreground">
                  No pages with personalization found. Start by enabling personalization on content blocks.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• Use industry-specific terminology in variants</li>
                  <li>• Keep headline length consistent across variants</li>
                  <li>• Test variants with real users when possible</li>
                  <li>• Update all variants when changing core messaging</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Tips</h4>
                <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                  <li>• Use the PersonalizationManager in block editors</li>
                  <li>• Copy default content to create new variants</li>
                  <li>• Check coverage before publishing new pages</li>
                  <li>• Review missing variants weekly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

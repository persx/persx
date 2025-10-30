import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as cheerio from "cheerio";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { url } = await request.json();

    if (!url) {
      return NextResponse.json(
        { error: "URL is required" },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 }
      );
    }

    // Fetch the URL
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PersX Content Curator/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract metadata from various sources (prioritize Open Graph, then meta tags, then fallbacks)
    const metadata = {
      title:
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("title").text() ||
        "",

      source_name:
        $('meta[property="og:site_name"]').attr("content") ||
        parsedUrl.hostname.replace("www.", "") ||
        "",

      source_author:
        $('meta[name="author"]').attr("content") ||
        $('meta[property="article:author"]').attr("content") ||
        $('[rel="author"]').text() ||
        "",

      source_published_date: extractPublishedDate($),

      summary:
        $('meta[property="og:description"]').attr("content") ||
        $('meta[name="description"]').attr("content") ||
        $('meta[name="twitter:description"]').attr("content") ||
        "",

      tags: extractTags($),
    };

    // Clean up the extracted data
    const cleanedMetadata = {
      title: metadata.title.trim(),
      source_name: metadata.source_name.trim(),
      source_author: metadata.source_author.trim(),
      source_published_date: metadata.source_published_date,
      summary: metadata.summary.trim(),
      tags: metadata.tags,
    };

    return NextResponse.json(cleanedMetadata, { status: 200 });
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while fetching metadata" },
      { status: 500 }
    );
  }
}

// Helper function to extract published date from various sources
function extractPublishedDate($: cheerio.CheerioAPI): string {
  const dateString =
    $('meta[property="article:published_time"]').attr("content") ||
    $('meta[name="date"]').attr("content") ||
    $('meta[name="publishdate"]').attr("content") ||
    $('meta[property="og:updated_time"]').attr("content") ||
    $('time[datetime]').first().attr("datetime") ||
    "";

  if (!dateString) return "";

  try {
    // Parse and format as YYYY-MM-DD for the date input
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    return date.toISOString().split("T")[0];
  } catch {
    return "";
  }
}

// Helper function to extract tags from the page
function extractTags($: cheerio.CheerioAPI): string[] {
  const tags: string[] = [];

  // Extract from meta keywords
  const keywords = $('meta[name="keywords"]').attr("content");
  if (keywords) {
    tags.push(...keywords.split(",").map(k => k.trim()));
  }

  // Extract from article:tag meta tags
  $('meta[property="article:tag"]').each((_, el) => {
    const tag = $(el).attr("content");
    if (tag) tags.push(tag.trim());
  });

  // Remove duplicates and empty strings
  return Array.from(new Set(tags.filter(Boolean))).slice(0, 10); // Limit to 10 tags
}

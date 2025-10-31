/**
 * IndexNow API Integration
 * Submits URLs to Bing, Yandex, and other search engines for instant indexing
 * https://www.indexnow.org/documentation
 */

const INDEXNOW_KEY = "fb1570a6b80f4effbd6fb11cec6e0dbe";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://www.persx.ai";
const KEY_LOCATION = `${SITE_URL}/fb1570a6b80f4effbd6fb11cec6e0dbe.txt`;

// IndexNow API endpoint (works for Bing, Yandex, etc.)
const INDEXNOW_API = "https://api.indexnow.org/indexnow";

interface IndexNowResponse {
  success: boolean;
  error?: string;
}

/**
 * Submit a single URL or multiple URLs to IndexNow
 * @param urls - Single URL string or array of URLs to submit
 * @returns Promise with success status
 */
export async function submitToIndexNow(
  urls: string | string[]
): Promise<IndexNowResponse> {
  try {
    // Ensure urls is an array
    const urlList = Array.isArray(urls) ? urls : [urls];

    // Filter out any invalid URLs and ensure they're absolute
    const validUrls = urlList
      .map((url) => {
        // If relative URL, make it absolute
        if (url.startsWith("/")) {
          return `${SITE_URL}${url}`;
        }
        return url;
      })
      .filter((url) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      });

    if (validUrls.length === 0) {
      return {
        success: false,
        error: "No valid URLs to submit",
      };
    }

    // Prepare the request payload
    const payload = {
      host: new URL(SITE_URL).hostname.replace("www.", ""), // persx.ai
      key: INDEXNOW_KEY,
      keyLocation: KEY_LOCATION,
      urlList: validUrls,
    };

    console.log("[IndexNow] Submitting URLs:", validUrls);

    // Submit to IndexNow API
    const response = await fetch(INDEXNOW_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(payload),
    });

    // IndexNow returns 200 for success, 202 for accepted
    if (response.ok || response.status === 202) {
      console.log("[IndexNow] Successfully submitted URLs");
      return { success: true };
    } else {
      const errorText = await response.text();
      console.error("[IndexNow] Error response:", response.status, errorText);
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText}`,
      };
    }
  } catch (error) {
    console.error("[IndexNow] Submission error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Generate URL for a content item based on its type and slug
 * @param contentType - Type of content (blog, news, etc.)
 * @param slug - URL slug
 * @returns Full URL to the content
 */
export function getContentUrl(
  contentType: string,
  slug: string
): string {
  const typeToPath: Record<string, string> = {
    blog: "/blog",
    case_study: "/case-studies",
    implementation_guide: "/guides",
    test_result: "/test-results",
    best_practice: "/best-practices",
    tool_guide: "/tools",
    news: "/news",
  };

  const basePath = typeToPath[contentType] || `/${contentType}`;
  return `${SITE_URL}${basePath}/${slug}`;
}

/**
 * Submit content URL to IndexNow when published
 * @param contentType - Type of content
 * @param slug - URL slug
 * @returns Promise with success status
 */
export async function submitContentToIndexNow(
  contentType: string,
  slug: string
): Promise<IndexNowResponse> {
  const url = getContentUrl(contentType, slug);
  return submitToIndexNow(url);
}

/**
 * Submit multiple content URLs to IndexNow
 * @param items - Array of {contentType, slug} objects
 * @returns Promise with success status
 */
export async function submitMultipleContentToIndexNow(
  items: Array<{ contentType: string; slug: string }>
): Promise<IndexNowResponse> {
  const urls = items.map((item) => getContentUrl(item.contentType, item.slug));
  return submitToIndexNow(urls);
}

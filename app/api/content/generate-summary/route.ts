import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sources, source, type, title, summary } = await request.json();

    switch (type) {
      case "title_and_summary":
        const titleAndSummary = await generateTitleAndSummary(sources);
        return NextResponse.json(titleAndSummary);

      case "title_only":
        const titleResult = await generateTitle(sources);
        return NextResponse.json({ title: titleResult });

      case "summary_only":
        const summaryResult = await generateSummary(sources);
        return NextResponse.json({ summary: summaryResult });

      case "perspective":
        const perspectiveResult = await generatePerspective(source);
        return NextResponse.json({ perspective: perspectiveResult });

      case "tags":
        const tagsResult = await generateTags(sources, title, summary);
        return NextResponse.json({ tags: tagsResult });

      default:
        return NextResponse.json(
          { error: "Invalid generation type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Summary generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}

// AI Generation Functions using OpenAI

async function generateTitle(sources: any[]): Promise<string> {
  try {
    const sourceTitles = sources.map((s: any) => s.title).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional content curator for PersX.ai, specializing in personalization and marketing technology. Create compelling, concise titles that capture the essence of multiple articles."
        },
        {
          role: "user",
          content: `Create a compelling title for a news roundup covering these articles:\n\n${sourceTitles}\n\nTitle should be:\n- Concise and engaging\n- Under 100 characters\n- Focus on the main theme or insight\n- Professional tone for B2B marketing audience`
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    return completion.choices[0]?.message.content || "Industry Insights";
  } catch (error: any) {
    console.warn("OpenAI API error, using fallback title:", error.message);
    // Fallback to simple title generation
    const titles = sources.map((s: any) => s.title).join(", ");
    return `Industry Insights: ${titles.substring(0, 80)}...`;
  }
}

async function generateSummary(sources: any[]): Promise<string> {
  try {
    const sourceDetails = sources.map((s: any) =>
      `- ${s.title}\n  ${s.originalSummary}`
    ).join("\n\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional content curator for PersX.ai, specializing in personalization and marketing technology. Write clear, insightful summaries that synthesize multiple sources."
        },
        {
          role: "user",
          content: `Create an overall summary for a news roundup covering these ${sources.length} articles:\n\n${sourceDetails}\n\nThe summary should:\n- Be 2-4 paragraphs\n- Synthesize the key themes and insights across all sources\n- Highlight what makes this collection valuable for marketing professionals\n- Maintain a professional, authoritative tone\n- Focus on actionable insights and trends`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message.content || "";
  } catch (error: any) {
    console.warn("OpenAI API error, using fallback summary:", error.message);
    // Fallback to simple summary generation
    return `This roundup covers ${sources.length} key articles discussing important developments in personalization and marketing technology. The sources highlight emerging trends, best practices, and strategic insights that are reshaping how businesses approach customer experience optimization.\n\nKey themes include:\n${sources.map((s: any, i: number) => `${i + 1}. ${s.title}`).join("\n")}\n\nThese developments represent significant shifts in the industry and offer valuable lessons for marketing professionals looking to stay ahead of the curve.`;
  }
}

async function generateTitleAndSummary(sources: any[]): Promise<{ title: string; summary: string }> {
  const [title, summary] = await Promise.all([
    generateTitle(sources),
    generateSummary(sources)
  ]);

  return { title, summary };
}

async function generatePerspective(source: any): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a senior strategist at PersX.ai, an expert in personalization and marketing technology. Your role is to provide strategic perspective on industry articles, helping practitioners understand implications and actionable next steps."
        },
        {
          role: "user",
          content: `Write a PersX.ai perspective on this article:\n\nTitle: ${source.title}\nURL: ${source.url}\nSummary: ${source.originalSummary}\n\nYour perspective should:\n- Be 100-500 words\n- Dive directly into the key insights without introductory phrases\n- Identify key strategic insights and implications\n- Connect to broader trends in personalization and marketing\n- Provide actionable recommendations for practitioners\n- Address both opportunities and challenges\n- Use clear section headers or bullet points for readability\n- Maintain a professional, consultative tone`
        }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return completion.choices[0]?.message.content || "";
  } catch (error: any) {
    console.warn("OpenAI API error, using fallback perspective:", error.message);
    // Fallback to placeholder perspective
    return `This article on "${source.title}" highlights several important considerations for personalization practitioners.\n\nThe key takeaway is that successful implementation requires a strategic approach that balances technology capabilities with business objectives. Organizations must focus on:\n\n1. **Data Foundation**: Building robust data infrastructure to support personalization efforts\n2. **Customer Understanding**: Developing deep insights into customer behavior and preferences\n3. **Testing & Optimization**: Implementing systematic experimentation to validate assumptions\n4. **Technology Integration**: Ensuring martech stack components work together seamlessly\n\nFor marketers looking to apply these insights, we recommend starting with a pilot program focused on high-impact use cases. This allows teams to build expertise and demonstrate ROI before scaling more broadly.\n\nThe article also raises important questions about privacy and personalization that every organization must address. As the landscape evolves, maintaining customer trust while delivering relevant experiences will be critical to long-term success.`;
  }
}

async function generateTags(sources: any[], title: string, summary: string): Promise<string[]> {
  try {
    const sourceDetails = sources.map((s: any) => s.title).join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a content tagging expert. Generate relevant, specific tags for marketing and personalization content. Return ONLY a comma-separated list of tags, nothing else."
        },
        {
          role: "user",
          content: `Generate 3-5 relevant tags for this news roundup:\n\nTitle: ${title}\n\nSummary: ${summary}\n\nSources:\n${sourceDetails}\n\nTags should:\n- Be specific and relevant to the content\n- Focus on personalization, marketing technology, and related topics\n- Use lowercase\n- Be single words or short phrases (2-3 words max)\n- Avoid generic terms like "marketing" or "technology"\n\nReturn ONLY the tags as a comma-separated list, no explanation.`
        }
      ],
      temperature: 0.5,
      max_tokens: 100,
    });

    const tagsString = completion.choices[0]?.message.content || "";
    return tagsString.split(",").map(tag => tag.trim()).filter(Boolean).slice(0, 5);
  } catch (error: any) {
    console.warn("OpenAI API error, using fallback tags:", error.message);
    // Fallback to common tags
    return ["personalization", "marketing", "ai", "optimization", "strategy"].slice(0, 5);
  }
}

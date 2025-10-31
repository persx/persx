import {
  BlogTemplate,
  CaseStudyTemplate,
  ImplementationGuideTemplate,
  TestResultTemplate,
  BestPracticeTemplate,
  ToolGuideTemplate,
  NewsTemplate,
} from "./templates";

type ContentType =
  | "blog"
  | "case_study"
  | "implementation_guide"
  | "test_result"
  | "best_practice"
  | "tool_guide"
  | "news";

interface ContentRendererProps {
  content: any; // knowledge_base_content record
  contentType: ContentType;
}

/**
 * ContentRenderer - Renders the appropriate template based on content type
 * Used by preview modal and preview page to display content
 */
export default function ContentRenderer({
  content,
  contentType,
}: ContentRendererProps) {
  switch (contentType) {
    case "blog":
      return <BlogTemplate content={content} />;
    case "case_study":
      return <CaseStudyTemplate content={content} />;
    case "implementation_guide":
      return <ImplementationGuideTemplate content={content} />;
    case "test_result":
      return <TestResultTemplate content={content} />;
    case "best_practice":
      return <BestPracticeTemplate content={content} />;
    case "tool_guide":
      return <ToolGuideTemplate content={content} />;
    case "news":
      return <NewsTemplate content={content} />;
    default:
      return (
        <div className="text-center py-12 text-red-500">
          Unknown content type: {contentType}
        </div>
      );
  }
}

import type { TwoColumnBlock } from "@/types/content-blocks";

interface TwoColumnBlockProps {
  data: TwoColumnBlock["data"];
}

export default function TwoColumnBlock({ data }: TwoColumnBlockProps) {
  const getVariantClasses = () => {
    switch (data.variant) {
      case "left-heavy":
        return "md:grid-cols-[2fr_1fr]";
      case "right-heavy":
        return "md:grid-cols-[1fr_2fr]";
      default:
        return "md:grid-cols-2";
    }
  };

  const getBackgroundClasses = () => {
    switch (data.background) {
      case "gray":
        return "bg-gray-100 dark:bg-gray-800";
      case "gradient":
        return "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900";
      default:
        return "bg-white dark:bg-gray-900";
    }
  };

  return (
    <section className={`py-20 ${getBackgroundClasses()}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className={`grid grid-cols-1 gap-12 items-center ${getVariantClasses()}`}>
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: data.leftColumn.content }}
          />
          <div
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: data.rightColumn.content }}
          />
        </div>
      </div>
    </section>
  );
}

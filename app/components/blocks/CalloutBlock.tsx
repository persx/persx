import type { CalloutBlock as CalloutBlockType } from "@/types/content-blocks";

interface CalloutBlockProps {
  block: CalloutBlockType;
}

const colorClasses = {
  blue: "from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800",
  amber: "from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800",
  green: "from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/20 border-green-200 dark:border-green-800",
  red: "from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 border-red-200 dark:border-red-800",
  purple: "from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800",
};

export default function CalloutBlock({ block }: CalloutBlockProps) {
  const { icon, title, content, color } = block.data;

  return (
    <section className={`mb-16 p-8 rounded-xl bg-gradient-to-r ${colorClasses[color]} border-2`}>
      <div className="flex items-start gap-4">
        {icon && <span className="text-3xl flex-shrink-0">{icon}</span>}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </div>
        </div>
      </div>
    </section>
  );
}

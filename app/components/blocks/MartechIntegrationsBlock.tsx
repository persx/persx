import type { MartechIntegrationsBlock as MartechIntegrationsBlockType } from "@/types/content-blocks";

interface MartechIntegrationsBlockProps {
  block: MartechIntegrationsBlockType;
}

export default function MartechIntegrationsBlock({ block }: MartechIntegrationsBlockProps) {
  const { heading, subheading, integrations, columns } = block.data;

  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 md:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-5",
  };

  return (
    <section className="py-20">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
        {heading}
      </h2>
      {subheading && (
        <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
          {subheading}
        </p>
      )}
      <div className={`grid ${gridCols[columns]} gap-8 items-center max-w-5xl mx-auto`}>
        {integrations.map((integration, index) => (
          <div
            key={index}
            className="flex items-center justify-center p-6 rounded-lg border border-gray-200 dark:border-gray-800 hover:shadow-lg transition-shadow"
          >
            <div className="text-center">
              <div className={`${integration.fontSize || 'text-3xl'} font-bold text-${integration.color}`}>
                {integration.name}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

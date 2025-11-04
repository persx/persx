import type { StepsBlock as StepsBlockType } from "@/types/content-blocks";
import { Card, CardContent } from "@/components/ui/card";

interface StepsBlockProps {
  block: StepsBlockType;
}

const colorClasses = {
  blue: "bg-blue-600",
  purple: "bg-purple-600",
  green: "bg-green-600",
  pink: "bg-pink-600",
  indigo: "bg-indigo-600",
};

export default function StepsBlock({ block }: StepsBlockProps) {
  const { heading, subheading, steps } = block.data;

  return (
    <section className="py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center text-gray-900 dark:text-gray-100">
        {heading}
      </h2>
      {subheading && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-12 text-center">
          {subheading}
        </p>
      )}

      <div className="space-y-6 max-w-4xl mx-auto">
        {steps.map((step, index) => (
          <Card key={index} className="card-elevated">
            <CardContent className="p-6">
              <div className="flex gap-6 items-start">
                <div className={`flex-shrink-0 w-14 h-14 rounded-full ${colorClasses[step.color]} text-white flex items-center justify-center font-bold text-xl shadow-lg`}>
                  {index + 1}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-gray-100">
                    {step.title}
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

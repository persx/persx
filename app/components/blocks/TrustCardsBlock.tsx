import type { TrustCardsBlock as TrustCardsBlockType } from "@/types/content-blocks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrustCardsBlockProps {
  block: TrustCardsBlockType;
}

const colorClasses = {
  blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
  purple: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
  green: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
  pink: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-800",
  indigo: "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800",
  amber: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
  orange: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800",
};

export default function TrustCardsBlock({ block }: TrustCardsBlockProps) {
  const { heading, cards } = block.data;

  return (
    <section className="py-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900 dark:text-gray-100">
        {heading}
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        {cards.map((card, index) => (
          <Card
            key={index}
            className={`border-2 ${colorClasses[card.color]} hover:shadow-lg transition-shadow`}
          >
            <CardHeader>
              <CardTitle className="text-2xl">{card.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                {card.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

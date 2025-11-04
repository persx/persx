import Link from "next/link";
import type { CTABannerBlock as CTABannerBlockType } from "@/types/content-blocks";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CTABannerBlockProps {
  block: CTABannerBlockType;
}

const gradientClasses = {
  "blue-purple": "from-blue-600 to-purple-600",
  "purple-pink": "from-purple-600 to-pink-600",
  "blue-green": "from-blue-600 to-green-600",
  "orange-red": "from-orange-600 to-red-600",
};

export default function CTABannerBlock({ block }: CTABannerBlockProps) {
  const { heading, description, button, gradient } = block.data;

  return (
    <section className="py-16 text-center">
      <Card className={`max-w-4xl mx-auto bg-gradient-to-r ${gradientClasses[gradient]} text-white shadow-xl border-0`}>
        <CardContent className="p-12 md:p-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {heading}
          </h2>
          <p className="text-xl mb-8 opacity-95 max-w-2xl mx-auto">
            {description}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 hover:text-blue-700 font-bold text-lg px-10"
          >
            <Link href={button.href}>
              {button.text}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

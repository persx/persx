"use client";

import type { FeatureGridBlock as FeatureGridBlockType } from "@/types/content-blocks";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureGridBlockProps {
  block: FeatureGridBlockType;
}

export default function FeatureGridBlock({ block }: FeatureGridBlockProps) {
  const { heading, features, personalization } = block.data;
  const [displayFeatures, setDisplayFeatures] = useState(features);

  useEffect(() => {
    if (personalization?.enabled && personalization.industryVariants) {
      // Get industry from sessionStorage
      if (typeof window !== 'undefined') {
        const industry = sessionStorage.getItem('userIndustry') || "";

        // Use industry-specific features if available
        if (industry && personalization.industryVariants[industry]) {
          setDisplayFeatures(personalization.industryVariants[industry]);
        } else {
          setDisplayFeatures(features);
        }
      }
    }
  }, [personalization, features]);

  return (
    <section className="py-16">
      <p className="text-xl md:text-2xl font-semibold text-center mb-12 max-w-4xl mx-auto text-gray-800 dark:text-gray-200 leading-relaxed">
        {heading}
      </p>
      <div className="grid md:grid-cols-3 gap-8">
        {displayFeatures.map((feature, index) => (
          <Card key={index} className="card-elevated text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="text-5xl mb-4">{feature.icon}</div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

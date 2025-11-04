"use client";

import type { ContentBlock } from "@/types/content-blocks";
import HeroBlock from "./HeroBlock";
import FeatureGridBlock from "./FeatureGridBlock";
import TrustCardsBlock from "./TrustCardsBlock";
import StepsBlock from "./StepsBlock";
import CTABannerBlock from "./CTABannerBlock";
import CalloutBlock from "./CalloutBlock";
import MartechIntegrationsBlock from "./MartechIntegrationsBlock";
import ContactFormBlock from "./ContactFormBlock";
import TwoColumnBlock from "./TwoColumnBlock";

interface ContentBlockRendererProps {
  blocks: ContentBlock[];
}

export default function ContentBlockRenderer({ blocks }: ContentBlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  // Sort blocks by order
  const sortedBlocks = [...blocks].sort((a, b) => a.order - b.order);

  // Full-width blocks that handle their own container
  const fullWidthBlocks = ['two_column', 'cta_banner'];

  return (
    <>
      {sortedBlocks.map((block) => {
        const isFullWidth = fullWidthBlocks.includes(block.type);

        const content = (() => {
          switch (block.type) {
            case "hero":
              return <HeroBlock key={block.id} block={block} />;
            case "feature_grid":
              return <FeatureGridBlock key={block.id} block={block} />;
            case "trust_cards":
              return <TrustCardsBlock key={block.id} block={block} />;
            case "steps":
              return <StepsBlock key={block.id} block={block} />;
            case "cta_banner":
              return <CTABannerBlock key={block.id} block={block} />;
            case "callout":
              return <CalloutBlock key={block.id} block={block} />;
            case "martech_integrations":
              return <MartechIntegrationsBlock key={block.id} block={block} />;
            case "contact_form":
              return <ContactFormBlock key={block.id} block={block} />;
            case "two_column":
              return <TwoColumnBlock key={block.id} data={block.data} />;
            default:
              console.warn(`Unknown block type: ${(block as any).type}`);
              return null;
          }
        })();

        if (isFullWidth) {
          return content;
        }

        return (
          <div key={block.id} className="max-w-6xl mx-auto px-4 md:px-6">
            {content}
          </div>
        );
      })}
    </>
  );
}

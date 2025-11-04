// Content Block System for CMS-editable pages
// These blocks preserve all existing page styles and components

export type BlockType =
  | "hero"
  | "feature_grid"
  | "trust_cards"
  | "steps"
  | "cta_banner"
  | "callout"
  | "logo_grid"
  | "contact_form"
  | "two_column"
  | "martech_integrations";

// Base interface for all blocks
export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

// Hero Block - Main page header with title, subtitle, CTAs
export interface HeroBlock extends BaseBlock {
  type: "hero";
  data: {
    title: string;
    subtitle: string;
    buttons: Array<{
      text: string;
      href: string;
      variant: "primary" | "secondary";
    }>;
    alignment?: "left" | "center" | "right";
    personalization?: {
      enabled: boolean;
      industryKey?: string; // e.g., "userIndustry" for dynamic content
    };
  };
}

// Feature Grid Block - 3-column feature cards
export interface FeatureGridBlock extends BaseBlock {
  type: "feature_grid";
  data: {
    heading: string;
    features: Array<{
      icon: string; // Emoji or icon name
      title: string;
      description: string;
    }>;
    personalization?: {
      enabled: boolean;
      industryVariants?: Record<string, Array<{
        icon: string;
        title: string;
        description: string;
      }>>;
    };
  };
}

// Trust Cards Block - Colored benefit cards
export interface TrustCardsBlock extends BaseBlock {
  type: "trust_cards";
  data: {
    heading: string;
    cards: Array<{
      title: string;
      description: string;
      color: "blue" | "purple" | "green" | "pink" | "indigo" | "amber" | "orange";
    }>;
  };
}

// Steps Block - Numbered step-by-step process
export interface StepsBlock extends BaseBlock {
  type: "steps";
  data: {
    heading: string;
    subheading?: string;
    steps: Array<{
      title: string;
      description: string;
      color: "blue" | "purple" | "green" | "pink" | "indigo";
    }>;
    structuredData?: boolean; // Generate HowTo schema
  };
}

// CTA Banner Block - Gradient call-to-action section
export interface CTABannerBlock extends BaseBlock {
  type: "cta_banner";
  data: {
    heading: string;
    description: string;
    button: {
      text: string;
      href: string;
    };
    gradient: "blue-purple" | "purple-pink" | "blue-green" | "orange-red";
  };
}

// Callout Block - Info/warning/success boxes
export interface CalloutBlock extends BaseBlock {
  type: "callout";
  data: {
    icon?: string;
    title: string;
    content: string;
    variant: "info" | "warning" | "success" | "error";
    color: "blue" | "amber" | "green" | "red" | "purple";
  };
}

// Logo Grid Block - Partner/integration logos
export interface LogoGridBlock extends BaseBlock {
  type: "logo_grid";
  data: {
    heading: string;
    subheading?: string;
    logos: Array<{
      name: string;
      color: string; // Tailwind color class
    }>;
    columns: 2 | 3 | 4 | 5;
  };
}

// Contact Form Block - Contact form with reasons
export interface ContactFormBlock extends BaseBlock {
  type: "contact_form";
  data: {
    heading: string;
    subheading?: string;
    reasons: Array<{
      title: string;
      description: string;
    }>;
    personalization?: {
      enabled: boolean;
      industryVariants?: Record<string, {
        headline: string;
        reasons: Array<{
          title: string;
          description: string;
        }>;
      }>;
    };
    formConfig: {
      nameField: boolean;
      emailField: boolean;
      messageField: boolean;
      submitText: string;
      successMessage: string;
      errorMessage: string;
    };
  };
}

// Two Column Block - Flexible two-column layouts
export interface TwoColumnBlock extends BaseBlock {
  type: "two_column";
  data: {
    leftColumn: {
      type: "text" | "image" | "custom";
      content: string;
    };
    rightColumn: {
      type: "text" | "image" | "custom";
      content: string;
    };
    variant: "equal" | "left-heavy" | "right-heavy";
    background?: "default" | "gray" | "gradient";
  };
}

// Martech Integrations Block - Marketing tech integration grid
export interface MartechIntegrationsBlock extends BaseBlock {
  type: "martech_integrations";
  data: {
    heading: string;
    subheading?: string;
    integrations: Array<{
      name: string;
      color: string; // Tailwind color class like "blue-600"
      fontSize?: "text-2xl" | "text-3xl" | "text-4xl";
    }>;
    columns: 2 | 3 | 4 | 5;
  };
}

// Union type of all block types
export type ContentBlock =
  | HeroBlock
  | FeatureGridBlock
  | TrustCardsBlock
  | StepsBlock
  | CTABannerBlock
  | CalloutBlock
  | LogoGridBlock
  | ContactFormBlock
  | TwoColumnBlock
  | MartechIntegrationsBlock;

// Page configuration with blocks
export interface PageBlocks {
  blocks: ContentBlock[];
  structuredData?: Array<Record<string, any>>; // Schema.org structured data
  clientSideInteractivity?: {
    requiresPersonalization: boolean;
    requiresFormHandling: boolean;
    requiresStateManagement: boolean;
  };
}

// Helper type for creating new blocks
export type BlockData<T extends BlockType> = Extract<ContentBlock, { type: T }>["data"];

// Block editor state
export interface BlockEditorState {
  blocks: ContentBlock[];
  selectedBlockId: string | null;
  isDirty: boolean;
}

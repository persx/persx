export interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  contentType: string;
  content: string;
}

export const contentTemplates: ContentTemplate[] = [
  {
    id: "blog-post",
    name: "Blog Post",
    description: "Standard blog post structure with introduction, body, and conclusion",
    contentType: "blog",
    content: `## Introduction

Start with a compelling hook that captures the reader's attention. Introduce the main topic and explain why it matters.

## Main Points

### Key Point 1

Explain your first main point with supporting details and examples.

### Key Point 2

Discuss your second main point, providing evidence and insights.

### Key Point 3

Present your third main point with relevant data or case studies.

## Conclusion

Summarize the key takeaways and provide actionable next steps for readers.

---

**Related Resources:**
- [Resource 1](#)
- [Resource 2](#)`,
  },
  {
    id: "case-study",
    name: "Case Study",
    description: "Structured case study with problem, solution, and results",
    contentType: "case_study",
    content: `## Executive Summary

Brief overview of the case study, including the client, challenge, solution, and key results.

## The Challenge

**Company:** [Company Name]
**Industry:** [Industry]
**Team Size:** [Size]

### Problem Statement

Describe the specific challenges and pain points the client was facing.

## The Solution

### Approach

Explain the strategy and methodology used to address the challenge.

### Implementation

Detail the step-by-step process of implementing the solution.

## Results

### Key Metrics

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Conversion Rate | X% | Y% | +Z% |
| Revenue | $X | $Y | +Z% |
| Engagement | X | Y | +Z% |

### Impact

> **Quote from client about the impact and results achieved**
>
> — Client Name, Title at Company

## Key Takeaways

1. **Lesson 1:** Important insight from this case study
2. **Lesson 2:** Another valuable takeaway
3. **Lesson 3:** Final key learning

## Get Started

Ready to achieve similar results? [Contact us](#) to learn more.`,
  },
  {
    id: "implementation-guide",
    name: "Implementation Guide",
    description: "Step-by-step guide for implementing a solution",
    contentType: "implementation_guide",
    content: `## Overview

Brief introduction explaining what this guide covers and who it's for.

**Prerequisites:**
- Requirement 1
- Requirement 2
- Requirement 3

**Estimated Time:** X hours

## Step 1: Initial Setup

### What You'll Need
- Tool/resource 1
- Tool/resource 2

### Instructions

1. First action to take
2. Second action to take
3. Third action to take

\`\`\`
// Code example if applicable
example code here
\`\`\`

## Step 2: Configuration

Detailed instructions for the configuration phase.

### Important Notes

> **PersX.ai Perspective**
>
> Expert tip or insight about this step.

## Step 3: Testing

How to verify that everything is working correctly.

### Checklist
- [ ] Item 1 is working
- [ ] Item 2 is configured
- [ ] Item 3 is verified

## Step 4: Optimization

Tips for optimizing and improving the implementation.

## Troubleshooting

### Common Issues

**Problem:** Description of common issue
**Solution:** How to fix it

**Problem:** Another common issue
**Solution:** Resolution steps

## Next Steps

What to do after completing this guide:
1. Next action
2. Further optimization
3. Advanced features

## Resources

- [Documentation](#)
- [Support](#)
- [Community](#)`,
  },
  {
    id: "product-comparison",
    name: "Product Comparison",
    description: "Compare products or tools side-by-side",
    contentType: "tool_guide",
    content: `## Introduction

Overview of the products/tools being compared and why this comparison matters.

## At a Glance

| Feature | Product A | Product B | Product C |
|---------|-----------|-----------|-----------|
| Price | $X/mo | $Y/mo | $Z/mo |
| Key Feature 1 | ✅ | ✅ | ❌ |
| Key Feature 2 | ✅ | ❌ | ✅ |
| Support | Email | 24/7 | Chat |

## Product A

### Overview
Brief description of Product A and what makes it unique.

### Pros
- Advantage 1
- Advantage 2
- Advantage 3

### Cons
- Limitation 1
- Limitation 2

### Best For
Ideal use cases and target audience.

## Product B

### Overview
Brief description of Product B and what makes it unique.

### Pros
- Advantage 1
- Advantage 2
- Advantage 3

### Cons
- Limitation 1
- Limitation 2

### Best For
Ideal use cases and target audience.

## Product C

### Overview
Brief description of Product C and what makes it unique.

### Pros
- Advantage 1
- Advantage 2
- Advantage 3

### Cons
- Limitation 1
- Limitation 2

### Best For
Ideal use cases and target audience.

## Final Recommendation

> **Quick Win Recommendations**
>
> - Choose Product A if you need [specific use case]
> - Choose Product B if you prioritize [specific feature]
> - Choose Product C if you want [specific benefit]

## Conclusion

Summary of the comparison and guidance for making the right choice.`,
  },
  {
    id: "news-article",
    name: "News Article",
    description: "Quick news format with key points and analysis",
    contentType: "news",
    content: `## [Headline]

**Date:** [Date]
**Source:** [Source Name]

### Key Points

- Main point 1
- Main point 2
- Main point 3

## What Happened

Brief summary of the news event or announcement.

## Why It Matters

Explanation of the significance and impact.

## Industry Impact

How this affects the industry, businesses, or users.

> **PersX.ai Perspective**
>
> Our expert analysis on what this means for experimentation and personalization.

## What's Next

Expected developments or actions to watch for.

## Related Coverage

- [Related article 1](#)
- [Related article 2](#)`,
  },
];

export const getTemplateById = (id: string): ContentTemplate | undefined => {
  return contentTemplates.find((template) => template.id === id);
};

export const getTemplatesByContentType = (contentType: string): ContentTemplate[] => {
  return contentTemplates.filter((template) => template.contentType === contentType);
};

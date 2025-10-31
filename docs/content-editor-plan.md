# Content Editor System - Implementation Plan

## Executive Summary

Create a unified content editor system that works consistently across all 7 content types (blog, case_study, implementation_guide, test_result, best_practice, tool_guide, news) with preview and publish capabilities.

## Current State Analysis

### What Exists
- ✅ 7 content types defined in database
- ✅ ContentEditor component with basic fields
- ✅ Draft/Published status system
- ✅ Public display pages for news content (`/news` and `/news/[slug]`)
- ✅ Quick Add AI-powered curation (news only)
- ✅ Admin content management dashboard

### Gaps to Address
- ❌ No preview functionality for draft content
- ❌ Only news has public display pages (6 other types missing)
- ❌ No unified public layout/template system
- ❌ Limited content editor toolbar (no quick preview/publish actions)
- ❌ Quick Add only works for news type
- ❌ No side-by-side edit/preview mode
- ❌ No public URL generation for all content types

## Design Goals

1. **Unified Experience**: Same editor interface works for all content types
2. **Preview First**: Always preview before publishing
3. **Type-Aware Display**: Each content type has appropriate public layout
4. **Consistent Actions**: Preview, Save Draft, Publish work the same way
5. **Flexible Curation**: Quick Add can work for any content type
6. **Progressive Enhancement**: Build on existing system, don't rebuild

---

## Architecture Design

### 1. Content Editor Components

```
app/go/cm/content/
├── components/
│   ├── ContentEditor.tsx (existing - enhance)
│   ├── ContentEditorToolbar.tsx (new)
│   ├── ContentPreviewModal.tsx (new)
│   └── ContentTypeFields.tsx (new - type-specific fields)
```

### 2. Public Display System

```
app/[content-type]/
├── page.tsx (list page)
└── [slug]/
    └── page.tsx (detail page)

Shared components:
app/components/content/
├── ContentLayout.tsx (unified wrapper)
├── ContentHeader.tsx (title, date, meta)
├── ContentBody.tsx (main content display)
├── ContentSources.tsx (external attribution)
├── ContentMeta.tsx (tags, categories, read time)
└── templates/
    ├── BlogTemplate.tsx
    ├── CaseStudyTemplate.tsx
    ├── ImplementationGuideTemplate.tsx
    ├── TestResultTemplate.tsx
    ├── BestPracticeTemplate.tsx
    ├── ToolGuideTemplate.tsx
    └── NewsTemplate.tsx (existing pattern)
```

### 3. Preview System Flow

```
Editor Mode → Click Preview → Preview Modal/Page → Shows public layout
                                    ↓
                              Live updates as you edit
                                    ↓
                              Click Publish → Goes live
```

---

## Implementation Plan

### Phase 1: Foundation (Unified Components)

#### 1.1 Create Content Display Components
- `ContentLayout.tsx` - Wrapper with consistent header/footer
- `ContentHeader.tsx` - Title, date, author, type badge
- `ContentBody.tsx` - Markdown rendering with syntax highlighting
- `ContentMeta.tsx` - Tags, categories, read time, sharing
- `ContentSources.tsx` - External source attribution

#### 1.2 Create Type-Specific Templates
Each template uses shared components but arranges them differently:
- **Blog**: Standard article layout
- **Case Study**: Problem/Solution/Results sections
- **Implementation Guide**: Step-by-step format with TOC
- **Test Result**: Data visualization focus, before/after
- **Best Practice**: Actionable tips with examples
- **Tool Guide**: Feature breakdown, use cases
- **News**: Multi-source roundup (existing pattern)

### Phase 2: Public Display Pages

#### 2.1 Create List Pages for Each Type
Pattern: `/[type]/page.tsx`
- `/blog` - Blog posts grid
- `/case-studies` - Case study cards with metrics
- `/guides` - Implementation guides list
- `/test-results` - Test results with filters
- `/best-practices` - Best practice cards
- `/tools` - Tool guide directory
- `/news` - (already exists)

#### 2.2 Create Detail Pages for Each Type
Pattern: `/[type]/[slug]/page.tsx`
- Load content by slug and type
- Verify status = published (or allow preview with token)
- Render with type-specific template
- Include SEO meta tags
- Add related content section

### Phase 3: Preview Functionality

#### 3.1 Preview Modal Component
- `ContentPreviewModal.tsx`
- Full-screen modal with close button
- Renders content using public template
- Shows exactly how it will look when published
- Update in real-time option (or refresh button)

#### 3.2 Preview Page with Token
- `/preview/[token]` route
- Generate temporary preview token for draft content
- Share preview link with others before publishing
- Token expires after 24 hours
- Shows draft badge at top

### Phase 4: Enhanced Editor Toolbar

#### 4.1 ContentEditorToolbar Component
Actions:
- **Preview** - Opens preview modal
- **Save Draft** - Saves without publishing
- **Publish** - Saves and sets status to published
- **Get Preview Link** - Generates shareable preview URL
- **View Live** - If already published, open public URL

Status indicators:
- Last saved timestamp
- Current status (draft/published)
- Unsaved changes warning

#### 4.2 Editor Enhancements
- Auto-save draft every 2 minutes
- Keyboard shortcuts (Cmd+S to save, Cmd+P to preview)
- Validation before publish
- Confirmation dialog for publish action

### Phase 5: Type-Specific Features

#### 5.1 Content Type Fields Component
Dynamic fields based on content type:
- **Case Study**: Add "Challenge", "Solution", "Results" sections
- **Implementation Guide**: Add steps array, prerequisites
- **Test Result**: Add metrics, before/after data
- **Best Practice**: Add "Do's and Don'ts" section
- All types: Keep existing common fields

#### 5.2 Quick Add Multi-Type Support
- Extend Quick Add to work for blog, case_study, etc.
- Type-specific AI prompts for summary generation
- Adapt workflow steps based on content type

### Phase 6: Publishing Workflow

#### 6.1 Enhanced Publish Flow
```
1. Create/Edit Content
2. Click Preview → Review in public layout
3. Make edits if needed
4. Click Publish → Confirmation dialog
5. Confirm → Status = published, published_at set
6. Show success message with link to live content
```

#### 6.2 Unpublish Feature
- Change published content back to draft
- Confirm action (removes from public)
- Clear published_at timestamp
- Redirect to editor

### Phase 7: Testing & Polish

#### 7.1 Test Each Content Type
- Create sample content for each type
- Test edit → preview → publish flow
- Verify public pages display correctly
- Test responsive design
- Check SEO meta tags

#### 7.2 Polish & Improvements
- Add loading states
- Error handling
- Accessibility (ARIA labels, keyboard nav)
- Analytics events (preview_clicked, published, etc.)
- Performance optimization

---

## Data Structure Considerations

### Preview Token System
New table: `content_preview_tokens`
```sql
CREATE TABLE content_preview_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id UUID REFERENCES knowledge_base_content(id),
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### URL Structure
```
Public URLs:
/blog/[slug]
/case-studies/[slug]
/guides/[slug]
/test-results/[slug]
/best-practices/[slug]
/tools/[slug]
/news/[slug]

Preview URLs:
/preview/[token]
```

---

## Technical Decisions

### Component Library
- Continue using existing UI components (Button, Card, Badge, etc.)
- Add new shared content display components
- Use Tailwind for styling consistency

### Preview Implementation Options
**Option A: Modal (Recommended)**
- ✅ Faster, no page reload
- ✅ Side-by-side edit/preview possible
- ✅ Better UX for quick checks
- ❌ Limited to viewport size

**Option B: New Tab/Window**
- ✅ Full browser view
- ✅ Can share URL
- ❌ Slower, requires token generation
- ❌ More complex state management

**Recommendation**: Start with Modal (Phase 3.1), add Preview Link option (Phase 3.2) later

### Content Display Strategy
- Create template components for each type
- Use composition pattern with shared components
- Keep type-specific logic minimal
- Make it easy to add new types in future

---

## Success Metrics

1. **Editor Usability**: Can create/edit content for all 7 types using same editor
2. **Preview Functionality**: Preview modal shows accurate public layout
3. **Public Pages**: All content types have functioning list and detail pages
4. **Publish Workflow**: Smooth preview → publish flow with no errors
5. **Consistency**: Same toolbar, actions, and behavior across all types
6. **Performance**: Page load < 2s, preview render < 1s

---

## Future Enhancements (Post-MVP)

- Side-by-side edit/preview mode
- Content version history
- Scheduled publishing
- Content templates/cloning
- Bulk operations (publish multiple, change status)
- Advanced AI features for all types (not just news)
- Content collaboration (multiple editors)
- Comment/feedback system on drafts
- A/B testing different versions

---

## File Changes Summary

### New Files
- `app/go/cm/content/components/ContentEditorToolbar.tsx`
- `app/go/cm/content/components/ContentPreviewModal.tsx`
- `app/go/cm/content/components/ContentTypeFields.tsx`
- `app/components/content/ContentLayout.tsx`
- `app/components/content/ContentHeader.tsx`
- `app/components/content/ContentBody.tsx`
- `app/components/content/ContentMeta.tsx`
- `app/components/content/ContentSources.tsx`
- `app/components/content/templates/[7 template files].tsx`
- `app/blog/page.tsx` and `app/blog/[slug]/page.tsx`
- `app/case-studies/page.tsx` and `app/case-studies/[slug]/page.tsx`
- `app/guides/page.tsx` and `app/guides/[slug]/page.tsx`
- `app/test-results/page.tsx` and `app/test-results/[slug]/page.tsx`
- `app/best-practices/page.tsx` and `app/best-practices/[slug]/page.tsx`
- `app/tools/page.tsx` and `app/tools/[slug]/page.tsx`
- `app/preview/[token]/page.tsx`
- `app/api/content/preview-token/route.ts`
- `supabase/migrations/[new]_create_preview_tokens.sql`

### Modified Files
- `app/go/cm/content/components/ContentEditor.tsx` (add toolbar, preview integration)
- `app/go/cm/content/[id]/page.tsx` (integrate new toolbar)
- `app/go/cm/content/new/page.tsx` (integrate new toolbar)

---

## Next Steps

1. Review this plan with stakeholders
2. Prioritize phases (can adjust order based on needs)
3. Start with Phase 1 (Foundation) to create reusable components
4. Build incrementally, testing each phase
5. Iterate based on user feedback

---

**Document Version**: 1.0
**Created**: 2025-10-31
**Status**: Planning Phase

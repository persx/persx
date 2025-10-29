# Roadmap Form Feature Guide

## Overview

The persx.ai website now includes a comprehensive 4-step roadmap form that collects user information and generates a personalized 90-day experience optimization roadmap preview.

## User Flow

### 1. Entry Points
- Homepage "Get Started" button → `/start`
- Homepage bottom CTA "Get Your Free Roadmap" → `/start`
- Navigation menu "Start" link

### 2. Multi-Step Form (`/start`)

The form consists of 4 steps with a progress indicator:

#### Step 1: Industry Selection
- **Question**: "What's your industry?"
- **Options**:
  - eCommerce
  - Healthcare
  - Financial Services
  - Education
  - B2B/SaaS
  - Other (with text input field)
- **Validation**: Must select an option; if "Other", must provide text

#### Step 2: Goal Selection
- **Question**: "What's your primary goal?"
- **Options**:
  - Increase demos
  - Improve AOV (Average Order Value)
  - Boost applications
  - Raise appointment rate
- **Validation**: Must select one option

#### Step 3: Martech Stack
- **Question**: "What tools are in your martech stack?"
- **Options** (multiple selection allowed):
  - Optimizely
  - Segment
  - Salesforce
  - Marketo
  - Microsoft Dynamics
  - Other (with text input field)
- **Validation**: Must select at least one option

#### Step 4: Additional Details
- **Question**: "What other details would you like to provide to make this roadmap more valuable and actionable?"
- **Input**: Large text area for detailed responses
- **Validation**: Optional

### 3. Sample Output Preview

After completing the form, users see a preview containing:

#### A. Ideal Customer Personas (3 personas)
- The Decision Maker
- The Practitioner
- The Researcher

#### B. 4-Stage Customer Journey
1. Awareness
2. Consideration
3. Decision
4. Retention

#### C. 6 High-Impact Test Ideas
1. Personalized hero messaging by industry
2. Dynamic social proof based on company size
3. Optimized CTA button copy for different personas
4. Customized navigation for returning visitors
5. AI-powered product recommendations
6. Progressive form optimization

### 4. Email Capture

- **CTA Button**: "Get the Full 90-Day Roadmap"
- **Form**: Email input field
- **Action**: Submits email to receive complete roadmap
- **Confirmation**: Success message displayed

### 5. Consultation Booking

- **Section**: Displayed at bottom of preview
- **CTA**: "Schedule Free Consultation"
- **Link**: Routes to `/contact` page

## Data Collection

### Current Implementation

Form submissions are sent to the API endpoint `/api/submit-roadmap` which:

1. **Logs data to console** with the following information:
   - Timestamp
   - Industry (including "Other" specification)
   - Goal
   - Martech Stack (including "Other" specification)
   - Additional Details
   - Email (when full roadmap is requested)

2. **Console Output Example**:
```
=== New Roadmap Submission ===
Timestamp: 2025-10-29T14:00:00.000Z
Industry: eCommerce
Goal: Improve AOV
Martech Stack: Optimizely, Segment, Salesforce
Additional Details: Looking to improve conversion rates on product pages
Email: user@company.com
Full Roadmap Requested: true
=============================
```

### Production Database Setup

To connect to a database in production, update `/app/api/submit-roadmap/route.ts`:

#### Example with PostgreSQL (using Prisma):

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const data = await request.json();

  await prisma.roadmapSubmission.create({
    data: {
      industry: data.industry,
      industryOther: data.industryOther || null,
      goal: data.goal,
      martechStack: data.martechStack,
      martechOther: data.martechOther || null,
      additionalDetails: data.additionalDetails || null,
      email: data.email || null,
      requestFullRoadmap: data.requestFullRoadmap || false,
      createdAt: new Date(),
    },
  });

  // ... rest of code
}
```

#### Example with MongoDB (using Mongoose):

```typescript
import mongoose from 'mongoose';

const RoadmapSubmission = mongoose.model('RoadmapSubmission', {
  industry: String,
  industryOther: String,
  goal: String,
  martechStack: [String],
  martechOther: String,
  additionalDetails: String,
  email: String,
  requestFullRoadmap: Boolean,
  createdAt: { type: Date, default: Date.now }
});

export async function POST(request: NextRequest) {
  const data = await request.json();

  await RoadmapSubmission.create(data);

  // ... rest of code
}
```

#### Example with Supabase:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  const data = await request.json();

  const { error } = await supabase
    .from('roadmap_submissions')
    .insert([data]);

  // ... rest of code
}
```

## Integration Recommendations

### 1. Email Marketing
Integrate with email service providers to send the full roadmap:
- SendGrid
- Mailchimp
- ConvertKit
- Customer.io

### 2. CRM Integration
Send lead data to your CRM:
- Salesforce
- HubSpot
- Pipedrive

### 3. Analytics
Track form completion and conversion:
- Google Analytics 4
- Mixpanel
- Amplitude

### 4. Marketing Automation
Trigger automated workflows:
- Zapier
- Make (formerly Integromat)
- n8n

## Homepage Updates

### New Headline
"AI Strategist for Personalization & Experimentation"

### New Tagline
"Discovery your ideal personas, journeys, and build an actionable roadmap in minutes."

### Martech Integration Section
Displays logos/names for:
- Optimizely
- Segment
- Salesforce
- Marketo
- Microsoft Dynamics

## File Structure

```
app/
├── start/
│   └── page.tsx          # Multi-step form component
├── api/
│   └── submit-roadmap/
│       └── route.ts      # API endpoint for form submissions
└── page.tsx              # Updated homepage

components/
└── Header.tsx            # Navigation with "Start" link
```

## Testing the Form

1. Start the development server: `npm run dev`
2. Navigate to http://localhost:3000
3. Click "Get Started" button
4. Complete all 4 steps of the form
5. Review the sample output preview
6. Click "Get the Full 90-Day Roadmap"
7. Enter email and submit
8. Check the console for logged data

## Next Steps for Production

1. **Database Setup**: Choose and configure a database
2. **Email Service**: Set up automated email sending
3. **PDF Generation**: Create dynamic PDF roadmaps
4. **Analytics**: Add tracking pixels and events
5. **A/B Testing**: Test different form variations
6. **Lead Scoring**: Implement scoring based on responses
7. **Scheduling Integration**: Connect with Calendly or similar
8. **Security**: Add rate limiting and CAPTCHA if needed

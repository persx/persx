# TODO - persx.ai

## Security - High Priority

### ⚠️ REMOVE OR PASSWORD PROTECT DIAGNOSTIC ENDPOINT

**Endpoint**: `/api/test-supabase`

**Current Status**:
- ✅ Active and publicly accessible
- ⚠️ Exposes database information (record counts, recent submissions)
- ⚠️ Shows environment variable status

**Action Required**: Choose one option before going fully public

#### Option 1: Remove the Endpoint (Recommended for Production)

Delete the file:
```bash
rm app/api/test-supabase/route.ts
git add -A
git commit -m "Remove diagnostic endpoint for production"
git push origin main
```

#### Option 2: Password Protect It

Add this to `app/api/test-supabase/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  // Simple password protection
  const authHeader = request.headers.get("authorization");
  const password = process.env.DIAGNOSTIC_PASSWORD || "change-me-123";

  if (authHeader !== `Bearer ${password}`) {
    return NextResponse.json(
      { error: "Unauthorized. Use: Authorization: Bearer YOUR_PASSWORD" },
      { status: 401 }
    );
  }

  // ... rest of existing code
}
```

Then add to Vercel environment variables:
- Name: `DIAGNOSTIC_PASSWORD`
- Value: `your-secure-password-here`

Access with:
```bash
curl -H "Authorization: Bearer your-secure-password-here" https://persx.ai/api/test-supabase
```

#### Option 3: IP Restrict (Advanced)

Only allow access from specific IPs (your office, home, etc.)

---

## Future Enhancements

### Email Integration
- [ ] Set up SendGrid or similar for sending full roadmap PDFs
- [ ] Create email templates for roadmap delivery
- [ ] Add confirmation emails for form submissions

### Analytics
- [ ] Add Google Analytics or Vercel Analytics
- [ ] Track form conversion rates
- [ ] Monitor which industries/goals are most popular

### Marketing Automation
- [ ] Integrate with CRM (Salesforce, HubSpot)
- [ ] Set up Zapier workflows
- [ ] Create automated follow-up sequences

### Content
- [ ] Add real blog posts
- [ ] Update news section with actual company updates
- [ ] Create detailed case studies

### A/B Testing
- [ ] Test different form copy
- [ ] Test different CTA buttons
- [ ] Test persona descriptions

---

**Created**: 2025-10-29
**Last Updated**: 2025-10-29

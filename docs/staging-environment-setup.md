# Staging Environment Setup Guide

## Overview
This guide sets up a dedicated staging environment that mirrors production with its own database and persistent URL.

## Architecture

```
┌─────────────────┐
│   Development   │ → Local dev server + Local Supabase
└─────────────────┘

┌─────────────────┐
│     Staging     │ → staging.persx.ai + Staging Supabase
└─────────────────┘

┌─────────────────┐
│   Production    │ → www.persx.ai + Production Supabase
└─────────────────┘
```

## Benefits

1. **Catch Production Issues Early**
   - Test production builds before going live
   - Detect hydration errors, build failures, and runtime issues
   - Verify database migrations safely

2. **Safe Testing Ground**
   - Test with production-like data
   - Share with stakeholders without risk
   - QA environment for new features

3. **Deployment Pipeline**
   - Deploy to staging first
   - Run automated tests
   - Manual QA approval
   - Promote to production

## Implementation Steps

### Step 1: Create Staging Supabase Project

**Option A: Separate Project (Recommended)**
1. Go to https://supabase.com/dashboard
2. Create new project: `persx-staging`
3. Copy the new credentials

**Option B: Separate Schema in Same Project**
- More cost-effective but less isolated
- Create a `staging` schema in existing database

### Step 2: Set Up Staging Branch

```bash
# Create staging branch from main
git checkout -b staging
git push -u origin staging
```

### Step 3: Configure Vercel Staging Environment

1. **Vercel Dashboard**:
   - Go to Project Settings → Git
   - Set `staging` branch as a Production Branch
   - This creates staging.persx.ai automatically

2. **Add Staging Environment Variables**:
```bash
# Add staging-specific variables
vercel env add NEXT_PUBLIC_SUPABASE_URL --environment staging
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY --environment staging
vercel env add SUPABASE_SERVICE_ROLE_KEY --environment staging
vercel env add NEXTAUTH_URL --environment staging
vercel env add NEXTAUTH_SECRET --environment staging
vercel env add OPENAI_API_KEY --environment staging
vercel env add RESEND_API_KEY --environment staging
```

### Step 4: Update Database Schema in Staging

```bash
# Apply migrations to staging database
SUPABASE_URL=<staging-url> \
SUPABASE_SERVICE_ROLE_KEY=<staging-key> \
npx supabase db push --db-url <staging-db-url>
```

### Step 5: Set Up Deployment Workflow

#### Manual Deployment (Simple)
```bash
# Deploy to staging
git checkout staging
git merge main
git push origin staging

# Promote to production (after QA)
git checkout main
git merge staging
git push origin main
```

#### Automated Deployment (Advanced)
Create `.github/workflows/staging.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./
```

### Step 6: Custom Domain Setup (Optional)

In Vercel Dashboard:
1. Go to Domains
2. Add custom domain: `staging.persx.ai`
3. Update DNS records as instructed

### Step 7: Testing Checklist

Before promoting staging → production:

- [ ] All builds pass successfully
- [ ] No console errors (especially hydration errors)
- [ ] Database migrations applied successfully
- [ ] Authentication works correctly
- [ ] Content editor functions properly
- [ ] All integrations working (OpenAI, Resend, IndexNow)
- [ ] Performance acceptable (Lighthouse scores)
- [ ] Mobile responsive
- [ ] Dark mode works

## Usage

### Deploying to Staging

```bash
# Option 1: Direct push to staging branch
git checkout staging
git merge main
git push

# Option 2: Use PR workflow
# Create PR from feature branch → staging
# Merge after review
# Vercel auto-deploys
```

### Promoting to Production

```bash
# After QA approval on staging
git checkout main
git merge staging --no-ff -m "Release: [version/feature name]"
git tag -a v1.x.x -m "Release v1.x.x"
git push origin main --tags
```

### Rolling Back

```bash
# Revert production to previous state
git checkout main
git revert <commit-hash>
git push origin main
```

## Cost Considerations

**Supabase Staging Project:**
- Free tier: 500 MB database, 2 GB bandwidth
- Pro: $25/month for higher limits
- Recommendation: Start with free tier

**Vercel:**
- Staging counts as additional production deployment
- Pro plan includes unlimited production deployments
- Free tier: 100 GB bandwidth total

## Data Management

### Option 1: Empty Staging Database
- Clean slate for testing
- Manually create test data
- Good for feature testing

### Option 2: Production Data Copy (Anonymized)
```bash
# Export from production
pg_dump <prod-db-url> > backup.sql

# Anonymize sensitive data
sed -i 's/real-email@example.com/test-email@example.com/g' backup.sql

# Import to staging
psql <staging-db-url> < backup.sql
```

### Option 3: Seed Data Script
Create `scripts/seed-staging.ts` with sample data

## Monitoring

### Staging Analytics
- Set up separate Vercel Analytics for staging
- Monitor performance metrics
- Track error rates

### Alerts
- Configure Vercel notifications for failed builds
- Set up error tracking (Sentry for staging)

## Best Practices

1. **Never develop directly on staging**
   - Always develop on feature branches or main
   - Merge to staging for testing

2. **Keep staging in sync with production**
   - Regularly merge main → staging
   - Apply same migrations

3. **Test before merging to main**
   - Deploy to staging first
   - Run full QA checklist
   - Get stakeholder approval

4. **Use staging for risky changes**
   - Database schema changes
   - Third-party integrations
   - Major refactors

5. **Document staging differences**
   - Different API keys (test mode)
   - Different email settings
   - Feature flags

## Quick Start Commands

```bash
# Initial setup
git checkout -b staging
git push -u origin staging

# Regular workflow
git checkout staging
git pull origin main
git push origin staging
# → Vercel auto-deploys to staging.persx.ai
# → Test and verify
git checkout main
git merge staging
git push origin main
# → Vercel auto-deploys to www.persx.ai
```

## Troubleshooting

**Staging shows old code:**
- Check Vercel deployment logs
- Verify correct branch is deployed
- Clear browser cache

**Database connection fails:**
- Verify staging environment variables
- Check Supabase project is active
- Test connection string

**Build fails on staging but not local:**
- Check Node.js version matches
- Verify all dependencies in package.json
- Check environment variables are set

## Next Steps

1. Create Supabase staging project
2. Set up staging branch and Vercel configuration
3. Add environment variables
4. Run first staging deployment
5. Set up QA process and checklist
6. Document team workflow

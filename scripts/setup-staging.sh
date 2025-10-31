#!/bin/bash

# PersX.ai Staging Environment Setup Script
# This script helps set up a dedicated staging environment

set -e

echo "🚀 PersX.ai Staging Environment Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Must be run from project root directory"
    exit 1
fi

echo "Step 1: Creating staging branch"
echo "--------------------------------"
git checkout -b staging 2>/dev/null || git checkout staging
echo -e "${GREEN}✓${NC} Staging branch ready"
echo ""

echo "Step 2: Pushing staging branch to origin"
echo "----------------------------------------"
git push -u origin staging
echo -e "${GREEN}✓${NC} Staging branch pushed"
echo ""

echo "Step 3: Setting up Vercel configuration"
echo "---------------------------------------"
echo ""
echo -e "${YELLOW}Manual Steps Required:${NC}"
echo "1. Go to https://vercel.com/persx-ai/persx/settings/git"
echo "2. Under 'Production Branch', add: staging"
echo "3. This will create automatic deployments for staging branch"
echo ""
read -p "Press Enter when you've completed the Vercel setup..."
echo -e "${GREEN}✓${NC} Vercel configured"
echo ""

echo "Step 4: Adding staging environment variables"
echo "--------------------------------------------"
echo ""
echo -e "${YELLOW}You'll need to add the following environment variables:${NC}"
echo "- NEXT_PUBLIC_SUPABASE_URL (staging Supabase URL)"
echo "- NEXT_PUBLIC_SUPABASE_ANON_KEY (staging anon key)"
echo "- SUPABASE_SERVICE_ROLE_KEY (staging service role key)"
echo "- NEXTAUTH_URL (https://staging.persx.ai or preview URL)"
echo "- NEXTAUTH_SECRET (can reuse production or generate new)"
echo "- OPENAI_API_KEY (can reuse or use different key)"
echo "- RESEND_API_KEY (can reuse or use test mode)"
echo ""

read -p "Do you want to add staging environment variables now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Adding NEXT_PUBLIC_SUPABASE_URL..."
    vercel env add NEXT_PUBLIC_SUPABASE_URL staging

    echo "Adding NEXT_PUBLIC_SUPABASE_ANON_KEY..."
    vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY staging

    echo "Adding SUPABASE_SERVICE_ROLE_KEY..."
    vercel env add SUPABASE_SERVICE_ROLE_KEY staging

    echo "Adding NEXTAUTH_URL..."
    vercel env add NEXTAUTH_URL staging

    echo "Adding NEXTAUTH_SECRET..."
    vercel env add NEXTAUTH_SECRET staging

    echo "Adding OPENAI_API_KEY..."
    vercel env add OPENAI_API_KEY staging

    echo "Adding RESEND_API_KEY..."
    vercel env add RESEND_API_KEY staging

    echo -e "${GREEN}✓${NC} Environment variables added"
else
    echo -e "${YELLOW}⚠${NC} Skipped - remember to add these later with:"
    echo "   vercel env add <VAR_NAME> staging"
fi
echo ""

echo "Step 5: Creating .env.staging file"
echo "----------------------------------"
cat > .env.staging << 'EOF'
# Staging Environment Variables
# Copy this to .env.local when testing staging locally

# Supabase (Staging)
NEXT_PUBLIC_SUPABASE_URL=your-staging-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-staging-service-role-key

# NextAuth
NEXTAUTH_URL=https://staging.persx.ai
NEXTAUTH_SECRET=your-nextauth-secret

# OpenAI
OPENAI_API_KEY=your-openai-key

# Resend
RESEND_API_KEY=your-resend-key
EOF
echo -e "${GREEN}✓${NC} Created .env.staging template"
echo ""

echo "Step 6: Adding staging documentation"
echo "------------------------------------"
if [ ! -f "docs/staging-environment-setup.md" ]; then
    echo -e "${YELLOW}⚠${NC} Staging documentation not found. Please create it."
else
    echo -e "${GREEN}✓${NC} Documentation exists at docs/staging-environment-setup.md"
fi
echo ""

echo "Step 7: Creating deployment workflow"
echo "------------------------------------"
cat > .github/workflows/staging.yml << 'EOF'
name: Staging Deployment

on:
  push:
    branches: [staging]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Deploy to Vercel
        run: echo "Vercel auto-deploys staging branch automatically"

      - name: Post-deployment checks
        run: |
          echo "✓ Staging deployment triggered"
          echo "Check status at: https://vercel.com/persx-ai/persx"
EOF
echo -e "${GREEN}✓${NC} Created GitHub workflow"
echo ""

echo "✅ Staging Environment Setup Complete!"
echo "======================================"
echo ""
echo "Next Steps:"
echo "1. Create a staging Supabase project at https://supabase.com/dashboard"
echo "2. Add the staging environment variables in Vercel"
echo "3. Push to staging branch to trigger first deployment:"
echo "   git push origin staging"
echo "4. Check deployment at Vercel dashboard"
echo ""
echo "Workflow:"
echo "• Develop on feature branches"
echo "• Merge to main for regular development"
echo "• Merge main → staging for testing"
echo "• After QA, merge staging → main for production release"
echo ""
echo "See docs/staging-environment-setup.md for full documentation"

# Apply Database Migrations

## Issue
Getting this error on the start form:
```
POST http://localhost:3000/api/submit-roadmap 500 (Internal Server Error)
'null value in column "goal" of relation "roadmap_submissions" violates not-null constraint'
```

## Solution
Your Supabase database needs to be updated with the latest schema changes.

## Migrations to Apply

Apply these migrations in order:

### 1. Update Goals to Array (Required to fix current error)
**File**: `supabase/migrations/20241201000000_update_goals_to_array.sql`

**What it does**:
- Adds `goals` column (array) to store multiple goals
- Adds `goal_other` column for custom goals
- Migrates existing data from `goal` to `goals`

### 2. Add Martech Tool Names
**File**: `supabase/migrations/20250130000002_add_martech_tool_names.sql`

**What it does**:
- Adds `martech_tool_names` column to store specific tool names

## How to Apply

### Option A: Supabase Dashboard (Easiest)

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Create a new query
4. Copy and paste the contents of **each migration file** (in order)
5. Click "Run" for each one

### Option B: Supabase CLI

```bash
# Make sure you're linked to your project
supabase link --project-ref YOUR_PROJECT_REF

# Apply all migrations
supabase db push
```

## Verify It Worked

After applying migrations, test the start form:

1. Go to `/start`
2. Fill out all 4 steps
3. Click "See Your Sample Output"
4. Should work without errors!

## After Applying

Once confirmed working, you can optionally drop the old `goal` column:

```sql
-- OPTIONAL: Only run after confirming everything works
ALTER TABLE public.roadmap_submissions DROP COLUMN IF EXISTS goal;
```

This is commented out in the migration file for safety.

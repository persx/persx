# Deployment Checklist

## Pre-Deployment (Before Pushing to Main)

### 1. Code Review
- [ ] All TypeScript types updated
- [ ] Frontend components updated with new fields
- [ ] **API routes updated with new fields** (Critical!)
- [ ] No TypeScript errors: `npm run build`
- [ ] All tests passing (if applicable)

### 2. Database Changes
- [ ] Migration file created in `supabase/migrations/`
- [ ] Migration tested locally
- [ ] Migration SQL copied for production
- [ ] Verified all columns in migration match API routes

### 3. Field Mapping Verification
```bash
# Check that API routes match database schema:
# 1. Open app/api/content/route.ts
# 2. Open app/api/content/[id]/route.ts
# 3. Verify all fields in .update() and .insert() match migration
```

### 4. Local Testing
- [ ] Dev server running latest code
- [ ] Browser cache cleared (Cmd+Shift+R)
- [ ] Create test content - SUCCESS
- [ ] Update test content - SUCCESS
- [ ] Delete test content - SUCCESS
- [ ] No console errors

---

## Deployment Process

### Step 1: Push to Production
```bash
git add .
git commit -m "Descriptive message"
git push origin main
```

### Step 2: Run Database Migration
**IMPORTANT**: Do this IMMEDIATELY after pushing!

1. Go to [Supabase SQL Editor](https://supabase.com/dashboard/project/lzpbpymjejwqutfpfwwu/sql/new)
2. Copy migration SQL from `supabase/migrations/[timestamp]_[description].sql`
3. Paste and click "Run"
4. Verify: "Success. No rows returned"

**Schema refreshes automatically - NO NEED for NOTIFY command**

### Step 3: Wait for Vercel Deployment
1. Check [Vercel Dashboard](https://vercel.com/dashboard)
2. Wait for deployment to complete (2-3 minutes)
3. Check build logs for errors

### Step 4: Post-Deployment Testing
- [ ] Visit production site
- [ ] Test content editor
- [ ] Create/update/delete content
- [ ] Verify all new fields appear
- [ ] Check browser console for errors
- [ ] Test on different browsers (Chrome, Safari, Firefox)

---

## Common Issues & Solutions

### Issue 1: "Column not found" Error
**Symptom**: PGRST204 error, "Could not find column in schema cache"
**Cause**: Migration not run on production OR field mismatch

**Solution**:
1. Verify migration was run in Supabase Studio
2. Check API routes have correct field names
3. Schema refresh is automatic after running migration

### Issue 2: TypeScript Build Errors
**Symptom**: Build fails with type errors
**Cause**: Types not updated to match new fields

**Solution**:
1. Update `types/knowledge-base.ts`
2. Ensure all interfaces match database schema
3. Run `npm run build` locally first

### Issue 3: Frontend Sends Wrong Fields
**Symptom**: Save button works but data not saved
**Cause**: Frontend sending field names that don't exist

**Solution**:
1. Check `formData` state in ContentEditor.tsx
2. Verify field names match database exactly
3. Check `handleSubmit` function sends all fields

### Issue 4: Cached Code in Browser
**Symptom**: Changes not visible after deployment
**Cause**: Browser cached old JavaScript

**Solution**:
1. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
2. Clear browser cache completely
3. Use incognito/private browsing mode

---

## API Route Field Checklist

### When Adding Database Fields:
1. Add to migration SQL
2. Add to TypeScript types (`types/knowledge-base.ts`)
3. **Add to API POST route** (`app/api/content/route.ts`)
4. **Add to API PUT route** (`app/api/content/[id]/route.ts`)
5. Add to frontend form (`ContentEditor.tsx`)
6. Add to UI components

### Example Field Addition:
```typescript
// In app/api/content/route.ts and app/api/content/[id]/route.ts
.update({
  // ... existing fields ...
  new_field: data.new_field || null,  // ← Add this!
})
```

---

## Rollback Procedure

### If Deployment Breaks Production:

1. **Revert Code**:
```bash
git revert HEAD
git push origin main
```

2. **Revert Database** (if needed):
   - Create a new migration that removes added columns
   - Or manually DROP columns in Supabase Studio

3. **Test Rollback**:
   - Verify production works
   - Check no data loss occurred

---

## Monitoring

### After Deployment, Monitor:
1. Vercel deployment logs
2. Supabase logs (Database → Logs)
3. Browser console (production site)
4. User reports/feedback

### Success Criteria:
- ✅ Content can be created
- ✅ Content can be updated
- ✅ Content can be deleted
- ✅ All new fields save correctly
- ✅ No console errors
- ✅ No Supabase errors

---

## Emergency Contacts

- **Supabase Dashboard**: https://supabase.com/dashboard/project/lzpbpymjejwqutfpfwwu
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Repo**: https://github.com/persx/persx

---

## Notes for Future Development

### Lessons Learned (2025-11-02):
1. **Always update API routes when adding database fields**
2. Migration alone is not enough - API must know about new fields
3. Test locally with fresh dev server restart
4. Hard refresh browser to clear cached JavaScript
5. Supabase schema refreshes automatically after migration in Studio
6. Field name mismatches (plural vs singular) cause silent failures

### Best Practices:
- Keep API routes in sync with database schema
- Test migration locally before production
- Use TypeScript to catch field mismatches
- Create comprehensive E2E tests for critical paths
- Document all database schema changes

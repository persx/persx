# Admin Panel Setup Guide

The admin panel has been successfully created at `/go/cm` with authentication, content management, and password reset capabilities.

## Setup Steps

### 1. Apply Database Migrations

The admin users table migration needs to be applied to your Supabase database:

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run the migration file: `supabase/migrations/20250130000003_create_admin_users.sql`
4. Verify tables exist:
   - `admin_users`
   - `password_reset_tokens`

### 2. Set Environment Variables

Add the following to your `.env.local` file:

```env
# NextAuth Configuration
NEXTAUTH_SECRET=your-random-secret-here  # Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000       # Change to your production URL in production

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase-settings

# Resend API Key (already configured)
RESEND_API_KEY=re_dzBTxZBv_3cw5XrpjJh47hQX3citSzrJZ
```

**How to get your Supabase Service Role Key:**
1. Go to Supabase Dashboard → Project Settings → API
2. Copy the `service_role` secret key (NOT the anon key)
3. This key has elevated permissions - keep it secret and never expose it client-side

### 3. Create Your First Admin User

Run this SQL in Supabase SQL Editor to create your first admin account:

```sql
-- Create admin user with email: persx@alexdesigns.com
-- Password: changeme123 (CHANGE THIS IMMEDIATELY!)

INSERT INTO admin_users (email, password_hash, name, is_active)
VALUES (
  'persx@alexdesigns.com',
  '$2a$10$YourHashedPasswordHere',  -- See below for how to generate
  'Admin User',
  true
);
```

**To generate the password hash:**

You can use the provided Node.js script or an online bcrypt generator.

**Option 1: Using Node.js**
```javascript
// create-admin.js
const bcrypt = require('bcryptjs');

const email = 'persx@alexdesigns.com';
const password = 'your-secure-password-here';  // CHANGE THIS

bcrypt.hash(password, 10).then(hash => {
  console.log('\nINSERT INTO admin_users (email, password_hash, name, is_active)');
  console.log('VALUES (');
  console.log(`  '${email}',`);
  console.log(`  '${hash}',`);
  console.log(`  'Admin User',`);
  console.log(`  true`);
  console.log(');\n');
});
```

Run with: `node create-admin.js`

**Option 2: Using the built-in helper**
```javascript
// In your terminal:
node -e "require('./lib/auth').createAdminUser('persx@alexdesigns.com', 'your-password', 'Admin User')"
```

### 4. Test the Login

1. Start your development server: `npm run dev`
2. Navigate to: http://localhost:3000/go
3. Login with your admin credentials
4. You should be redirected to: http://localhost:3000/go/cm

## Admin Panel Features

### Dashboard (`/go/cm`)
- Content statistics overview
- Quick action cards for creating content
- Recent content list
- Links to all sections

### Content Management (`/go/cm/content`)
- List all content with filtering by type and status
- Create new content (`/go/cm/content/new`)
- Edit existing content (`/go/cm/content/[id]`)
- Support for multiple content types:
  - Blog Posts
  - Case Studies
  - Implementation Guides
  - News
  - Test Results
  - Best Practices
  - Tool Guides

### Content Editor Features
- Rich text editor with markdown support
- Title, excerpt, and content fields
- Industry categorization
- Tool category tagging
- Custom tags
- Draft/Published status
- Preview content before publishing

### Password Reset
- "Forgot Password" link on login page
- Email-based reset with secure tokens
- Tokens expire after 1 hour
- Reset link format: `/go/reset?token=...`

### Authentication
- Email/password login
- JWT sessions (30-day expiry)
- Protected routes via middleware
- Automatic logout on session expiry

## API Endpoints

### Content API
- `POST /api/content` - Create new content
- `PUT /api/content/[id]` - Update content
- `DELETE /api/content/[id]` - Delete content

### Auth API
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/reset-password/confirm` - Confirm password reset with token

## Troubleshooting

### "Unauthorized" Error
- Check that you're logged in
- Verify NEXTAUTH_SECRET is set
- Check that middleware is protecting /go/cm routes

### "Failed to save content" Error
- Verify SUPABASE_SERVICE_ROLE_KEY is set correctly
- Check that knowledge_base_content table exists
- Check Supabase logs for detailed error messages

### Email Not Sending
- Verify RESEND_API_KEY is correct
- Check that sender domain is configured in Resend
- Check Resend dashboard for delivery logs

### Can't Login
- Verify admin user exists in database
- Check password hash was generated correctly
- Verify database connection is working

## Security Notes

1. **Service Role Key**: Keep this secret and never commit to version control
2. **NEXTAUTH_SECRET**: Generate a strong random string
3. **Password Policy**: Minimum 8 characters enforced
4. **Reset Tokens**: Expire after 1 hour and can only be used once
5. **Sessions**: 30-day expiry, stored as JWT tokens

## Next Steps

After setup is complete:

1. Change default admin password immediately
2. Create additional admin users if needed
3. Start adding content through the admin panel
4. Test password reset flow
5. Configure production environment variables for deployment

## Production Deployment

When deploying to production:

1. Update NEXTAUTH_URL to your production domain
2. Use environment variables in your hosting platform
3. Never commit secrets to git
4. Test authentication flow thoroughly
5. Monitor Supabase and Resend logs for issues

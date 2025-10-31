# Admin Utility Bar

The Admin Utility Bar is a site-wide utility component that appears at the top of all pages during admin sessions. It provides quick access to admin functions and session-scoped personalization controls.

## Features

### 1. Admin Link
- Quick access to `/go/cm` (Content Management) from any page
- Always visible when the utility bar is shown

### 2. Personalization State Display
Shows current session personalization with chips for:
- **Industry**: Displays the current industry with a "Clear" button
- **Tool**: Shows the selected tool (display only)
- **Goal**: Shows the selected goal (display only)

### 3. Personalization Controls

#### Clear Industry
- Button appears on the industry chip
- Removes only the industry from the session
- Refreshes the page to show default industry content

#### Clear All Personalization
- Global button on the right side of the bar
- Only visible when at least one personalization value is set
- Clears industry, tool, and goal simultaneously
- Refreshes the page to show completely default content

### 4. Success Feedback
- ARIA live region announces actions to screen readers
- Visual success message appears below the bar
- Auto-dismisses after 3 seconds
- Messages:
  - "Industry cleared. Showing default content."
  - "Personalization cleared. Showing default content."
  - "Nothing to clear." (if no personalization is set)

## Visibility Rules

The utility bar is shown only when **all** of the following conditions are met:

1. **Admin session**: User is authenticated via NextAuth
2. **Feature flag enabled**: `NEXT_PUBLIC_FEATURE_UTILITY_BAR` is `true`

### Feature Flag

Control the utility bar via the `NEXT_PUBLIC_FEATURE_UTILITY_BAR` environment variable:

```bash
# Enable the utility bar
NEXT_PUBLIC_FEATURE_UTILITY_BAR=true

# Disable the utility bar
NEXT_PUBLIC_FEATURE_UTILITY_BAR=false
```

**Default behavior** (when env var is not set):
- ✅ Enabled in `development` and `staging`
- ❌ Disabled in `production`

## Security

### Admin-Gated Actions

All personalization clear actions require an admin session:
- Server-side validation via NextAuth
- Returns 401 Unauthorized if session is missing
- Cannot be spoofed from client-side

### Session Storage

Personalization state is stored in HTTP-only cookies:
- `persx_industry` - Selected industry
- `persx_tool` - Selected tool
- `persx_goal` - Selected goal

### CSRF Protection

Uses Next.js Server Actions which have built-in CSRF protection:
- Actions are bound to the user's session
- Cannot be called from external domains

## Technical Details

### Server Components
- `lib/admin-session.ts` - Server utilities for session detection
- `app/actions/personalization.ts` - Server actions for clearing personalization

### Client Components
- `components/AdminUtilityBar.tsx` - UI component with controls

### Layout Integration
- Rendered in `app/layout.tsx` at the top of the page
- Fixed positioning with `z-50` to stay above all content
- Adds `pt-12` padding to prevent content from being hidden

### Styling
- Gradient background: `from-blue-600 to-purple-600`
- Fixed height: `48px` (h-12)
- Responsive: Works on all screen sizes
- Accessible: High contrast, keyboard navigation, ARIA labels

## Accessibility

### Keyboard Navigation
- All buttons are keyboard-operable
- Focus styles with ring indicators
- Logical tab order

### Screen Reader Support
- ARIA live region announces success messages
- Clear button has `aria-label="Clear industry"`
- Role="status" for success messages

### Visual
- High contrast white text on gradient background
- Focus indicators visible
- Disabled state shows reduced opacity

## Usage

### For Admins

1. **View personalization state**: Log in to see the utility bar with current personalization
2. **Clear industry**: Click "Clear" on the industry chip
3. **Clear all**: Click "Clear personalization" to reset everything
4. **Access admin**: Click "Admin" to go to the admin panel

### For Developers

#### Enable in development
```bash
# In .env.local
NEXT_PUBLIC_FEATURE_UTILITY_BAR=true
```

#### Test personalization
Use the server actions to set personalization values:
```typescript
import { setIndustry, setTool, setGoal } from "@/app/actions/personalization";

// In a server component or server action
await setIndustry("Healthcare");
await setTool("Optimizely");
await setGoal("Increase Conversion");
```

#### Check admin state in components
```typescript
import { getAdminSessionState } from "@/lib/admin-session";

// In a server component
const adminState = await getAdminSessionState();

if (adminState.isAdminSession) {
  // Show admin-specific content
}

if (adminState.industry) {
  // Show industry-specific content
}
```

## Deployment

### Staging Environment
```bash
# Enable by default
NEXT_PUBLIC_FEATURE_UTILITY_BAR=true
```

### Production Environment
```bash
# Disable by default (or omit the variable)
NEXT_PUBLIC_FEATURE_UTILITY_BAR=false

# Enable if needed for admin testing
NEXT_PUBLIC_FEATURE_UTILITY_BAR=true
```

## Troubleshooting

### Bar not showing

**Check:**
1. Are you logged in? (Admin session required)
2. Is the feature flag enabled? Check `NEXT_PUBLIC_FEATURE_UTILITY_BAR`
3. Clear browser cache and hard refresh

### Clear actions not working

**Check:**
1. Are you logged in? (Server actions require admin session)
2. Check browser console for errors
3. Verify NextAuth session is valid

### Layout shifts

The utility bar reserves 48px of space at the top when visible. If you're seeing layout issues:
1. Check that `pt-12` class is applied to the main content wrapper
2. Verify the bar has `fixed` positioning
3. Ensure no other fixed elements conflict with `z-50`

## Future Enhancements

Potential improvements for future releases:
- Add tool and goal clear buttons
- Show quick personalization selector dropdown
- Display more session metadata
- Add keyboard shortcuts
- Export/import personalization presets

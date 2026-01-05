# Dummy Data & Fallback System

## Overview

The CMS Éducatif includes an automatic fallback system that uses dummy/mock data when Supabase is not configured or unavailable. This allows you to test and develop the application without needing a Supabase account or database setup.

## How It Works

### 1. **Automatic Detection**

When the app starts, it checks if Supabase credentials are configured:

```typescript
// src/lib/supabase.ts
export const isSupabaseReady = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey && supabaseUrl.length > 0 && supabaseAnonKey.length > 0);
};
```

If environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are missing or empty, the app automatically switches to **demo mode** using dummy data.

### 2. **Fallback Functions**

All database queries are wrapped with safe fallback functions in `src/lib/supabaseWithFallback.ts`:

- `checkUserSafe()` - Returns dummy user if Supabase unavailable
- `fetchUniversitiesSafe()` - Returns mock universities
- `fetchFacultiesSafe()` - Returns mock faculties
- `fetchFieldsSafe()` - Returns mock fields
- `fetchSemestersSafe()` - Returns mock semesters
- `fetchSubjectsSafe()` - Returns mock subjects
- `fetchSchoolLevelsSafe()` - Returns mock school levels
- `fetchSchoolYearsSafe()` - Returns mock school years
- `fetchSchoolSubjectsSafe()` - Returns mock school subjects
- `fetchPublishedPostsSafe()` - Returns mock posts
- `insertPostSafe()` - Requires Supabase (throws error if not configured)

### 3. **Dummy Data Files**

Mock data is stored in `src/lib/dummyData.ts` and includes:

#### Universities & Hierarchy
- 3 sample universities
- 3 sample faculties
- 3 sample fields (both licence and master levels)
- 3 sample semesters
- 3 sample subjects

#### School Structure
- 2 school levels (Collège, Lycée)
- 6 school years
- 3 school subjects

#### Content
- 3 sample posts (mixed university and school content)

#### Demo User
- Role: admin
- Email: demo@example.com
- Status: Automatically logged in

## Using Dummy Data

### Development Without Supabase

1. **Leave environment variables empty** (or don't create `.env.local`)
2. **Run the app**: `npm run dev`
3. **Click "Se connecter"** - A yellow notification indicates demo mode is active
4. **Browse sample data** - All dropdowns, forms, and content are pre-populated

### Testing Features

With dummy data, you can:
- ✅ Test the UI and navigation
- ✅ Browse the dashboard
- ✅ Fill out create forms
- ✅ See cascading dropdown behavior
- ✅ Test form validation
- ✅ Preview the 3-step form workflow

### Features Limited in Demo Mode

- ❌ Cannot create/publish new posts (insert requires Supabase auth)
- ❌ Logout returns to login page
- ❌ No actual data persistence

## Switching to Supabase

When you're ready to use a real database:

1. **Configure Supabase**:
   ```bash
   # Create .env.local
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

2. **Run database setup**:
   ```sql
   -- Execute schema.sql in Supabase console
   -- Execute rls.sql for security policies
   ```

3. **Create a test user** in Supabase Auth dashboard

4. **Restart dev server** - App will now use real Supabase instead of dummy data

## Console Logging

When using dummy data, the browser console will show:

```
Using dummy user (Supabase not configured)
Using dummy universities (Supabase not configured)
Using dummy faculties (Supabase not configured)
... etc
```

This helps verify the fallback system is active during development.

## Adding More Dummy Data

To expand the mock dataset, edit `src/lib/dummyData.ts`:

```typescript
export const dummyUniversities: University[] = [
  // Add new universities here
  {
    id: 'unique-uuid',
    name: 'New University',
    city: 'City Name',
    created_at: new Date().toISOString(),
  },
];
```

Then update the helper functions if needed:

```typescript
export const getDummyFacultiesByUniversity = (universityId: string): Faculty[] => {
  return dummyFaculties.filter((f) => f.university_id === universityId);
};
```

## Architecture Benefits

1. **Zero Dependencies** - No need for external services during dev
2. **Type-Safe** - Full TypeScript support for all mock data
3. **Seamless Transition** - Switch between dummy and real data without code changes
4. **Error Handling** - Graceful fallbacks on any Supabase error
5. **Logging** - Console messages help track data source

## FAQ

**Q: Will my data persist if I'm using dummy data?**
A: No. Dummy data is in-memory only. Refresh the page to reset.

**Q: Can I test the creation forms in demo mode?**
A: Yes! You can fill out all forms. Publishing is prevented but you can see the validation.

**Q: How do I know if I'm in demo mode?**
A: Check the login page for the yellow notification box. Browser console will show "Using dummy..." messages.

**Q: What happens if Supabase is partially configured?**
A: The fallback system treats partial/invalid configs as "not ready" and uses dummy data.

**Q: Can I modify the fallback timeout?**
A: Each function has its own try/catch. No timeout - it either works immediately or falls back.

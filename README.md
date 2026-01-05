# Moroccan Education CMS

A modern educational content management system built with Vite, React, TypeScript, and Supabase.

## Features

- 📚 University content management (courses, exams, TDs, summaries)
- 🏫 School content management (Collège & Lycée)
- 👤 Role-based access control (Admin, Moderator)
- 🔐 Supabase authentication and authorization
- 📱 Responsive design with Tailwind CSS
- ⚡ Fast development with Vite

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Icons**: Lucide React

## Project Structure

```
moroccan-education-cms/
├── src/
│   ├── App.tsx              # Main application with all components
│   ├── main.tsx             # React entry point
│   ├── index.css            # Tailwind imports
│   ├── lib/
│   │   └── supabase.ts      # Supabase client
│   ├── types/
│   │   └── index.ts         # TypeScript type definitions
│   └── components/          # Component folder structure
├── supabase/
│   ├── schema.sql           # Database schema
│   └── rls.sql              # Row Level Security policies
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── .env.example
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Copy your project URL and anon key
3. Create `.env.local`:

```
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 3. Set Up Database

1. Go to Supabase SQL Editor
2. Run `supabase/schema.sql` to create tables
3. Run `supabase/rls.sql` to enable RLS and policies
4. Create test users through Supabase Auth

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Key Components

- **App.tsx**: Main application with auth, navigation, and all sub-components
- **LoginPage**: Email/password authentication
- **Dashboard**: Statistics and quick actions
- **CreateUniversityPost**: 3-step form for university content
- **CreateSchoolPost**: 3-step form for school content
- **BrowseContent**: Display all published content
- **Select**: Reusable dropdown component

## Database Structure

### University Hierarchy
- Universities
  - Faculties
    - Fields (Licence/Master)
      - Semesters (S1-S6)
        - Subjects

### School Hierarchy
- School Levels (Collège/Lycée)
  - School Years
    - School Subjects

### Content
- Posts (unified for both university and school)
- Tags (for categorization)

## Authentication

- Users authenticate with email/password via Supabase Auth
- Roles: Admin, Moderator
- Content creation restricted to authenticated moderators
- RLS policies enforce data access control

## UI/UX Features

- ADHD-friendly interface with one task per screen
- Progressive forms with step indicators
- Clear visual feedback (loading states, success messages)
- Responsive grid layouts
- Tailwind CSS for consistent styling

## Development Notes

- All components are in a single App.tsx file for simplicity
- Strict TypeScript configuration enabled
- Error handling with try/catch blocks
- Loading states for all async operations
- No external UI libraries (only lucide-react for icons)

## License

MIT

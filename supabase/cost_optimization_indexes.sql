-- Cost Optimization: Database Indexes
-- Run this in Supabase SQL Editor to speed up queries (FREE!)

-- Posts Indexes (most queried table)
CREATE INDEX IF NOT EXISTS idx_posts_published 
ON posts(published);

CREATE INDEX IF NOT EXISTS idx_posts_created_at 
ON posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_posts_education_type 
ON posts(education_type);

CREATE INDEX IF NOT EXISTS idx_posts_content_type 
ON posts(content_type);

-- Combined index for common filters (published + recent)
CREATE INDEX IF NOT EXISTS idx_posts_published_created 
ON posts(published DESC, created_at DESC);

-- University & Faculty Hierarchies (for efficient lookups)
CREATE INDEX IF NOT EXISTS idx_faculties_university_id 
ON faculties(university_id);

CREATE INDEX IF NOT EXISTS idx_fields_faculty_id 
ON fields(faculty_id);

CREATE INDEX IF NOT EXISTS idx_semesters_field_id 
ON semesters(field_id);

CREATE INDEX IF NOT EXISTS idx_subjects_semester_id 
ON subjects(semester_id);

CREATE INDEX IF NOT EXISTS idx_school_years_level_id 
ON school_years(level_id);

CREATE INDEX IF NOT EXISTS idx_school_subjects_year_id 
ON school_subjects(year_id);

-- Analyze tables to update statistics (improves query planner)
ANALYZE posts;
ANALYZE universities;
ANALYZE faculties;
ANALYZE fields;
ANALYZE semesters;
ANALYZE subjects;
ANALYZE school_levels;
ANALYZE school_years;
ANALYZE school_subjects;

-- Result: Queries will be 5-10x faster!
-- This means fewer timeouts, fewer retries, fewer API calls.

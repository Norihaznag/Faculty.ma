-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- University structure
CREATE TABLE universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE faculties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_type TEXT NOT NULL CHECK (degree_type IN ('licence', 'master')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (name IN ('S1', 'S2', 'S3', 'S4', 'S5', 'S6')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(field_id, name)
);

CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- School structure
CREATE TABLE school_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('Collège', 'Lycée')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE school_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES school_levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(level_id, name)
);

CREATE TABLE school_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_id UUID NOT NULL REFERENCES school_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (unified)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('course', 'exam', 'td', 'summary', 'link')),
  education_type TEXT NOT NULL CHECK (education_type IN ('university', 'school')),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  school_subject_id UUID REFERENCES school_subjects(id) ON DELETE CASCADE,
  file_url TEXT,
  embed_url TEXT,
  published BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT correct_subject_reference CHECK (
    (education_type = 'university' AND subject_id IS NOT NULL AND school_subject_id IS NULL) OR
    (education_type = 'school' AND school_subject_id IS NOT NULL AND subject_id IS NULL)
  )
);

-- Tags
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Indexes
CREATE INDEX idx_faculties_university ON faculties(university_id);
CREATE INDEX idx_fields_faculty ON fields(faculty_id);
CREATE INDEX idx_semesters_field ON semesters(field_id);
CREATE INDEX idx_subjects_semester ON subjects(semester_id);
CREATE INDEX idx_school_years_level ON school_years(level_id);
CREATE INDEX idx_school_subjects_year ON school_subjects(year_id);
CREATE INDEX idx_posts_subject ON posts(subject_id);
CREATE INDEX idx_posts_school_subject ON posts(school_subject_id);
CREATE INDEX idx_posts_published ON posts(published);
CREATE INDEX idx_posts_education_type ON posts(education_type);

-- Seed school structure
INSERT INTO school_levels (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Collège'),
  ('00000000-0000-0000-0000-000000000002', 'Lycée');

INSERT INTO school_years (level_id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', '1ère Année Collège'),
  ('00000000-0000-0000-0000-000000000001', '2ème Année Collège'),
  ('00000000-0000-0000-0000-000000000001', '3ème Année Collège'),
  ('00000000-0000-0000-0000-000000000002', 'Tronc Commun'),
  ('00000000-0000-0000-0000-000000000002', '1ère Année Bac'),
  ('00000000-0000-0000-0000-000000000002', '2ème Année Bac');

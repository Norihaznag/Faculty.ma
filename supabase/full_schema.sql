-- Full Schema + RLS for Faculty.ma (CMS + Next.js)
-- ASCII-only strings to avoid encoding issues.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (maps to Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'moderator')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- University structure
CREATE TABLE IF NOT EXISTS universities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS faculties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  faculty_id UUID NOT NULL REFERENCES faculties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  degree_type TEXT NOT NULL CHECK (degree_type IN ('licence', 'master')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS semesters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  field_id UUID NOT NULL REFERENCES fields(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (name IN ('S1', 'S2', 'S3', 'S4', 'S5', 'S6')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(field_id, name)
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- School structure
CREATE TABLE IF NOT EXISTS school_levels (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE CHECK (name IN ('College', 'Lycee')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS school_years (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  level_id UUID NOT NULL REFERENCES school_levels(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(level_id, name)
);

CREATE TABLE IF NOT EXISTS school_subjects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  year_id UUID NOT NULL REFERENCES school_years(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts table (unified)
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  excerpt TEXT,
  thumbnail TEXT,
  category TEXT,
  university TEXT,
  field TEXT,
  subject TEXT,
  grade TEXT,
  content TEXT,
  content_type TEXT NOT NULL CHECK (content_type IN ('course', 'exam', 'td', 'summary', 'link')),
  education_type TEXT NOT NULL CHECK (education_type IN ('university', 'school')),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  school_subject_id UUID REFERENCES school_subjects(id) ON DELETE CASCADE,
  file_url TEXT,
  embed_url TEXT,
  read_time INTEGER,
  views INTEGER DEFAULT 0,
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
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Resource requests
CREATE TABLE IF NOT EXISTS resource_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT,
  education_type TEXT NOT NULL CHECK (education_type IN ('university', 'school')),
  level TEXT,
  subject TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'published', 'rejected')),
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content packs
CREATE TABLE IF NOT EXISTS content_packs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  education_type TEXT CHECK (education_type IN ('university', 'school')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content_pack_items (
  pack_id UUID NOT NULL REFERENCES content_packs(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  position INTEGER DEFAULT 0,
  PRIMARY KEY (pack_id, post_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_faculties_university ON faculties(university_id);
CREATE INDEX IF NOT EXISTS idx_fields_faculty ON fields(faculty_id);
CREATE INDEX IF NOT EXISTS idx_semesters_field ON semesters(field_id);
CREATE INDEX IF NOT EXISTS idx_subjects_semester ON subjects(semester_id);
CREATE INDEX IF NOT EXISTS idx_school_years_level ON school_years(level_id);
CREATE INDEX IF NOT EXISTS idx_school_subjects_year ON school_subjects(year_id);
CREATE INDEX IF NOT EXISTS idx_posts_subject ON posts(subject_id);
CREATE INDEX IF NOT EXISTS idx_posts_school_subject ON posts(school_subject_id);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published);
CREATE INDEX IF NOT EXISTS idx_posts_education_type ON posts(education_type);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_resource_requests_status ON resource_requests(status);
CREATE INDEX IF NOT EXISTS idx_resource_requests_created_at ON resource_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_content_packs_status ON content_packs(status);
CREATE INDEX IF NOT EXISTS idx_content_pack_items_pack ON content_pack_items(pack_id);

-- Seed school structure
INSERT INTO school_levels (id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', 'College'),
  ('00000000-0000-0000-0000-000000000002', 'Lycee')
ON CONFLICT DO NOTHING;

INSERT INTO school_years (level_id, name) VALUES
  ('00000000-0000-0000-0000-000000000001', '1ere Annee College'),
  ('00000000-0000-0000-0000-000000000001', '2eme Annee College'),
  ('00000000-0000-0000-0000-000000000001', '3eme Annee College'),
  ('00000000-0000-0000-0000-000000000002', 'Common Core'),
  ('00000000-0000-0000-0000-000000000002', '1ere Annee Bac'),
  ('00000000-0000-0000-0000-000000000002', '2eme Annee Bac')
ON CONFLICT DO NOTHING;

-- ===================
-- RLS
-- ===================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE faculties ENABLE ROW LEVEL SECURITY;
ALTER TABLE fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_pack_items ENABLE ROW LEVEL SECURITY;

-- Helper functions
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_moderator_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('admin', 'moderator')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (is_admin());

-- Structure policies
DROP POLICY IF EXISTS "Anyone can view universities" ON universities;
DROP POLICY IF EXISTS "Only admins can insert universities" ON universities;
DROP POLICY IF EXISTS "Only admins can update universities" ON universities;
DROP POLICY IF EXISTS "Only admins can delete universities" ON universities;
CREATE POLICY "Anyone can view universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Only admins can insert universities" ON universities FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update universities" ON universities FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete universities" ON universities FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view faculties" ON faculties;
DROP POLICY IF EXISTS "Only admins can insert faculties" ON faculties;
DROP POLICY IF EXISTS "Only admins can update faculties" ON faculties;
DROP POLICY IF EXISTS "Only admins can delete faculties" ON faculties;
CREATE POLICY "Anyone can view faculties" ON faculties FOR SELECT USING (true);
CREATE POLICY "Only admins can insert faculties" ON faculties FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update faculties" ON faculties FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete faculties" ON faculties FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view fields" ON fields;
DROP POLICY IF EXISTS "Only admins can insert fields" ON fields;
DROP POLICY IF EXISTS "Only admins can update fields" ON fields;
DROP POLICY IF EXISTS "Only admins can delete fields" ON fields;
CREATE POLICY "Anyone can view fields" ON fields FOR SELECT USING (true);
CREATE POLICY "Only admins can insert fields" ON fields FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update fields" ON fields FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete fields" ON fields FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view semesters" ON semesters;
DROP POLICY IF EXISTS "Only admins can insert semesters" ON semesters;
DROP POLICY IF EXISTS "Only admins can update semesters" ON semesters;
DROP POLICY IF EXISTS "Only admins can delete semesters" ON semesters;
CREATE POLICY "Anyone can view semesters" ON semesters FOR SELECT USING (true);
CREATE POLICY "Only admins can insert semesters" ON semesters FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update semesters" ON semesters FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete semesters" ON semesters FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view subjects" ON subjects;
DROP POLICY IF EXISTS "Only admins can insert subjects" ON subjects;
DROP POLICY IF EXISTS "Only admins can update subjects" ON subjects;
DROP POLICY IF EXISTS "Only admins can delete subjects" ON subjects;
CREATE POLICY "Anyone can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert subjects" ON subjects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update subjects" ON subjects FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete subjects" ON subjects FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view school levels" ON school_levels;
DROP POLICY IF EXISTS "Only admins can insert school levels" ON school_levels;
DROP POLICY IF EXISTS "Only admins can update school levels" ON school_levels;
DROP POLICY IF EXISTS "Only admins can delete school levels" ON school_levels;
CREATE POLICY "Anyone can view school levels" ON school_levels FOR SELECT USING (true);
CREATE POLICY "Only admins can insert school levels" ON school_levels FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update school levels" ON school_levels FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete school levels" ON school_levels FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view school years" ON school_years;
DROP POLICY IF EXISTS "Only admins can insert school years" ON school_years;
DROP POLICY IF EXISTS "Only admins can update school years" ON school_years;
DROP POLICY IF EXISTS "Only admins can delete school years" ON school_years;
CREATE POLICY "Anyone can view school years" ON school_years FOR SELECT USING (true);
CREATE POLICY "Only admins can insert school years" ON school_years FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update school years" ON school_years FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete school years" ON school_years FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Anyone can view school subjects" ON school_subjects;
DROP POLICY IF EXISTS "Only admins can insert school subjects" ON school_subjects;
DROP POLICY IF EXISTS "Only admins can update school subjects" ON school_subjects;
DROP POLICY IF EXISTS "Only admins can delete school subjects" ON school_subjects;
CREATE POLICY "Anyone can view school subjects" ON school_subjects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert school subjects" ON school_subjects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update school subjects" ON school_subjects FOR UPDATE USING (is_admin());
CREATE POLICY "Only admins can delete school subjects" ON school_subjects FOR DELETE USING (is_admin());

-- Posts policies
DROP POLICY IF EXISTS "Anyone can view published posts" ON posts;
DROP POLICY IF EXISTS "Moderators can view all posts" ON posts;
DROP POLICY IF EXISTS "Moderators can insert posts" ON posts;
DROP POLICY IF EXISTS "Users can update own posts" ON posts;
DROP POLICY IF EXISTS "Admins can update all posts" ON posts;
DROP POLICY IF EXISTS "Users can delete own posts" ON posts;
DROP POLICY IF EXISTS "Admins can delete all posts" ON posts;
CREATE POLICY "Anyone can view published posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Moderators can view all posts" ON posts FOR SELECT USING (is_moderator_or_admin());
CREATE POLICY "Moderators can insert posts" ON posts FOR INSERT WITH CHECK (is_moderator_or_admin());
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Admins can update all posts" ON posts FOR UPDATE USING (is_admin());
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (created_by = auth.uid());
CREATE POLICY "Admins can delete all posts" ON posts FOR DELETE USING (is_admin());

-- Tags policies
DROP POLICY IF EXISTS "Anyone can view tags" ON tags;
DROP POLICY IF EXISTS "Moderators can insert tags" ON tags;
DROP POLICY IF EXISTS "Anyone can view post tags" ON post_tags;
DROP POLICY IF EXISTS "Moderators can manage post tags" ON post_tags;
CREATE POLICY "Anyone can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Moderators can insert tags" ON tags FOR INSERT WITH CHECK (is_moderator_or_admin());
CREATE POLICY "Anyone can view post tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Moderators can manage post tags" ON post_tags FOR ALL USING (is_moderator_or_admin());

-- Resource requests policies
DROP POLICY IF EXISTS "Anyone can create resource requests" ON resource_requests;
DROP POLICY IF EXISTS "Anyone can view published requests" ON resource_requests;
DROP POLICY IF EXISTS "Moderators can view resource requests" ON resource_requests;
DROP POLICY IF EXISTS "Moderators can update resource requests" ON resource_requests;
DROP POLICY IF EXISTS "Moderators can delete resource requests" ON resource_requests;
CREATE POLICY "Anyone can create resource requests" ON resource_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view published requests" ON resource_requests FOR SELECT USING (status = 'published');
CREATE POLICY "Moderators can view resource requests" ON resource_requests FOR SELECT USING (is_moderator_or_admin());
CREATE POLICY "Moderators can update resource requests" ON resource_requests FOR UPDATE USING (is_moderator_or_admin());
CREATE POLICY "Moderators can delete resource requests" ON resource_requests FOR DELETE USING (is_moderator_or_admin());

-- Content packs policies
DROP POLICY IF EXISTS "Anyone can view published packs" ON content_packs;
DROP POLICY IF EXISTS "Moderators can view packs" ON content_packs;
DROP POLICY IF EXISTS "Moderators can manage packs" ON content_packs;
CREATE POLICY "Anyone can view published packs" ON content_packs FOR SELECT USING (status = 'published' AND visibility = 'public');
CREATE POLICY "Moderators can view packs" ON content_packs FOR SELECT USING (is_moderator_or_admin());
CREATE POLICY "Moderators can manage packs" ON content_packs FOR ALL USING (is_moderator_or_admin());

DROP POLICY IF EXISTS "Anyone can view pack items" ON content_pack_items;
DROP POLICY IF EXISTS "Moderators can manage pack items" ON content_pack_items;
CREATE POLICY "Anyone can view pack items" ON content_pack_items FOR SELECT USING (true);
CREATE POLICY "Moderators can manage pack items" ON content_pack_items FOR ALL USING (is_moderator_or_admin());

-- Enable RLS
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

-- Structure policies (universities, faculties, etc.)
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

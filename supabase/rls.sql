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
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can view all users" ON users FOR SELECT USING (is_admin());

-- Structure policies (universities, faculties, etc.)
CREATE POLICY "Anyone can view universities" ON universities FOR SELECT USING (true);
CREATE POLICY "Only admins can insert universities" ON universities FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update universities" ON universities FOR UPDATE USING (is_admin());

CREATE POLICY "Anyone can view faculties" ON faculties FOR SELECT USING (true);
CREATE POLICY "Only admins can insert faculties" ON faculties FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update faculties" ON faculties FOR UPDATE USING (is_admin());

CREATE POLICY "Anyone can view fields" ON fields FOR SELECT USING (true);
CREATE POLICY "Only admins can insert fields" ON fields FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update fields" ON fields FOR UPDATE USING (is_admin());

CREATE POLICY "Anyone can view semesters" ON semesters FOR SELECT USING (true);
CREATE POLICY "Only admins can insert semesters" ON semesters FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update semesters" ON semesters FOR UPDATE USING (is_admin());

CREATE POLICY "Anyone can view subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert subjects" ON subjects FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Only admins can update subjects" ON subjects FOR UPDATE USING (is_admin());

CREATE POLICY "Anyone can view school levels" ON school_levels FOR SELECT USING (true);
CREATE POLICY "Anyone can view school years" ON school_years FOR SELECT USING (true);
CREATE POLICY "Anyone can view school subjects" ON school_subjects FOR SELECT USING (true);
CREATE POLICY "Only admins can insert school subjects" ON school_subjects FOR INSERT WITH CHECK (is_admin());

-- Posts policies
CREATE POLICY "Anyone can view published posts" ON posts FOR SELECT USING (published = true);
CREATE POLICY "Moderators can view all posts" ON posts FOR SELECT USING (is_moderator_or_admin());
CREATE POLICY "Moderators can insert posts" ON posts FOR INSERT WITH CHECK (is_moderator_or_admin());
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Admins can update all posts" ON posts FOR UPDATE USING (is_admin());
CREATE POLICY "Users can delete own posts" ON posts FOR DELETE USING (created_by = auth.uid());
CREATE POLICY "Admins can delete all posts" ON posts FOR DELETE USING (is_admin());

-- Tags policies
CREATE POLICY "Anyone can view tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Moderators can insert tags" ON tags FOR INSERT WITH CHECK (is_moderator_or_admin());
CREATE POLICY "Anyone can view post tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Moderators can manage post tags" ON post_tags FOR ALL USING (is_moderator_or_admin());

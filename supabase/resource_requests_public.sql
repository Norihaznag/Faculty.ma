-- Public read access for published requests
DROP POLICY IF EXISTS "Anyone can view published requests" ON resource_requests;
CREATE POLICY "Anyone can view published requests" ON resource_requests
  FOR SELECT USING (status = 'published');

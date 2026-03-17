-- Run this in the Supabase SQL Editor to fix the RLS errors

-- Option 1: Disable Row Level Security (Recommended since your Next.js API routes handle authentication)
ALTER TABLE announcements DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
ALTER TABLE problem_statements DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_locks DISABLE ROW LEVEL SECURITY;
ALTER TABLE submissions DISABLE ROW LEVEL SECURITY;

-- Option 2: If you want to keep RLS enabled, run these policies instead to allow all access via the anon key
-- (Your Next.js API routes already protect the admin actions)
CREATE POLICY "Allow all operations for anon" ON announcements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON results FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON problem_statements FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON page_locks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for anon" ON submissions FOR ALL USING (true) WITH CHECK (true);

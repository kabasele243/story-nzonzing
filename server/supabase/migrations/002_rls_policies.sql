-- Enable Row Level Security on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE series ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE episode_scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflow_runs ENABLE ROW LEVEL SECURITY;

-- Helper function to get the current Clerk user ID from the request
CREATE OR REPLACE FUNCTION auth.clerk_user_id() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::json->>'sub', '')::text;
$$ LANGUAGE SQL STABLE;

-- Alternative: Get Clerk user ID from custom header (for service role key usage)
CREATE OR REPLACE FUNCTION get_clerk_user_id() RETURNS TEXT AS $$
  SELECT NULLIF(current_setting('request.headers', true)::json->>'x-clerk-user-id', '')::text;
$$ LANGUAGE SQL STABLE;

-- Users table policies
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert their own profile"
  ON users FOR INSERT
  WITH CHECK (clerk_user_id = get_clerk_user_id());

-- Stories table policies
CREATE POLICY "Users can view their own stories"
  ON stories FOR SELECT
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert their own stories"
  ON stories FOR INSERT
  WITH CHECK (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update their own stories"
  ON stories FOR UPDATE
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can delete their own stories"
  ON stories FOR DELETE
  USING (clerk_user_id = get_clerk_user_id());

-- Scenes table policies
CREATE POLICY "Users can view their own scenes"
  ON scenes FOR SELECT
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert their own scenes"
  ON scenes FOR INSERT
  WITH CHECK (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update their own scenes"
  ON scenes FOR UPDATE
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can delete their own scenes"
  ON scenes FOR DELETE
  USING (clerk_user_id = get_clerk_user_id());

-- Series table policies
CREATE POLICY "Users can view their own series"
  ON series FOR SELECT
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert their own series"
  ON series FOR INSERT
  WITH CHECK (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update their own series"
  ON series FOR UPDATE
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can delete their own series"
  ON series FOR DELETE
  USING (clerk_user_id = get_clerk_user_id());

-- Episodes table policies
CREATE POLICY "Users can view their own episodes"
  ON episodes FOR SELECT
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert their own episodes"
  ON episodes FOR INSERT
  WITH CHECK (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update their own episodes"
  ON episodes FOR UPDATE
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can delete their own episodes"
  ON episodes FOR DELETE
  USING (clerk_user_id = get_clerk_user_id());

-- Episode scenes table policies
CREATE POLICY "Users can view their own episode scenes"
  ON episode_scenes FOR SELECT
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert their own episode scenes"
  ON episode_scenes FOR INSERT
  WITH CHECK (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update their own episode scenes"
  ON episode_scenes FOR UPDATE
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can delete their own episode scenes"
  ON episode_scenes FOR DELETE
  USING (clerk_user_id = get_clerk_user_id());

-- Workflow runs table policies
CREATE POLICY "Users can view their own workflow runs"
  ON workflow_runs FOR SELECT
  USING (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can insert their own workflow runs"
  ON workflow_runs FOR INSERT
  WITH CHECK (clerk_user_id = get_clerk_user_id());

CREATE POLICY "Users can update their own workflow runs"
  ON workflow_runs FOR UPDATE
  USING (clerk_user_id = get_clerk_user_id());

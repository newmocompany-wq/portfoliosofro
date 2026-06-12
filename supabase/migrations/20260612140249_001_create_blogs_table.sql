CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT,
  cover TEXT,
  date DATE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public read policy (anyone can view blogs)
CREATE POLICY "select_blogs_public" ON blogs FOR SELECT
  TO public USING (true);

-- Authenticated CRUD policies for admin
CREATE POLICY "insert_blogs_authenticated" ON blogs FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "update_blogs_authenticated" ON blogs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "delete_blogs_authenticated" ON blogs FOR DELETE
  TO authenticated USING (true);

-- Index for slug lookups
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_date ON blogs(date DESC);
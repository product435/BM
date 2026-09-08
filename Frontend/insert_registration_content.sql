CREATE TABLE IF NOT EXISTS registration_content (
    id SERIAL PRIMARY KEY,
    eyebrow TEXT NOT NULL,
    title TEXT NOT NULL,
    lede TEXT NOT NULL,
    steps JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Allow public read access
ALTER TABLE registration_content ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'registration_content' AND policyname = 'Allow public read access on registration_content'
    ) THEN
        CREATE POLICY "Allow public read access on registration_content" ON registration_content FOR SELECT USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'registration_content' AND policyname = 'Allow authenticated to update registration_content'
    ) THEN
        CREATE POLICY "Allow authenticated to update registration_content" ON registration_content FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

INSERT INTO registration_content (
    id, 
    eyebrow, 
    title, 
    lede, 
    steps
) VALUES (
    1,
    '11 — Registration',
    'Ready to be <span class="t-italic t-emerald">part of the event?</span>',
    'Seats are limited and the event is curated. Tell us who''s coming and how you want to show up.',
    '[
      {"title":"Choose your category.","description":"Student, Visitor, Entrepreneur or Business Tycoon."},
      {"title":"Share your details.","description":"The form adapts to your path."},
      {"title":"We confirm your seat.","description":"You show up on the day and make the event count."}
    ]'
)
ON CONFLICT (id) DO UPDATE SET 
    eyebrow = EXCLUDED.eyebrow,
    title = EXCLUDED.title,
    lede = EXCLUDED.lede,
    steps = EXCLUDED.steps;

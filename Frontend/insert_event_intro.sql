CREATE TABLE IF NOT EXISTS event_intro (
    id SERIAL PRIMARY KEY,
    eyebrow TEXT NOT NULL,
    title TEXT NOT NULL,
    paragraph_1 TEXT NOT NULL,
    paragraph_2 TEXT NOT NULL,
    intro_words JSONB NOT NULL,
    image_url TEXT NOT NULL,
    media_headline TEXT NOT NULL,
    media_pills JSONB NOT NULL,
    media_location TEXT NOT NULL,
    stats JSONB NOT NULL,
    footer_note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Allow public read access
ALTER TABLE event_intro ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'event_intro' AND policyname = 'Allow public read access on event_intro'
    ) THEN
        CREATE POLICY "Allow public read access on event_intro" ON event_intro FOR SELECT USING (true);
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'event_intro' AND policyname = 'Allow authenticated to update event_intro'
    ) THEN
        CREATE POLICY "Allow authenticated to update event_intro" ON event_intro FOR ALL TO authenticated USING (true) WITH CHECK (true);
    END IF;
END $$;

INSERT INTO event_intro (
    id, 
    eyebrow, 
    title, 
    paragraph_1, 
    paragraph_2, 
    intro_words, 
    image_url, 
    media_headline, 
    media_pills, 
    media_location, 
    stats, 
    footer_note
) VALUES (
    1,
    '01 — The Event',
    'More than an event. <span class="t-italic t-emerald">A place</span> where ambition meets opportunity.',
    'BMI Event Startup & Business Launch brings together **promising ideas**, executing startups, operating businesses, entrepreneurs, industry experts and **strategic partners** on one curated platform. The objective goes beyond investment selected ventures may also receive access to management guidance, technology, networks, operational support and strategic expertise.',
    'One city. One powerful gathering. A space to connect, learn, collaborate and create what comes next.',
    '["Connections","Learning","Funding","Scaling","Innovation","Mentorship"]',
    'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    'Funding is only the beginning',
    '["CAPITAL","MANAGEMENT","TECHNOLOGY","OPERATIONS","NETWORK","GROWTH","CONVERSATIONS","REAL CONNECTIONS"]',
    'Jaipur, Rajasthan',
    '[{"value":"04","label":"WAYS TO PARTICIPATE"},{"value":"06+","label":"VOICES IN THE EVENT"},{"value":"01","label":"CITY — JAIPUR"},{"value":"TBA","label":"VENUE — ANNOUNCED SOON"}]',
    'Venue and capacity figures are being finalized details will be confirmed ahead of the event.'
)
ON CONFLICT (id) DO UPDATE SET 
    eyebrow = EXCLUDED.eyebrow,
    title = EXCLUDED.title,
    paragraph_1 = EXCLUDED.paragraph_1,
    paragraph_2 = EXCLUDED.paragraph_2,
    intro_words = EXCLUDED.intro_words,
    image_url = EXCLUDED.image_url,
    media_headline = EXCLUDED.media_headline,
    media_pills = EXCLUDED.media_pills,
    media_location = EXCLUDED.media_location,
    stats = EXCLUDED.stats,
    footer_note = EXCLUDED.footer_note;

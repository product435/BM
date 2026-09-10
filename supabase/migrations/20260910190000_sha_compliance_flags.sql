-- SHA compliance screening columns for registrations
-- Run after 20260904_create_registrations.sql

ALTER TABLE public.registrations
  ADD COLUMN IF NOT EXISTS sector TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS education_connection BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS allen_connection BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS compliance_flag TEXT DEFAULT 'green';

COMMENT ON COLUMN public.registrations.sector IS 'Self-declared business sector from registration form';
COMMENT ON COLUMN public.registrations.education_connection IS 'Yes if connected to coaching/test-prep/education/edtech';
COMMENT ON COLUMN public.registrations.allen_connection IS 'Yes if current/past Allen/ACIPL relation — requires manual review';
COMMENT ON COLUMN public.registrations.compliance_flag IS 'green | amber | red — SHA screening result';

-- Optional index for admin filtering by compliance
CREATE INDEX IF NOT EXISTS idx_registrations_compliance_flag
  ON public.registrations (compliance_flag);

-- One-time SHA-safe update for event_intro CMS copy (id = 1)
UPDATE public.event_intro SET
  paragraph_1 = 'BMI Business Growth Forum brings together **promising ideas**, executing startups, operating businesses, entrepreneurs, industry experts and **strategic partners** on one curated platform — focused on non-education sectors. Selected ventures may receive access to management guidance, technology, networks, operational support and deal-specific capital connect.',
  paragraph_2 = 'One city. One powerful gathering. A space to connect, learn, collaborate and create what comes next — with independent evaluation at every step.',
  intro_words = '["Connections","Learning","Capital Connect","Scaling","Innovation","Mentorship"]'::jsonb,
  media_headline = 'Capital. Capability. Connections.',
  updated_at = NOW()
WHERE id = 1;

-- Soften hero ticker if stored as comma-separated string
UPDATE public.hero_content SET
  ticker = 'Founder Pitches, Capital Connect, Business Networking, Early Ideas, Strategy Sessions, Innovation',
  sub_text = 'A curated platform for Early Innovators, Founders, Operating Businesses, Industry Leaders and Strategic Partners to connect, build and scale. Focused on non-education businesses.',
  primary_cta_text = 'Register for the event',
  secondary_cta_text = 'Explore the forum'
WHERE id = 1
  AND (
    ticker ILIKE '%Funding%'
    OR ticker ILIKE '%Investment Conversations%'
    OR sub_text ILIKE '%investment event%'
    OR primary_cta_text ILIKE 'Register now'
  );

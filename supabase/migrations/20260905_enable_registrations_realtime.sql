-- Enable Supabase Realtime (postgres_changes) for the existing
-- registrations table so the Admin Panel can subscribe to new
-- INSERTs for the notification bell. Additive only — no schema,
-- policy, or data changes.
ALTER PUBLICATION supabase_realtime ADD TABLE public.registrations;

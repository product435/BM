-- Add payment columns to registrations table

-- Ensure idempotent execution by checking if columns exist before adding them.
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registrations' AND column_name = 'payment_amount') THEN
    ALTER TABLE public.registrations ADD COLUMN payment_amount NUMERIC DEFAULT 0;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registrations' AND column_name = 'razorpay_order_id') THEN
    ALTER TABLE public.registrations ADD COLUMN razorpay_order_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registrations' AND column_name = 'razorpay_payment_id') THEN
    ALTER TABLE public.registrations ADD COLUMN razorpay_payment_id TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registrations' AND column_name = 'razorpay_signature') THEN
    ALTER TABLE public.registrations ADD COLUMN razorpay_signature TEXT;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'registrations' AND column_name = 'paid_at') THEN
    ALTER TABLE public.registrations ADD COLUMN paid_at TIMESTAMPTZ;
  END IF;
END $$;

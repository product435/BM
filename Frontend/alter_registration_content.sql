ALTER TABLE registration_content 
ADD COLUMN IF NOT EXISTS fee_student INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS fee_visitor INT DEFAULT 500,
ADD COLUMN IF NOT EXISTS fee_entrepreneur INT DEFAULT 1000,
ADD COLUMN IF NOT EXISTS fee_business_tycoon INT DEFAULT 2000,
ADD COLUMN IF NOT EXISTS upi_id TEXT DEFAULT 'bmipresents@upi';

UPDATE registration_content SET
    fee_student = 0,
    fee_visitor = 500,
    fee_entrepreneur = 1000,
    fee_business_tycoon = 2000,
    upi_id = 'bmipresents@upi'
WHERE id = 1;

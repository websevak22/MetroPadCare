-- ============================================================
-- STOCK MANAGEMENT MIGRATION
-- Paste this into Supabase SQL Editor and click "Run"
-- ============================================================

CREATE TABLE IF NOT EXISTS stock_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key VARCHAR(50) NOT NULL UNIQUE,
  setting_value NUMERIC(12, 2) NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO stock_config (setting_key, setting_value, description) VALUES
  ('initial_stock', 10000, 'Total initial pad stock'),
  ('price_per_pad', 5, 'Price per pad in INR'),
  ('low_stock_threshold', 10, 'Global low stock threshold')
ON CONFLICT (setting_key) DO NOTHING;

-- Also ensure monthly_data table exists (if it doesn't yet)
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS monthly_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    record_date DATE NOT NULL,
    year_month VARCHAR(7) NOT NULL,
    line_id UUID NOT NULL REFERENCES metro_lines(id) ON DELETE RESTRICT,
    station_id UUID NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE RESTRICT,
    cash_collected NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (cash_collected >= 0),
    pads_refilled INT NOT NULL DEFAULT 0 CHECK (pads_refilled >= 0),
    machine_status monthly_machine_status NOT NULL DEFAULT 'WORKING',
    issue_type monthly_issue_type NOT NULL DEFAULT 'NONE',
    notes TEXT,
    next_action TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(machine_id, record_date)
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

SELECT 'Stock config migration complete' AS status;

-- ============================================================
-- STOCK MANAGEMENT: Central Pad Stock + Inventory Settings
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

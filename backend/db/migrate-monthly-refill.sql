-- ================================================================
-- MetroPad Care — Monthly Refill Status Migration
-- Run this in the Supabase SQL Editor (Dashboard → SQL → New query)
--
-- What this adds:
--   1. monthly_refill_status table — marks a machine as
--      COMPLETED / PENDING / UNABLE_TO_REFILL for a given month.
--      "UNABLE TO REFILL" is the only status you set manually;
--      COMPLETED is written automatically when a refill is saved
--      and PENDING is the default when no row exists.
--   2. Fixes an old pad_stock anomaly (machine PAD-RD7-GND-01 had
--      refilled_quantity 62 instead of 12 to match refill_records).
--
-- Safe to run repeatedly (idempotent).
-- ================================================================

CREATE TABLE IF NOT EXISTS monthly_refill_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  year_month VARCHAR(7) NOT NULL,
  refill_status VARCHAR(20) NOT NULL DEFAULT 'PENDING'
    CHECK (refill_status IN ('COMPLETED','PENDING','UNABLE_TO_REFILL')),
  remark TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(machine_id, year_month)
);

CREATE INDEX IF NOT EXISTS idx_monthly_refill_status_machine ON monthly_refill_status(machine_id);
CREATE INDEX IF NOT EXISTS idx_monthly_refill_status_year_month ON monthly_refill_status(year_month);

-- ================================================================
-- DATA FIX — pad_stock anomaly (machine 001 recorded 62, should be 12)
-- ================================================================
UPDATE pad_stock
   SET refilled_quantity = COALESCE((
         SELECT SUM(r.refill_quantity)
           FROM refill_records r
          WHERE r.machine_id = pad_stock.machine_id
            AND r.refill_date = pad_stock.record_date
       ), 0)
 WHERE id IN (
   SELECT ps.id
     FROM pad_stock ps
     LEFT JOIN LATERAL (
       SELECT COALESCE(SUM(refill_quantity), 0) AS qty
         FROM refill_records
        WHERE machine_id = ps.machine_id
          AND refill_date = ps.record_date
     ) r ON TRUE
    WHERE ps.refilled_quantity <> r.qty
 );

-- ================================================================
-- VERIFICATION (run after)
-- ================================================================
-- SELECT * FROM monthly_refill_status LIMIT 5;
-- SELECT machine_id, record_date, refilled_quantity FROM pad_stock WHERE refilled_quantity <> 12;
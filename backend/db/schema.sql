-- MetroPad Care Database Schema
-- Run against Supabase Postgres

-- ============================================================
-- ENUM TYPES
-- ============================================================

DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('ADMIN','OPERATIONS','VIEWER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE entity_status AS ENUM ('ACTIVE','INACTIVE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE machine_status AS ENUM ('ACTIVE','INACTIVE','OFFLINE','MAINTENANCE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE issue_type AS ENUM ('MISSING_PADS','STOCK_MISMATCH','DAMAGED_PADS','DISPENSING_PROBLEM','WRONG_STOCK_COUNT','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE issue_status AS ENUM ('OPEN','INVESTIGATING','RESOLVED','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_priority AS ENUM ('LOW','MEDIUM','HIGH','CRITICAL');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE maintenance_status AS ENUM ('OPEN','ASSIGNED','IN_PROGRESS','RESOLVED','CLOSED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE monthly_machine_status AS ENUM ('WORKING','NOT_WORKING','MAINTENANCE','EMPTY','OTHER_ISSUE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE monthly_issue_type AS ENUM ('NONE','COIN_ACCEPTOR_PROBLEM','MACHINE_NOT_WORKING','DISPENSING_PROBLEM','ELECTRICAL_PROBLEM','STOCK_PROBLEM','OTHER');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'VIEWER',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS metro_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL UNIQUE,
  description TEXT,
  status entity_status NOT NULL DEFAULT 'ACTIVE',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line_id UUID NOT NULL REFERENCES metro_lines(id) ON DELETE RESTRICT,
  station_code VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  status entity_status NOT NULL DEFAULT 'ACTIVE',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id VARCHAR(50) NOT NULL UNIQUE,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  line_id UUID NOT NULL REFERENCES metro_lines(id) ON DELETE RESTRICT,
  location VARCHAR(100),
  machine_type VARCHAR(50) DEFAULT 'Standard',
  capacity INT NOT NULL CHECK (capacity > 0),
  current_stock INT NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 10,
  installation_date DATE,
  status machine_status NOT NULL DEFAULT 'ACTIVE',
  last_refill_at TIMESTAMPTZ,
  last_maintenance_at TIMESTAMPTZ,
  remark TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (current_stock <= capacity)
);

CREATE TABLE IF NOT EXISTS machine_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  previous_status machine_status NOT NULL,
  new_status machine_status NOT NULL,
  changed_by UUID REFERENCES users(id),
  reason TEXT,
  changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS refill_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE RESTRICT,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  refill_date DATE NOT NULL,
  previous_stock INT NOT NULL CHECK (previous_stock >= 0),
  refill_quantity INT NOT NULL CHECK (refill_quantity >= 0),
  new_stock INT NOT NULL CHECK (new_stock >= 0),
  cash_collected NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cash_collected >= 0),
  refilled_by VARCHAR(100) NOT NULL,
  remark TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (new_stock >= previous_stock)
);

ALTER TABLE refill_records
  ADD COLUMN IF NOT EXISTS cash_collected NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (cash_collected >= 0);

CREATE TABLE IF NOT EXISTS pad_stock (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  opening_stock INT NOT NULL DEFAULT 0,
  refilled_quantity INT NOT NULL DEFAULT 0,
  issues_count INT NOT NULL DEFAULT 0,
  missing_count INT NOT NULL DEFAULT 0,
  closing_stock INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(machine_id, record_date)
);

CREATE TABLE IF NOT EXISTS stock_issues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE RESTRICT,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  report_date DATE NOT NULL,
  expected_stock INT NOT NULL CHECK (expected_stock >= 0),
  actual_stock INT NOT NULL CHECK (actual_stock >= 0),
  missing_quantity INT NOT NULL CHECK (missing_quantity >= 0),
  issue_type issue_type NOT NULL DEFAULT 'MISSING_PADS',
  reason TEXT,
  status issue_status NOT NULL DEFAULT 'OPEN',
  reported_by VARCHAR(100) NOT NULL,
  resolved_at TIMESTAMPTZ,
  resolved_by VARCHAR(100),
  remark TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS maintenance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE RESTRICT,
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  problem TEXT NOT NULL,
  reported_date DATE NOT NULL,
  priority maintenance_priority NOT NULL DEFAULT 'MEDIUM',
  technician VARCHAR(100),
  status maintenance_status NOT NULL DEFAULT 'OPEN',
  resolved_date DATE,
  remark TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  user_name VARCHAR(100),
  action VARCHAR(100) NOT NULL,
  entity VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS cash_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID NOT NULL REFERENCES stations(id) ON DELETE RESTRICT,
  record_date DATE NOT NULL,
  cash_collected NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (cash_collected >= 0),
  remark TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(station_id, record_date)
);

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

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_stations_line_id ON stations(line_id);
CREATE INDEX IF NOT EXISTS idx_machines_station_id ON machines(station_id);
CREATE INDEX IF NOT EXISTS idx_machines_line_id ON machines(line_id);
CREATE INDEX IF NOT EXISTS idx_machines_status ON machines(status);
CREATE INDEX IF NOT EXISTS idx_machines_machine_id ON machines(machine_id);
CREATE INDEX IF NOT EXISTS idx_machine_status_history_machine_id ON machine_status_history(machine_id);
CREATE INDEX IF NOT EXISTS idx_refill_records_machine_id ON refill_records(machine_id);
CREATE INDEX IF NOT EXISTS idx_refill_records_station_id ON refill_records(station_id);
CREATE INDEX IF NOT EXISTS idx_refill_records_refill_date ON refill_records(refill_date);
CREATE INDEX IF NOT EXISTS idx_pad_stock_machine_id ON pad_stock(machine_id);
CREATE INDEX IF NOT EXISTS idx_pad_stock_record_date ON pad_stock(record_date);
CREATE INDEX IF NOT EXISTS idx_stock_issues_machine_id ON stock_issues(machine_id);
CREATE INDEX IF NOT EXISTS idx_stock_issues_station_id ON stock_issues(station_id);
CREATE INDEX IF NOT EXISTS idx_stock_issues_report_date ON stock_issues(report_date);
CREATE INDEX IF NOT EXISTS idx_stock_issues_status ON stock_issues(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_machine_id ON maintenance_records(machine_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_station_id ON maintenance_records(station_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_status ON maintenance_records(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_reported_date ON maintenance_records(reported_date);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_cash_collections_station_id ON cash_collections(station_id);
CREATE INDEX IF NOT EXISTS idx_cash_collections_record_date ON cash_collections(record_date);
CREATE INDEX IF NOT EXISTS idx_monthly_data_year_month ON monthly_data(year_month);
CREATE INDEX IF NOT EXISTS idx_monthly_data_line_id ON monthly_data(line_id);
CREATE INDEX IF NOT EXISTS idx_monthly_data_station_id ON monthly_data(station_id);
CREATE INDEX IF NOT EXISTS idx_monthly_data_machine_id ON monthly_data(machine_id);
CREATE INDEX IF NOT EXISTS idx_monthly_data_record_date ON monthly_data(record_date);
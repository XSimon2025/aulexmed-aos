-- AOS Core Schema
-- Migration: 00001_init_core
-- Description: Initial core tables for Review Operations Engine

-- ───── review_cases ─────
CREATE TABLE IF NOT EXISTS review_cases (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform        TEXT NOT NULL CHECK (platform IN ('tiktok', 'temu', 'amazon')),
  source_key      TEXT NOT NULL,
  star_rating     SMALLINT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
  reviewer_name   TEXT,
  review_text     TEXT,
  review_url      TEXT,
  reviewer_avatar TEXT,
  order_id        TEXT,
  product_sku     TEXT,
  product_name    TEXT,
  review_date_raw TEXT,
  review_date     TIMESTAMPTZ,
  raw_payload     JSONB DEFAULT '{}'::jsonb,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- AI analysis results (populated after analysis)
  sentiment               TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative', 'mixed')),
  issue_type              TEXT,
  summary_cn              TEXT,
  summary_en              TEXT,
  reply_draft_cn          TEXT,
  reply_draft_en          TEXT,
  private_reply_draft      TEXT,
  needs_after_sales_case  BOOLEAN DEFAULT false,
  needs_human_review      BOOLEAN DEFAULT false,
  risk_level              TEXT CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  ai_confidence           REAL,

  -- Lifecycle
  status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN (
      'new',
      'analyzed',
      'ready_to_reply',
      'replied',
      'needs_human_review',
      'closed',
      'archived',
      'processing_failed'
    )),

  UNIQUE (platform, source_key)
);

CREATE INDEX IF NOT EXISTS idx_review_cases_platform_status ON review_cases (platform, status);
CREATE INDEX IF NOT EXISTS idx_review_cases_created ON review_cases (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_review_cases_risk ON review_cases (risk_level) WHERE risk_level IN ('high', 'critical');

-- ───── review_case_actions ─────
CREATE TABLE IF NOT EXISTS review_case_actions (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id     UUID NOT NULL REFERENCES review_cases(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_actions_case_id ON review_case_actions (case_id);
CREATE INDEX IF NOT EXISTS idx_actions_created ON review_case_actions (created_at DESC);

-- ───── review_case_messages ─────
CREATE TABLE IF NOT EXISTS review_case_messages (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  case_id    UUID NOT NULL REFERENCES review_cases(id) ON DELETE CASCADE,
  direction  TEXT NOT NULL CHECK (direction IN (
    'draft_public', 'draft_private', 'sent_public', 'sent_private'
  )),
  content    TEXT NOT NULL,
  language   TEXT DEFAULT 'en',
  sent_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_case_id ON review_case_messages (case_id);

-- ───── review_daily_summaries ─────
CREATE TABLE IF NOT EXISTS review_daily_summaries (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform    TEXT NOT NULL,
  date        DATE NOT NULL,
  stats       JSONB NOT NULL DEFAULT '{}'::jsonb,
  report_text TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (platform, date)
);

CREATE INDEX IF NOT EXISTS idx_daily_summaries_date ON review_daily_summaries (date DESC);

-- ───── RLS ─────
ALTER TABLE review_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_case_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_case_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_daily_summaries ENABLE ROW LEVEL SECURITY;

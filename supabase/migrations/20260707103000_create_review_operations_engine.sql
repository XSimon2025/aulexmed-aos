create extension if not exists pgcrypto;

create table if not exists public.review_cases (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in ('tiktok', 'temu', 'amazon')),
  shop_region text,
  source_key text not null,
  external_review_id text,
  star_rating integer not null check (star_rating between 1 and 5),
  review_content text,
  review_language text,
  review_date timestamptz,
  username text,
  product_name text,
  product_id text,
  order_id text,
  sku text,
  size_model text,
  has_public_reply boolean not null default false,
  public_reply_content text,
  can_open_review_detail boolean not null default false,
  can_open_order_detail boolean not null default false,
  needs_private_message boolean not null default false,
  source_url text,
  raw_payload jsonb not null default '{}'::jsonb,
  language text,
  sentiment text check (sentiment in ('positive', 'neutral', 'negative', 'mixed')),
  product_model text,
  issue_type text,
  issue_reason text,
  is_negative_review boolean not null default false,
  needs_public_reply boolean not null default false,
  needs_after_sales_case boolean not null default false,
  needs_feishu_alert boolean not null default false,
  should_add_to_knowledge_base boolean not null default false,
  priority text not null default 'low' check (priority in ('low', 'medium', 'high', 'urgent')),
  summary_cn text,
  suggested_solution text,
  public_reply_draft text,
  private_message_draft text,
  compliance_notes jsonb not null default '[]'::jsonb,
  ai_source text,
  status text not null default 'new' check (
    status in (
      'new',
      'analyzed',
      'needs_human_review',
      'ready_to_reply',
      'public_replied',
      'dm_drafted',
      'follow_up',
      'resolved',
      'ignored'
    )
  ),
  assigned_to text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, source_key)
);

create table if not exists public.review_case_actions (
  id uuid primary key default gen_random_uuid(),
  review_case_id uuid references public.review_cases(id) on delete cascade,
  action_type text not null,
  actor text not null default 'aos-roe',
  action_payload jsonb not null default '{}'::jsonb,
  dry_run boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.review_case_messages (
  id uuid primary key default gen_random_uuid(),
  review_case_id uuid references public.review_cases(id) on delete cascade,
  message_type text not null check (
    message_type in ('public_reply_draft', 'private_message_draft', 'internal_note')
  ),
  language text,
  body text not null default '',
  status text not null default 'draft' check (status in ('draft', 'approved', 'sent', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.review_daily_summaries (
  id uuid primary key default gen_random_uuid(),
  summary_date date not null,
  platform text not null check (platform in ('tiktok', 'temu', 'amazon')),
  shop_region text not null default '',
  total_reviews integer not null default 0,
  five_star_reply_count integer not null default 0,
  four_star_reply_count integer not null default 0,
  low_star_case_count integer not null default 0,
  public_reply_draft_count integer not null default 0,
  private_message_draft_count integer not null default 0,
  pending_follow_up_count integer not null default 0,
  top_issues jsonb not null default '[]'::jsonb,
  content_team_suggestions jsonb not null default '[]'::jsonb,
  product_knowledge_suggestions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (summary_date, platform, shop_region)
);

create index if not exists review_cases_platform_idx on public.review_cases(platform);
create index if not exists review_cases_order_id_idx on public.review_cases(order_id);
create index if not exists review_cases_product_id_idx on public.review_cases(product_id);
create index if not exists review_cases_star_rating_idx on public.review_cases(star_rating);
create index if not exists review_cases_status_idx on public.review_cases(status);
create index if not exists review_cases_priority_idx on public.review_cases(priority);
create index if not exists review_cases_issue_type_idx on public.review_cases(issue_type);
create index if not exists review_cases_created_at_idx on public.review_cases(created_at desc);
create index if not exists review_case_actions_case_idx on public.review_case_actions(review_case_id);
create index if not exists review_case_actions_created_at_idx on public.review_case_actions(created_at desc);
create index if not exists review_case_messages_case_idx on public.review_case_messages(review_case_id);
create index if not exists review_daily_summaries_date_idx on public.review_daily_summaries(summary_date desc);

create or replace function public.set_review_cases_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_review_cases_updated_at on public.review_cases;
create trigger set_review_cases_updated_at
before update on public.review_cases
for each row
execute function public.set_review_cases_updated_at();

alter table public.review_cases enable row level security;
alter table public.review_case_actions enable row level security;
alter table public.review_case_messages enable row level security;
alter table public.review_daily_summaries enable row level security;

grant select, insert, update, delete on table public.review_cases to service_role;
grant select, insert, update, delete on table public.review_case_actions to service_role;
grant select, insert, update, delete on table public.review_case_messages to service_role;
grant select, insert, update, delete on table public.review_daily_summaries to service_role;

comment on table public.review_cases is 'AOS-ROE review operations cases from TikTok first, future Temu and Amazon.';
comment on table public.review_case_actions is 'AOS-ROE audit log for collection, analysis, drafts, notifications, and future send actions.';
comment on table public.review_case_messages is 'AOS-ROE public reply and private message drafts. Stage 1 never auto-sends.';
comment on table public.review_daily_summaries is 'AOS-ROE daily review operations summary by platform and shop region.';

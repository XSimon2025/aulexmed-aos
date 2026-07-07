create extension if not exists pgcrypto;

create table if not exists public.support_email_cases (
  id uuid primary key default gen_random_uuid(),
  source_email text not null,
  from_email text not null,
  from_name text,
  subject text not null default '',
  raw_body text not null default '',
  clean_body text not null default '',
  attachments jsonb not null default '[]'::jsonb,
  language text,
  detected_country text,
  platform text,
  product_model text,
  product_category text,
  issue_type text,
  summary text,
  summary_en text,
  urgency text not null default 'medium' check (urgency in ('low', 'medium', 'high')),
  ai_recommendation text,
  ai_reply_draft text,
  status text not null default 'new' check (status in ('new', 'pending', 'replied', 'resolved', 'ignored')),
  assigned_to text,
  received_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.support_email_messages (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.support_email_cases(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound', 'internal')),
  from_email text,
  to_email text,
  subject text,
  body text not null default '',
  sent_by text,
  resend_message_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.support_email_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.support_email_cases(id) on delete cascade,
  event_type text not null,
  event_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists support_email_cases_status_idx on public.support_email_cases(status);
create index if not exists support_email_cases_urgency_idx on public.support_email_cases(urgency);
create index if not exists support_email_cases_platform_idx on public.support_email_cases(platform);
create index if not exists support_email_cases_product_model_idx on public.support_email_cases(product_model);
create index if not exists support_email_cases_source_email_idx on public.support_email_cases(source_email);
create index if not exists support_email_cases_created_at_idx on public.support_email_cases(created_at desc);
create index if not exists support_email_cases_received_at_idx on public.support_email_cases(received_at desc);
create index if not exists support_email_messages_case_id_idx on public.support_email_messages(case_id);
create index if not exists support_email_messages_created_at_idx on public.support_email_messages(created_at desc);
create index if not exists support_email_events_case_id_idx on public.support_email_events(case_id);
create index if not exists support_email_events_created_at_idx on public.support_email_events(created_at desc);

create or replace function public.set_support_email_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_support_email_cases_updated_at on public.support_email_cases;
create trigger set_support_email_cases_updated_at
before update on public.support_email_cases
for each row
execute function public.set_support_email_updated_at();

alter table public.support_email_cases enable row level security;
alter table public.support_email_messages enable row level security;
alter table public.support_email_events enable row level security;

comment on table public.support_email_cases is 'AULEXMED internal email support cases ingested from website, mailbox, or automation channels.';
comment on table public.support_email_messages is 'Thread messages for AULEXMED internal support email cases.';
comment on table public.support_email_events is 'Audit events for AULEXMED internal support email cases.';

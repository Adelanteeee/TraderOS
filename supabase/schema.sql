-- Trader OS — Supabase schema (database only, no auth)
-- Run this in the Supabase SQL editor (Project → SQL Editor → New query)

create extension if not exists "pgcrypto";

-- Journal entries (one row per logged trade)
create table if not exists journal_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  screenshot_url text,
  reason text not null default '',
  emotion text not null default '',
  mistake text not null default '',
  lesson text not null default '',
  score int not null default 0 check (score between 0 and 100)
);

-- Execution checklist items (the 10-step pre-trade checklist)
create table if not exists checklist_items (
  id text primary key,
  label text not null,
  sort_order int not null default 0,
  done boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Knowledge base entries (Volume / POC / VAH / VAL / HVN / LVN / ...)
create table if not exists knowledge_entries (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null default '',
  updated_at timestamptz not null default now()
);

-- Rolling statistics snapshot (one flexible row, updated in place)
create table if not exists statistics_snapshot (
  id int primary key default 1,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint single_row check (id = 1)
);

insert into statistics_snapshot (id, data)
values (1, '{}'::jsonb)
on conflict (id) do nothing;

<<<<<<< HEAD
-- Sprint 2 — Mind: one check-in per trading session/day
create table if not exists mind_checkins (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  mood int not null check (mood between 1 and 5),
  sleep_quality int not null check (sleep_quality between 1 and 5),
  focus int not null check (focus between 1 and 5),
  stress int not null check (stress between 1 and 5),
  confidence int not null check (confidence between 1 and 5),
  ready_to_trade boolean not null default true,
  note text not null default ''
);

-- Sprint 2 — Mind: free-form psychology notes / exercises log
create table if not exists mind_notes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  title text not null,
  content text not null default ''
);

-- Sprint 2 — Analysis: top-down analysis entries, linked to the Market taxonomy
create table if not exists analysis_entries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  instrument text not null,
  timeframe text not null,
  market_cycle_stage text not null,
  trend text not null,
  bias text not null default 'neutral',
  notes text not null default ''
);

=======
>>>>>>> ec022f78c02aacb19aeb3d08cec633ca7a759ea8
-- Row Level Security
-- No login/auth in this app (single trader, personal use), so tables are
-- readable/writable by anyone holding the Supabase anon key. That key ships
-- inside the client bundle by design in every Supabase app — this is normal,
-- but it means these tables are effectively public. Don't put anything
-- sensitive here, and add real auth + per-user policies later if this ever
-- becomes multi-user or public-facing.

alter table journal_entries enable row level security;
alter table checklist_items enable row level security;
alter table knowledge_entries enable row level security;
alter table statistics_snapshot enable row level security;
<<<<<<< HEAD
alter table mind_checkins enable row level security;
alter table mind_notes enable row level security;
alter table analysis_entries enable row level security;
=======
>>>>>>> ec022f78c02aacb19aeb3d08cec633ca7a759ea8

create policy "public read/write journal_entries" on journal_entries
  for all using (true) with check (true);

create policy "public read/write checklist_items" on checklist_items
  for all using (true) with check (true);

create policy "public read/write knowledge_entries" on knowledge_entries
  for all using (true) with check (true);

create policy "public read/write statistics_snapshot" on statistics_snapshot
  for all using (true) with check (true);
<<<<<<< HEAD

create policy "public read/write mind_checkins" on mind_checkins
  for all using (true) with check (true);

create policy "public read/write mind_notes" on mind_notes
  for all using (true) with check (true);

create policy "public read/write analysis_entries" on analysis_entries
  for all using (true) with check (true);
=======
>>>>>>> ec022f78c02aacb19aeb3d08cec633ca7a759ea8

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

create policy "public read/write journal_entries" on journal_entries
  for all using (true) with check (true);

create policy "public read/write checklist_items" on checklist_items
  for all using (true) with check (true);

create policy "public read/write knowledge_entries" on knowledge_entries
  for all using (true) with check (true);

create policy "public read/write statistics_snapshot" on statistics_snapshot
  for all using (true) with check (true);

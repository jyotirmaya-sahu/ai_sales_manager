-- AI Sales Manager - Database Schema
-- Run this in Supabase SQL Editor

-- 1. Calls Table
create table public.calls (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  title text default 'Untitled Call',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Call Notes Table
create table public.call_notes (
  id uuid default gen_random_uuid() primary key,
  call_id uuid references public.calls(id) on delete cascade not null,
  raw_text text,
  ai_output jsonb, -- Stores: { summary, key_insights, objections, next_steps }
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Row Level Security (RLS)
alter table public.calls enable row level security;
alter table public.call_notes enable row level security;

-- Policies for 'calls'
create policy "Users can view their own calls" on public.calls
  for select using (auth.uid() = user_id);

create policy "Users can insert their own calls" on public.calls
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own calls" on public.calls
  for update using (auth.uid() = user_id);

create policy "Users can delete their own calls" on public.calls
  for delete using (auth.uid() = user_id);

-- Policies for 'call_notes'
create policy "Users can view their own notes" on public.call_notes
  for select using (exists (select 1 from public.calls where id = call_notes.call_id and user_id = auth.uid()));

create policy "Users can insert their own notes" on public.call_notes
  for insert with check (exists (select 1 from public.calls where id = call_notes.call_id and user_id = auth.uid()));

create policy "Users can update their own notes" on public.call_notes
  for update using (exists (select 1 from public.calls where id = call_notes.call_id and user_id = auth.uid()));

-- 4. Indexes (Optional but good for performance)
create index idx_calls_user_id on public.calls(user_id);
create index idx_call_notes_call_id on public.call_notes(call_id);

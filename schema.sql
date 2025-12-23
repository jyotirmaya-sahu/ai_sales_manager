-- AI Sales Manager - Migration Script
-- Run these commands in Supabase SQL Editor to update your database.

-- 1. Create the new Representatives table
create table if not exists public.representatives (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Update Calls table to link to Representatives
-- This adds the new column 'representative_id' to your existing 'calls' table
alter table public.calls 
add column if not exists representative_id uuid references public.representatives(id);

-- 3. Enable Security for Representatives
alter table public.representatives enable row level security;

-- 4. Add Permissions (Policies)
create policy "Users can view their own reps" on public.representatives
  for select using (auth.uid() = user_id);

create policy "Users can insert their own reps" on public.representatives
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own reps" on public.representatives
  for update using (auth.uid() = user_id);

create policy "Users can delete their own reps" on public.representatives
  for delete using (auth.uid() = user_id);

-- 5. Add Performance Indexes
create index if not exists idx_calls_rep_id on public.calls(representative_id);
create index if not exists idx_representatives_user_id on public.representatives(user_id);

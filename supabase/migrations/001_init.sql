-- =============================================
-- VetAcuPoints — Initial Schema
-- Run this in Supabase Dashboard → SQL Editor
-- =============================================

-- Acupoints (public read, admin write via dashboard)
create table if not exists acupoints (
  id text primary key,
  name text not null,
  alias text,
  grouping text,
  tcm_indication text,
  western_indication text,
  category text not null,
  location_canine text,
  location_feline text,
  location_equine text
);

alter table acupoints enable row level security;
create policy "Public read acupoints" on acupoints
  for select using (true);

-- Profiles (auto-created on signup via trigger)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users read own profile" on profiles
  for select using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Favourites
create table if not exists favourites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  acupoint_id text references acupoints(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, acupoint_id)
);

alter table favourites enable row level security;
create policy "Users manage own favourites" on favourites
  for all using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

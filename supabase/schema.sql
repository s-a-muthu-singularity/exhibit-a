-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Users table (extends Supabase Auth)
-- This table is automatically kept in sync with auth.users via triggers (optional but recommended)
-- For now, we'll just query auth.users directly or create a public profiles table.
-- Let's create a public 'profiles' table.

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(username) >= 3)
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( (select auth.uid()) = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( (select auth.uid()) = id );

-- Posts table
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  content jsonb, -- structured content (e.g. from a rich text editor)
  excerpt text,
  cover_image text,
  user_id uuid references public.profiles(id) on delete cascade not null,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Published posts are viewable by everyone."
  on public.posts for select
  using ( published = true );

create policy "Users can see their own unpublished posts."
  on public.posts for select
  using ( (select auth.uid()) = user_id );

create policy "Users can create posts."
  on public.posts for insert
  with check ( (select auth.uid()) = user_id );

create policy "Users can update their own posts."
  on public.posts for update
  using ( (select auth.uid()) = user_id );

create policy "Users can delete their own posts."
  on public.posts for delete
  using ( (select auth.uid()) = user_id );

-- Storage buckets setup (conceptual - needs to be run in storage section or via SQL)
-- insert into storage.buckets (id, name) values ('covers', 'covers');
-- insert into storage.buckets (id, name) values ('avatars', 'avatars');

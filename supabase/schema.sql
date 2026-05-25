-- Grand Depok Residence admin management schema
-- Run this in Supabase SQL Editor.
-- Frontend needs the Project URL and anon public key.
-- Admin writes should use Supabase Auth; do not expose the service_role key.

create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id text primary key default 'default',
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  title text not null,
  description text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  category text not null check (category in ('Pengumuman', 'Kegiatan', 'DKM', 'Berita')),
  author text not null,
  image_url text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.is_gdr_admin()
returns boolean
language sql
stable
as $$
  select lower(coalesce(auth.jwt() ->> 'email', '')) = 'pixelcase@gmail.com';
$$;

insert into public.site_settings (id, data)
values ('default', '{}'::jsonb)
on conflict (id) do nothing;

alter table public.site_settings enable row level security;
alter table public.activities enable row level security;
alter table public.news_posts enable row level security;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings for select
using (true);

drop policy if exists "Admins can manage site settings" on public.site_settings;
create policy "Admins can manage site settings"
on public.site_settings for all
using (public.is_gdr_admin())
with check (public.is_gdr_admin());

drop policy if exists "Public can read activities" on public.activities;
create policy "Public can read activities"
on public.activities for select
using (true);

drop policy if exists "Admins can manage activities" on public.activities;
create policy "Admins can manage activities"
on public.activities for all
using (public.is_gdr_admin())
with check (public.is_gdr_admin());

drop policy if exists "Public can read approved posts" on public.news_posts;
create policy "Public can read approved posts"
on public.news_posts for select
using (status = 'approved');

drop policy if exists "Public can submit pending posts" on public.news_posts;
create policy "Public can submit pending posts"
on public.news_posts for insert
with check (status = 'pending');

drop policy if exists "Admins can read all posts" on public.news_posts;
create policy "Admins can read all posts"
on public.news_posts for select
using (public.is_gdr_admin());

drop policy if exists "Admins can manage posts" on public.news_posts;
create policy "Admins can manage posts"
on public.news_posts for update
using (public.is_gdr_admin())
with check (public.is_gdr_admin());

drop policy if exists "Admins can delete posts" on public.news_posts;
create policy "Admins can delete posts"
on public.news_posts for delete
using (public.is_gdr_admin());

insert into storage.buckets (id, name, public)
values ('gdr-media', 'gdr-media', true)
on conflict (id) do nothing;

drop policy if exists "Public can view media" on storage.objects;
create policy "Public can view media"
on storage.objects for select
using (bucket_id = 'gdr-media');

drop policy if exists "Public can upload warga media" on storage.objects;
create policy "Public can upload warga media"
on storage.objects for insert
with check (bucket_id = 'gdr-media' and (storage.foldername(name))[1] = 'posts');

drop policy if exists "Admins can manage media" on storage.objects;
create policy "Admins can manage media"
on storage.objects for all
using (bucket_id = 'gdr-media' and public.is_gdr_admin())
with check (bucket_id = 'gdr-media' and public.is_gdr_admin());

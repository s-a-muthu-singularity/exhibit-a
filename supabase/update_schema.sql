-- Add is_premium column to posts table
alter table public.posts add column is_premium boolean default false;

-- Storage setup for article-images
-- (This SQL assumes you can run it in Supabase Dashboard)
insert into storage.buckets (id, name, public) values ('article-images', 'article-images', true)
on conflict (id) do nothing;

create policy "Images are publicly accessible."
  on storage.objects for select
  using ( bucket_id = 'article-images' );

create policy "Users can upload images."
  on storage.objects for insert
  with check ( bucket_id = 'article-images' AND auth.role() = 'authenticated' );

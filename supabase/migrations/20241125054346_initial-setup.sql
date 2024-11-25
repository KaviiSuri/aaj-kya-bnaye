-- Create schedules table
create table if not exists public.schedules (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  date date not null unique,
  schedule jsonb not null,
  user_id uuid references auth.users(id)
);

-- Enable RLS
alter table public.schedules enable row level security;

-- Create policy for anonymous access (for now)
create policy "Anonymous access"
  on public.schedules for all
  using (true)
  with check (true);

-- Create indexes
create index if not exists schedules_date_idx on public.schedules(date);
create index if not exists schedules_user_id_idx on public.schedules(user_id);
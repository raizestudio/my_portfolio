-- 1. Create Messages Table for iMessage App
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  channel_id text not null,
  user_id text not null,
  nickname text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Fidelity Cards Table for Loyalty Manager
create table if not exists public.fidelity_cards (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  card_code text not null,
  target_visits integer not null default 10,
  current_visits integer not null default 0,
  reward_title text not null default 'Free Coffee & Pastry',
  color_gradient text not null default 'latte',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 1. Création de la table
create table if not exists public.runner_leaderboard (
  id uuid primary key default gen_random_uuid(),
  player_name text not null,
  score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Enable Row Level Security (RLS)
alter table public.messages enable row level security;
alter table public.fidelity_cards enable row level security;
alter table public.runner_leaderboard enable row level security;

-- 4. Create Access Policies
create policy "Allow Public Messages Access" on public.messages for all using (true);
create policy "Allow Public Fidelity Access" on public.fidelity_cards for all using (true);
create policy "Allow Public Leaderboard Access" on public.runner_leaderboard for all using (true);

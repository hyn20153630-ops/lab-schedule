-- 실험실 주간 일정 관리 - Supabase 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  status text not null default 'active' check (status in ('active', 'paused', 'ended')),
  created_at timestamptz not null default now(),
  ended_at timestamptz
);

-- tasks.week_key 는 별도 weeks 테이블 없이 '2026-W28' 형식의 문자열을 직접 저장한다.
-- (주차 메타데이터가 따로 필요 없어 조인 없이 조회할 수 있도록 단순화)
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  week_key text not null,
  day text not null check (day in ('mon', 'tue', 'wed', 'thu', 'fri', 'any')),
  content text not null,
  is_done boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists tasks_user_week_idx on public.tasks (user_id, week_key);
create index if not exists tasks_project_idx on public.tasks (project_id);
create index if not exists projects_user_idx on public.projects (user_id);

alter table public.projects enable row level security;
alter table public.tasks enable row level security;

create policy "projects: owner full access"
  on public.projects for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "tasks: owner full access"
  on public.tasks for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

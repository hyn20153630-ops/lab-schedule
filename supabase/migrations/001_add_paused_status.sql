-- 기존에 schema.sql을 이미 실행한 프로젝트에 'paused' 상태를 추가하려면
-- 이 파일을 SQL Editor에서 실행하세요.

alter table public.projects drop constraint if exists projects_status_check;
alter table public.projects
  add constraint projects_status_check check (status in ('active', 'paused', 'ended'));

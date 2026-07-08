-- '상시(요일 무관)' 항목을 저장할 수 있도록 tasks.day 체크 제약에 'any'를 추가한다.
-- SQL Editor에서 이 파일 내용만 실행하세요.

alter table public.tasks drop constraint if exists tasks_day_check;
alter table public.tasks
  add constraint tasks_day_check check (day in ('mon', 'tue', 'wed', 'thu', 'fri', 'any'));

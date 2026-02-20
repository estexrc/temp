-- ==========================================
-- SCRIPT DE INICIALIZACIÓN TEMPAR (ROBUSTO)
-- ==========================================

-- 1. Tablas (con IF NOT EXISTS para evitar colisiones)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text check (role in ('empleado', 'empleador')),
  skills text[],
  hourly_rate numeric,
  bio text,
  company text,
  sector text,
  rating numeric default 5.0,
  created_at timestamptz default now()
);

create table if not exists public.jobs (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  employer_name text not null,
  title text not null,
  description text,
  payment_type text check (payment_type in ('hourly', 'total')),
  amount numeric not null,
  location text,
  tags text[],
  urgent boolean default false,
  status text default 'open',
  created_at timestamptz default now()
);

-- 2. Habilitar RLS
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;

-- 3. Limpiar políticas previas para evitar errores de "already exists"
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Jobs are viewable by everyone" on public.jobs;
drop policy if exists "Employers can insert own jobs" on public.jobs;
drop policy if exists "Employers can update own jobs" on public.jobs;

-- 4. Recrear Políticas RLS
-- Perfiles
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
-- Nota: La inserción la hará el Trigger (paso 5), por lo que no hace falta política de insert para perfiles.

-- Jobs
create policy "Jobs are viewable by everyone" on public.jobs for select using (true);
create policy "Employers can insert own jobs" on public.jobs for insert with check (auth.uid() = employer_id);
create policy "Employers can update own jobs" on public.jobs for update using (auth.uid() = employer_id);

-- 5. AUTOMATIZACIÓN: Trigger para crear perfil al registrarse
-- Esta función se encarga de mover los datos de auth.users a public.profiles automáticamente.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, bio, skills, hourly_rate, company, sector)
  values (
    new.id, 
    new.raw_user_metadata->>'name', 
    new.raw_user_metadata->>'role',
    new.raw_user_metadata->>'bio',
    array(select jsonb_array_elements_text(new.raw_user_metadata->'skills'))::text[],
    (new.raw_user_metadata->>'hourly_rate')::numeric,
    new.raw_user_metadata->>'company',
    new.raw_user_metadata->>'sector'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Activar el trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

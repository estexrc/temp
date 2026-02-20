-- ==========================================
-- SCRIPT DE LIMPIEZA Y REINICIO TOTAL (BORRA TODO)
-- ==========================================
-- ¡USAR CON PRECAUCIÓN! Esto borrará todos los datos de perfiles y trabajos.

-- 1. Borrar todo lo anterior
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();
drop table if exists public.jobs;
drop table if exists public.profiles;

-- 2. Crear Tabla de Perfiles
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text not null,
  role text check (role in ('empleado', 'empleador')),
  skills text[] default '{}',
  hourly_rate numeric,
  bio text,
  company text,
  sector text,
  rating numeric default 5.0,
  created_at timestamptz default now()
);

-- 3. Crear Tabla de Trabajos
create table public.jobs (
  id uuid default gen_random_uuid() primary key,
  employer_id uuid references public.profiles(id) on delete cascade not null,
  employer_name text not null,
  title text not null,
  description text,
  payment_type text check (payment_type in ('hourly', 'total')),
  amount numeric not null,
  location text,
  tags text[] default '{}',
  urgent boolean default false,
  status text default 'open',
  created_at timestamptz default now()
);

-- 4. Habilitar Seguridad (RLS)
alter table public.profiles enable row level security;
alter table public.jobs enable row level security;

-- 5. Políticas RLS
-- Perfiles
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Jobs
create policy "Jobs are viewable by everyone" on public.jobs for select using (true);
create policy "Employers can insert own jobs" on public.jobs for insert with check (auth.uid() = employer_id);
create policy "Employers can update own jobs" on public.jobs for update using (auth.uid() = employer_id);

-- 6. TRIGGER: Creación automática de perfil (LA SOLUCIÓN CLAVE)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, role, bio, skills, hourly_rate, company, sector)
  values (
    new.id, 
    coalesce(new.raw_user_metadata->>'name', 'Usuario sin nombre'), 
    coalesce(new.raw_user_metadata->>'role', 'empleado'),
    new.raw_user_metadata->>'bio',
    coalesce(array(select jsonb_array_elements_text(new.raw_user_metadata->'skills'))::text[], '{}'),
    (new.raw_user_metadata->>'hourly_rate')::numeric,
    new.raw_user_metadata->>'company',
    new.raw_user_metadata->>'sector'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

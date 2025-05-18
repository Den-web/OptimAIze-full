# Структура базы данных

## Основные сущности

### Пользователи (`users`)
- `id` (uuid, PK, внешний ключ на auth.users)
- `email` (text, уникальный)
- `full_name` (text)
- `avatar_url` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Организации (`organizations`)
- `id` (uuid, PK)
- `name` (text, not null)
- `slug` (text, уникальный)
- `plan_id` (text, FK на subscription_plans)
- `owner_id` (uuid, FK на users)
- `created_at` (timestamptz)

### Проекты (`projects`)
- `id` (uuid, PK)
- `name` (text, not null)
- `organization_id` (uuid, FK на organizations)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Подписки (`subscription_plans`)
- `id` (text, PK)
- `name` (text, not null)
- `price` (numeric, not null)
- `features` (jsonb)

### Члены организации (`organization_members`)
- `id` (uuid, PK)
- `organization_id` (uuid, FK на organizations)
- `user_id` (uuid, FK на users)
- `role` (text, например: owner, admin, member)
- `joined_at` (timestamptz)

### Логи действий (`audit_logs`)
- `id` (uuid, PK)
- `user_id` (uuid, FK на users)
- `organization_id` (uuid, FK на organizations)
- `action` (text)
- `details` (jsonb)
- `created_at` (timestamptz)

## RLS (Row Level Security)
- Включена для всех таблиц с пользовательскими данными
- Примеры политик:
  - Пользователь видит только свои данные
  - Член организации видит только свои организации и проекты
  - Только owner/admin может изменять организацию

## Пример схемы (SQL)
```sql
create table public.users (
  id uuid references auth.users primary key,
  email text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  plan_id text references public.subscription_plans(id),
  owner_id uuid references public.users(id),
  created_at timestamptz default now()
);

create table public.projects (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  organization_id uuid references public.organizations(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.subscription_plans (
  id text primary key,
  name text not null,
  price numeric not null,
  features jsonb default '{}'::jsonb
);

create table public.organization_members (
  id uuid default gen_random_uuid() primary key,
  organization_id uuid references public.organizations(id),
  user_id uuid references public.users(id),
  role text not null,
  joined_at timestamptz default now()
);

create table public.audit_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id),
  organization_id uuid references public.organizations(id),
  action text not null,
  details jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Пример RLS политики
alter table public.users enable row level security;
create policy "Users can read own data"
  on public.users for select
  using (auth.uid() = id);

alter table public.organization_members enable row level security;
create policy "Org members can access org data"
  on public.organization_members for all
  using (auth.uid() = user_id);
```

## Примечания
- Все таблицы используют uuid как PK для масштабируемости
- RLS обеспечивает безопасность данных на уровне строк
- Для расширения: добавить таблицы для файлов, платежей, уведомлений, аналитики 

## Дополнительные сущности для проектов

### Роли (`roles`)
- `id` (uuid, PK)
- `project_id` (uuid, FK на projects)
- `name` (text, not null)
- `category` (text, например: technical, business, creative)
- `description` (text)
- `content` (text) — инструкции для роли
- `expertise` (jsonb) — массив областей экспертизы
- `is_default` (boolean)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Правила (`rules`)
- `id` (uuid, PK)
- `project_id` (uuid, FK на projects)
- `name` (text, not null)
- `description` (text)
- `content` (text) — формулировка правила
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Промпты (`prompts`)
- `id` (uuid, PK)
- `project_id` (uuid, FK на projects)
- `title` (text, not null)
- `description` (text)
- `content` (text)
- `is_public` (boolean, default false) — публичный ли промпт
- `public_id` (text, уникальный, nullable) — публичный идентификатор для шаринга
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Чаты (`chats`)
- `id` (uuid, PK)
- `project_id` (uuid, FK на projects)
- `user_id` (uuid, FK на users)
- `title` (text)
- `created_at` (timestamptz)
- `updated_at` (timestamptz)

### Сообщения чата (`chat_messages`)
- `id` (uuid, PK)
- `chat_id` (uuid, FK на chats)
- `role` (text, 'user' | 'assistant')
- `content` (text)
- `created_at` (timestamptz)

## Пример схемы (SQL) — расширение
```sql
-- ... существующие таблицы ...

create table public.roles (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id),
  name text not null,
  category text,
  description text,
  content text,
  expertise jsonb,
  is_default boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.rules (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id),
  name text not null,
  description text,
  content text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.prompts (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id),
  title text not null,
  description text,
  content text,
  is_public boolean default false,
  public_id text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.chats (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id),
  user_id uuid references public.users(id),
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.chat_messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references public.chats(id),
  role text not null,
  content text,
  created_at timestamptz default now()
);
```

## Связи и пояснения
- Проект — центральная сущность, к которой привязаны роли, правила, промпты, чаты.
- Чат принадлежит проекту и пользователю.
- Сообщения чата принадлежат чату.
- Роли, правила, промпты — могут быть как дефолтными (is_default), так и кастомными для проекта.

## RLS (Row Level Security)
- Доступ к проекту и связанным сущностям только для участников организации/проекта.
- Чаты и сообщения доступны только их владельцу и участникам проекта.

## Шаринг промптов по ссылке
- Если `is_public = true` и `public_id` не null — промпт доступен по ссылке `/prompts/share/{public_id}`.
- При создании публичного промпта генерируется уникальный `public_id` (uuid или hash).
- Приватные промпты доступны только участникам проекта.

### RLS для публичных промптов
```sql
-- Разрешить читать публичные промпты всем
create policy "Public prompts are readable"
  on public.prompts for select
  using (is_public = true);
``` 
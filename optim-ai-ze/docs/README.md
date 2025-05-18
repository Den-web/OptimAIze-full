# Краткое описание проекта для backend-команды

**Проект** — SaaS-платформа для управления проектами, ролями, правилами, промптами и чатами, с поддержкой многоарендности, публичного шаринга промптов и строгой безопасности.

## Архитектура
- **Frontend:** Next.js (TypeScript, Tailwind, Zustand, React Query, shadcn/ui)
- **Backend:** Express.js (TypeScript), Supabase (PostgreSQL, Auth, Storage, RLS), Redis (кэш, очереди Bull)
- **CI/CD:** GitHub Actions, Docker, Vercel (frontend), Railway/Fly.io (backend)

## Ключевые сущности
- Пользователи, организации, проекты
- Роли, правила, промпты (в т.ч. публичные), чаты, сообщения чата
- Поддержка RBAC, RLS, аудита

## Особенности
- Многоарендная архитектура (multi-tenant, RLS)
- Публичный шаринг промптов по ссылке (`is_public`, `public_id`)
- REST API (версионирование, OpenAPI), валидация через Zod
- Кэширование и очереди через Redis/Bull
- Логирование (Winston), мониторинг (Sentry, Prometheus, Grafana)
- Тестирование: Jest, Cypress, React Testing Library

## Безопасность
- RLS на уровне БД (Supabase)
- Rate limiting, CORS, JWT, audit logging
- Политики доступа: приватные данные — только участникам, публичные промпты — всем по ссылке

## Для старта
- Ознакомьтесь с [DATABASE_STRUCTURE.md](./DATABASE_STRUCTURE.md) (структура и RLS)
- Смотрите [SAAS_EXPRESS_ARCHITECTURE.md](./SAAS_EXPRESS_ARCHITECTURE.md) и [BACKEND_ARCHITECTURE.md](./BACKEND_ARCHITECTURE.md) для деталей API и инфраструктуры
- Организации нужны для развертывания собственного LLM локально на серверах для личного использования в пределах организаций

---

## Быстрые ссылки на документацию
- [Структура базы данных](./DATABASE_STRUCTURE.md)
- [Архитектура backend](./BACKEND_ARCHITECTURE.md)
- [Архитектура SaaS/Express](./SAAS_EXPRESS_ARCHITECTURE.md)
- [Технический стек](./TECH_STACK.md)
- [Структура проекта](./PROJECT_STRUCTURE.md)
- [Дорожная карта MVP](./MVP_ROADMAP.md)
- [Дорожная карта реализации](./IMPLEMENTATION_ROADMAP.md)
- [Трекер разработки](./DEVELOPMENT_TRACKER.md)
- [Frontend статус](./FRONTEND_STATUS.md)
- [Расширенная архитектура](./ADVANCED_ARCHITECTURE.md)
.PHONY: install lint lint-fix format build develop vercel-build

# Установка зависимостей
install:
    npm ci

# Запуск линтера
lint:
    npm run lint

# Исправление ошибок линтера
lint-fix:
    npm run lint-fix

# Форматирование кода с помощью Prettier
format:
    npm run format

# Сборка проекта
build:
    npm run build

# Локальная разработка
develop:
    npm run develop

# Сборка для Vercel
vercel-build:
    npm run vercel-build

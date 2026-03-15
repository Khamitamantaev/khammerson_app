-- Удаляем все таблицы если они существуют
DROP TABLE IF EXISTS user_node_ratings CASCADE;
DROP TABLE IF EXISTS user_node_usage CASCADE;
DROP TABLE IF EXISTS global_node_updates CASCADE;
DROP TABLE IF EXISTS edges CASCADE;
DROP TABLE IF EXISTS nodes CASCADE;
DROP TABLE IF EXISTS node_data CASCADE;
DROP TABLE IF EXISTS canvases CASCADE;
DROP TABLE IF EXISTS downloads CASCADE;
DROP TABLE IF EXISTS stars CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS "users" CASCADE;

-- Включить расширение для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== ОСНОВНЫЕ ТАБЛИЦЫ ====================

-- 1. users
CREATE TABLE IF NOT EXISTS "users" (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('user_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255),
    first_name VARCHAR(255), -- Добавлено поле для имени
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    role VARCHAR(50) DEFAULT 'USER'
);

-- 2. projects
CREATE TABLE IF NOT EXISTS projects (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('project_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id VARCHAR(100) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    stars INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_projects_owner FOREIGN KEY (owner_id) REFERENCES "users"(id) ON DELETE CASCADE
);

-- 3. stars
CREATE TABLE IF NOT EXISTS stars (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('star_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    project_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(project_id, user_id),
    CONSTRAINT fk_stars_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_stars_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE
);

-- 4. downloads
CREATE TABLE IF NOT EXISTS downloads (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('download_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    project_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100) NOT NULL,
    canvas_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_downloads_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_downloads_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE
);

-- 5. canvases
CREATE TABLE IF NOT EXISTS canvases (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('canvas_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    project_id VARCHAR(100) NOT NULL,
    owner_id VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_canvases_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_canvases_owner FOREIGN KEY (owner_id) REFERENCES "users"(id) ON DELETE CASCADE
);

-- 6. node_data
CREATE TABLE IF NOT EXISTS node_data (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('ndata_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    label VARCHAR(500) NOT NULL,  
    code TEXT NOT NULL,           
    description TEXT NOT NULL,    
    node_id VARCHAR(100),
    file_path TEXT,
    image TEXT,
    custom_page JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. nodes
CREATE TABLE IF NOT EXISTS nodes (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('node_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    position_x DECIMAL NOT NULL DEFAULT 0,
    position_y DECIMAL NOT NULL DEFAULT 0,
    type VARCHAR(100),
    canvas_id VARCHAR(100) NOT NULL,
    parent_id VARCHAR(100),
    children TEXT[] DEFAULT '{}',
    node_type VARCHAR(50) DEFAULT 'LOCAL',
    rating DECIMAL DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    author_id VARCHAR(100),
    original_global_node_id VARCHAR(100),
    data_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_nodes_canvas FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE,
    CONSTRAINT fk_nodes_parent FOREIGN KEY (parent_id) REFERENCES nodes(id) ON DELETE SET NULL,
    CONSTRAINT fk_nodes_author FOREIGN KEY (author_id) REFERENCES "users"(id) ON DELETE SET NULL,
    CONSTRAINT fk_nodes_data FOREIGN KEY (data_id) REFERENCES node_data(id) ON DELETE SET NULL
);

-- 8. edges
CREATE TABLE IF NOT EXISTS edges (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('edge_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    source_id VARCHAR(100) NOT NULL,
    target_id VARCHAR(100) NOT NULL,
    type VARCHAR(100),
    canvas_id VARCHAR(100) NOT NULL,
    animated BOOLEAN DEFAULT true,
    style VARCHAR(50) DEFAULT '#3b82f6',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_edges_source FOREIGN KEY (source_id) REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_edges_target FOREIGN KEY (target_id) REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_edges_canvas FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE
);

-- 9. user_node_usage
CREATE TABLE IF NOT EXISTS user_node_usage (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('usage_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    user_id VARCHAR(100) NOT NULL,
    node_id VARCHAR(100) NOT NULL,
    canvas_id VARCHAR(100) NOT NULL,
    used_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, node_id, canvas_id),
    CONSTRAINT fk_usage_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE,
    CONSTRAINT fk_usage_node FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_usage_canvas FOREIGN KEY (canvas_id) REFERENCES canvases(id) ON DELETE CASCADE
);

-- 10. user_node_ratings
CREATE TABLE IF NOT EXISTS user_node_ratings (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('rating_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    user_id VARCHAR(100) NOT NULL,
    node_id VARCHAR(100) NOT NULL,
    rating DECIMAL(3,2) NOT NULL CHECK (rating >= 0.5 AND rating <= 5),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, node_id),
    CONSTRAINT fk_ratings_user FOREIGN KEY (user_id) REFERENCES "users"(id) ON DELETE CASCADE,
    CONSTRAINT fk_ratings_node FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE
);

-- 11. global_node_updates
CREATE TABLE IF NOT EXISTS global_node_updates (
    id VARCHAR(100) PRIMARY KEY DEFAULT ('update_' || replace(uuid_generate_v4()::TEXT, '-', '_')),
    node_id VARCHAR(100) NOT NULL,
    updated_by VARCHAR(100) NOT NULL,
    update_data JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_updates_node FOREIGN KEY (node_id) REFERENCES nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_updates_user FOREIGN KEY (updated_by) REFERENCES "users"(id) ON DELETE CASCADE
);

-- ==================== ИНДЕКСЫ ====================

CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);
CREATE INDEX IF NOT EXISTS idx_projects_tags ON projects USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_stars_project_id ON stars(project_id);
CREATE INDEX IF NOT EXISTS idx_stars_user_id ON stars(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_project_id ON downloads(project_id);
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_canvases_project_id ON canvases(project_id);
CREATE INDEX IF NOT EXISTS idx_canvases_owner_id ON canvases(owner_id);
CREATE INDEX IF NOT EXISTS idx_nodes_canvas_id ON nodes(canvas_id);
CREATE INDEX IF NOT EXISTS idx_nodes_parent_id ON nodes(parent_id);
CREATE INDEX IF NOT EXISTS idx_nodes_data_id ON nodes(data_id);
CREATE INDEX IF NOT EXISTS idx_nodes_author_id ON nodes(author_id);
CREATE INDEX IF NOT EXISTS idx_edges_canvas_id ON edges(canvas_id);
CREATE INDEX IF NOT EXISTS idx_edges_source_id ON edges(source_id);
CREATE INDEX IF NOT EXISTS idx_edges_target_id ON edges(target_id);
CREATE INDEX IF NOT EXISTS idx_user_node_usage_user_id ON user_node_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_user_node_usage_node_id ON user_node_usage(node_id);
CREATE INDEX IF NOT EXISTS idx_user_node_usage_canvas_id ON user_node_usage(canvas_id);
CREATE INDEX IF NOT EXISTS idx_node_data_node_id ON node_data(node_id);
CREATE INDEX IF NOT EXISTS idx_user_node_ratings_user_id ON user_node_ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_user_node_ratings_node_id ON user_node_ratings(node_id);
CREATE INDEX IF NOT EXISTS idx_global_node_updates_node_id ON global_node_updates(node_id);
CREATE INDEX IF NOT EXISTS idx_global_node_updates_updated_by ON global_node_updates(updated_by);

-- ==================== ТЕСТОВЫЕ ДАННЫЕ ====================

-- 1. Пользователи (добавлены first_name)
INSERT INTO "users" (id, email, user_name, first_name, password, role, created_at, updated_at)
VALUES 
    ('user_khammerson', 'khamitamantaev@gmail.com', 'Khammerson', 'Хаммер', '$2b$10$ndZORCWCHgR08Ep9VP3AUu84pA4Hh9UdhyuKbvmmPDyaowqDwiu2W', 'ADMIN', NOW(), NOW()),
    ('user_azamat', 'azamat@gmail.com', 'Azamat', 'Азамат', '$2b$10$ndZORCWCHgR08Ep9VP3AUu84pA4Hh9UdhyuKbvmmPDyaowqDwiu2W', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- 2. Проекты
INSERT INTO projects (id, title, description, owner_id, is_public, tags, created_at, updated_at)
VALUES 
    ('project_khammerson_1', 'Маркетплейс API', 'Основной бэкенд маркетплейса', 'user_khammerson', false, ARRAY['api', 'backend'], NOW(), NOW()),
    ('project_khammerson_2', 'Блог на Next.js', 'Фронтенд для блога', 'user_khammerson', true, ARRAY['frontend', 'nextjs'], NOW(), NOW()),
    ('project_azamat_1', 'Telegram бот', 'Бот для уведомлений', 'user_azamat', true, ARRAY['bot', 'telegram'], NOW(), NOW()),
    ('project_global', 'Глобальная библиотека', 'Публичные проекты и компоненты', 'user_khammerson', true, ARRAY['global', 'templates'], NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. Канвасы
INSERT INTO canvases (id, title, description, project_id, owner_id, created_at, updated_at)
VALUES 
    ('canvas_marketplace_api', 'API Gateway', 'Основной шлюз', 'project_khammerson_1', 'user_khammerson', NOW(), NOW()),
    ('canvas_marketplace_db', 'База данных', 'Схема БД', 'project_khammerson_1', 'user_khammerson', NOW(), NOW()),
    ('canvas_blog_frontend', 'Компоненты', 'React компоненты', 'project_khammerson_2', 'user_khammerson', NOW(), NOW()),
    ('canvas_telegram_bot', 'Основной бот', 'Логика бота', 'project_azamat_1', 'user_azamat', NOW(), NOW()),
    ('canvas_global_library', 'Global Library', 'Общая библиотека глобальных нод', 'project_global', 'user_khammerson', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. Глобальные ноды
INSERT INTO node_data (id, label, code, description, created_at, updated_at)
VALUES 
    ('ndata_global_1', 'API Gateway Component', '// API Gateway code', 'Компонент для маршрутизации API запросов', NOW(), NOW()),
    ('ndata_global_2', 'Database Connector', '// Database connection code', 'Компонент для подключения к базе данных', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO nodes (id, position_x, position_y, type, canvas_id, node_type, is_public, rating, usage_count, tags, author_id, data_id, created_at, updated_at)
VALUES 
    ('node_global_1', 100, 100, 'customType', 'canvas_global_library', 'GLOBAL', true, 4.5, 10, ARRAY['api', 'gateway', 'backend'], 'user_khammerson', 'ndata_global_1', NOW(), NOW()),
    ('node_global_2', 300, 100, 'customType', 'canvas_global_library', 'GLOBAL', true, 4.2, 5, ARRAY['database', 'storage', 'backend'], 'user_khammerson', 'ndata_global_2', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. Звезды для проектов
INSERT INTO stars (id, project_id, user_id, created_at)
VALUES 
    ('star_1', 'project_khammerson_2', 'user_azamat', NOW()),
    ('star_2', 'project_azamat_1', 'user_khammerson', NOW())
ON CONFLICT (project_id, user_id) DO NOTHING;

-- 6. Оценки для нод
INSERT INTO user_node_ratings (id, user_id, node_id, rating, created_at, updated_at)
VALUES 
    ('rating_1', 'user_khammerson', 'node_global_1', 5, NOW(), NOW()),
    ('rating_2', 'user_azamat', 'node_global_1', 4, NOW(), NOW()),
    ('rating_3', 'user_khammerson', 'node_global_2', 4, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ==================== ПРОВЕРКА ====================

SELECT '=== ТАБЛИЦЫ СОЗДАНЫ УСПЕШНО ===' as status;
SELECT COUNT(*) as users_count FROM "users";
SELECT COUNT(*) as projects_count FROM projects;
SELECT COUNT(*) as canvases_count FROM canvases;
SELECT COUNT(*) as nodes_count FROM nodes;
SELECT COUNT(*) as global_nodes_count FROM nodes WHERE node_type = 'GLOBAL' AND is_public = true;
SELECT COUNT(*) as stars_count FROM stars;
SELECT NOW() as timestamp;
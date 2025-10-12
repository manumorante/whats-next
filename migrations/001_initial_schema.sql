-- Migration: Complete schema for activity recommendation system
-- Date: 2025-10-11

-- ==================================================
-- 1. CREATE CATEGORIES TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  color TEXT NOT NULL,
  icon TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- 2. CREATE CONTEXTS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS contexts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  days TEXT, -- JSON array: ["Mon","Tue","Wed","Thu","Fri"]
  time_start TEXT,
  time_end TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ==================================================
-- 3. RENAME/RECREATE TASKS AS ACTIVITIES
-- ==================================================
-- Drop old tasks table if exists and create new activities table
DROP TABLE IF EXISTS tasks;

CREATE TABLE IF NOT EXISTS activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  duration_minutes INTEGER,
  energy_level TEXT CHECK(energy_level IN ('low', 'medium', 'high')),
  location TEXT,
  priority TEXT CHECK(priority IN ('urgent', 'important', 'someday')) DEFAULT 'someday',
  is_completed INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- ==================================================
-- 4. CREATE ACTIVITY_TIME_SLOTS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS activity_time_slots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL,
  day_of_week TEXT CHECK(day_of_week IN ('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', NULL)),
  time_start TEXT NOT NULL,
  time_end TEXT NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- ==================================================
-- 5. CREATE ACTIVITY_CONTEXTS TABLE (Many-to-Many)
-- ==================================================
CREATE TABLE IF NOT EXISTS activity_contexts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL,
  context_id INTEGER NOT NULL,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
  FOREIGN KEY (context_id) REFERENCES contexts(id) ON DELETE CASCADE,
  UNIQUE(activity_id, context_id)
);

-- ==================================================
-- 6. CREATE ACTIVITY_COMPLETIONS TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS activity_completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  activity_id INTEGER NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE
);

-- ==================================================
-- 7. INSERT DEFAULT CATEGORIES
-- ==================================================
INSERT INTO categories (name, color, icon) VALUES
  ('Productiva', '#3B82F6', 'WORK'),
  ('Ocio', '#8B5CF6', 'FUN'),
  ('Social', '#EC4899', 'SOCIAL'),
  ('Bienestar', '#10B981', 'HEALTH'),
  ('Mantenimiento', '#F59E0B', 'HOME');

-- ==================================================
-- 8. INSERT DEFAULT CONTEXTS
-- ==================================================
INSERT INTO contexts (name, label, days, time_start, time_end) VALUES
  ('work_hours', 'Horario laboral', '["Mon","Tue","Wed","Thu","Fri"]', '09:00', '14:00'),
  ('work_afternoon', 'Trabajo tarde', '["Mon","Tue","Wed","Thu","Fri"]', '16:00', '19:00'),
  ('lunch_break', 'Hora de comer', '["Mon","Tue","Wed","Thu","Fri"]', '14:00', '16:00'),
  ('after_work', 'Después del trabajo', '["Mon","Tue","Wed","Thu","Fri"]', '19:00', '23:00'),
  ('weekend_morning', 'Fin de semana mañana', '["Sat","Sun"]', '08:00', '14:00'),
  ('weekend_afternoon', 'Fin de semana tarde', '["Sat","Sun"]', '14:00', '20:00'),
  ('weekend_evening', 'Fin de semana noche', '["Sat","Sun"]', '20:00', '23:59'),
  ('late_night', 'Noche', '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]', '23:00', '06:00'),
  ('anytime', 'Cualquier momento', '["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]', '00:00', '23:59');

-- ==================================================
-- 9. INSERT EXAMPLE ACTIVITIES
-- ==================================================

-- Ejemplo 1: Ir al cine (Ocio, fin de semana o después del trabajo)
INSERT INTO activities (title, description, category_id, duration_minutes, energy_level, location, priority)
VALUES ('Ir al cine', 'Ver una película en el cine', 2, 150, 'medium', 'outdoor', 'someday');

INSERT INTO activity_contexts (activity_id, context_id) VALUES
  (1, 4), -- after_work
  (1, 5), -- weekend_morning
  (1, 6), -- weekend_afternoon
  (1, 7); -- weekend_evening

-- Ejemplo 2: Ejercicio en el gimnasio (Bienestar)
INSERT INTO activities (title, description, category_id, duration_minutes, energy_level, location, priority)
VALUES ('Gimnasio', 'Sesión de entrenamiento', 4, 60, 'high', 'gym', 'important');

INSERT INTO activity_contexts (activity_id, context_id) VALUES
  (2, 3), -- lunch_break
  (2, 4), -- after_work
  (2, 5); -- weekend_morning

-- Ejemplo 3: Videollamada de trabajo (Productiva, horario específico)
INSERT INTO activities (title, description, category_id, duration_minutes, energy_level, location, priority)
VALUES ('Reunión de equipo', 'Daily standup meeting', 1, 30, 'medium', 'office', 'important');

INSERT INTO activity_time_slots (activity_id, day_of_week, time_start, time_end) VALUES
  (3, 'Mon', '10:00', '10:30'),
  (3, 'Tue', '10:00', '10:30'),
  (3, 'Wed', '10:00', '10:30'),
  (3, 'Thu', '10:00', '10:30'),
  (3, 'Fri', '10:00', '10:30');

-- Ejemplo 4: Leer un libro (Ocio, flexible)
INSERT INTO activities (title, description, category_id, duration_minutes, energy_level, location, priority)
VALUES ('Leer un libro', 'Lectura personal', 2, 30, 'low', 'home', 'someday');

INSERT INTO activity_contexts (activity_id, context_id) VALUES
  (4, 4), -- after_work
  (4, 8), -- late_night
  (4, 9); -- anytime

-- ==================================================
-- 10. CREATE INDEXES FOR PERFORMANCE
-- ==================================================
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category_id);
CREATE INDEX IF NOT EXISTS idx_activities_priority ON activities(priority);
CREATE INDEX IF NOT EXISTS idx_activities_completed ON activities(is_completed);
CREATE INDEX IF NOT EXISTS idx_activity_time_slots_activity ON activity_time_slots(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_contexts_activity ON activity_contexts(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_contexts_context ON activity_contexts(context_id);
CREATE INDEX IF NOT EXISTS idx_activity_completions_activity ON activity_completions(activity_id);
CREATE INDEX IF NOT EXISTS idx_activity_completions_date ON activity_completions(completed_at);


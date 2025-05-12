-- Enable pgcrypto for secure functions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Users table (if not already created):
CREATE TABLE IF NOT EXISTS users (
  user_id SERIAL PRIMARY KEY,
  username TEXT NOT NULL,
  user_email TEXT NOT NULL UNIQUE,
  user_firstname TEXT,
  user_lastname TEXT,
  user_avatar_url TEXT,
  user_password TEXT NOT NULL,
  date_registered TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Study groups table:
CREATE TABLE IF NOT EXISTS groups (
  group_id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  created_by INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Group-members join table:
CREATE TABLE IF NOT EXISTS group_members (
  group_id BIGINT NOT NULL REFERENCES groups(group_id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (group_id, user_id)
);
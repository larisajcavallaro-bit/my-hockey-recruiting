-- Add type and linkUrl columns to notifications table
-- Run when your database is available: psql $DATABASE_URL -f scripts/add-notification-columns.sql

ALTER TABLE notifications ADD COLUMN IF NOT EXISTS type TEXT NOT NULL DEFAULT 'general';
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link_url TEXT;

CREATE INDEX IF NOT EXISTS notifications_user_id_idx ON notifications(user_id);
CREATE INDEX IF NOT EXISTS notifications_user_id_read_idx ON notifications(user_id, read);

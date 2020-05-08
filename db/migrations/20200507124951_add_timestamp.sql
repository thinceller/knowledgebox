-- +goose Up
ALTER TABLE page
  ADD COLUMN created_at timestamp NOT NULL DEFAULT 0,
  ADD COLUMN updated_at timestamp DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE line
  ADD COLUMN created_at timestamp NOT NULL DEFAULT 0,
  ADD COLUMN updated_at timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;


-- +goose Down
ALTER TABLE page DROP COLUMN created_at, DROP COLUMN updated_at;
ALTER TABLE line DROP COLUMN created_at, DROP COLUMN updated_at;

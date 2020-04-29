-- +goose Up
ALTER TABLE page ADD UNIQUE page_title_unique (title);

-- +goose Down
ALTER TABLE page DROP INDEX page_title_unique;

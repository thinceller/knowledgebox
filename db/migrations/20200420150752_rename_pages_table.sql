-- +goose Up
ALTER TABLE pages RENAME TO page;

-- +goose Down
ALTER TABLE page RENAME TO pages;

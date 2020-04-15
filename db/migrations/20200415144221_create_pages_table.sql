-- +goose Up
CREATE TABLE pages (
  id INT(11) AUTO_INCREMENT NOT NULL,
  title VARCHAR(100),
  PRIMARY KEY(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- +goose Down
DROP TABLE pages;

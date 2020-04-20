-- +goose Up
CREATE TABLE line (
  id INT(11) AUTO_INCREMENT NOT NULL,
  body VARCHAR(1000),
  page_id INT(11) NOT NULL,
  page_index INT NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (page_id) REFERENCES page (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- +goose Down
DROP TABLE line;

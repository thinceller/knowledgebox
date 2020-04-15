DBNAME := development_kb
DBSOURCE := user:password@tcp(127.0.0.1:3306)/$(DBNAME)?parseTime=true

install:
	which goose || go get -u github.com/pressly/goose/cmd/goose

build:
	go build -o bin/knowledgebox ./backend/main.go

clean:
	rm -f bin/knowledgebox

mysql:
	docker-compose exec db mysql -u user -p -h localhost -P 3306 "$(DBNAME)"

migrate/status:
	goose -dir "db/migrations" mysql "$(DBSOURCE)" status

migrate/up:
	goose -dir "db/migrations" mysql "$(DBSOURCE)" up

migrate/down:
	goose -dir "db/migrations" mysql "$(DBSOURCE)" down

.PHONY: install build clean mysql migrate/status migrate/up migrate/down

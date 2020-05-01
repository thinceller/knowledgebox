DBNAME := development_kb
TEST_DBNAME := test_kb
DBSOURCE := root:root@tcp(127.0.0.1:3306)/$(DBNAME)?parseTime=true
TEST_DBSOURCE := root:root@tcp(127.0.0.1:3306)/$(TEST_DBNAME)?parseTime=true

install:
	which goose || go get -u github.com/pressly/goose/cmd/goose

prepare/db:
	docker-compose exec db mysql -u root -p -h localhost -P 3306 -proot -e "CREATE DATABASE IF NOT EXISTS \`$(DBNAME)\`"
	docker-compose exec db mysql -u root -p -h localhost -P 3306 -proot -e "CREATE DATABASE IF NOT EXISTS \`$(TEST_DBNAME)\`"

build:
	go build -o bin/knowledgebox

run:
	./bin/knowledgebox

test:
	APP_ENV=test MYSQL_DATASOURCE="$(TEST_DBSOURCE)" go test ./...

clean:
	rm -f bin/knowledgebox

mysql:
	docker-compose exec db mysql -u root -p -h localhost -P 3306 "$(DBNAME)" -proot

mysql/test:
	docker-compose exec db mysql -u root -p -h localhost -P 3306 "$(TEST_DBNAME)" -proot

migrate/status:
	goose -dir "db/migrations" mysql "$(DBSOURCE)" status

migrate/up:
	goose -dir "db/migrations" mysql "$(DBSOURCE)" up

migrate/down:
	goose -dir "db/migrations" mysql "$(DBSOURCE)" down

migrate/status/test:
	goose -dir "db/migrations" mysql "$(TEST_DBSOURCE)" status

migrate/up/test:
	goose -dir "db/migrations" mysql "$(TEST_DBSOURCE)" up

migrate/down/test:
	goose -dir "db/migrations" mysql "$(TEST_DBSOURCE)" down

.PHONY: install prepare/db build run clean mysql mysql/test migrate/status migrate/up migrate/down

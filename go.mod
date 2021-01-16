// +heroku goVersion go1.14
// +heroku install . github.com/pressly/goose/cmd/goose

module github.com/thinceller/knowledgebox

go 1.14

require (
	github.com/go-sql-driver/mysql v1.5.0
	github.com/go-testfixtures/testfixtures/v3 v3.5.0
	github.com/jmoiron/sqlx v1.2.0
	github.com/joho/godotenv v1.3.0
	github.com/labstack/echo/v4 v4.1.17
)

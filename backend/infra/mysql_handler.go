package infra

import (
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/jmoiron/sqlx"
	"github.com/joho/godotenv"
)

type SQLHandler struct {
	DB *sqlx.DB
}

func NewMySQLHander() *SQLHandler {
	env := os.Getenv("APP_ENV")
	if env == "" {
		env = "development"
	}

	if env == "development" {
		err := godotenv.Load()
		if err != nil {
			log.Fatalf("error loading env file. %s", err)
		}
	}

	// TODO: DBを変更できるように修正
	datasource := os.Getenv("MYSQL_DATASOURCE")
	db, err := sqlx.Open("mysql", datasource)
	if err != nil {
		log.Fatalf("error opening database. %s", err)
	}

	handler := &SQLHandler{
		DB: db,
	}
	return handler
}

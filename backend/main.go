package main

import (
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/thinceller/knowledgebox/backend/infra"
)

type PostRequest struct {
	Title string `json:"title"`
}

func main() {
	e := echo.New()

	sqlHandler := infra.NewMySQLHander()

	err := sqlHandler.DB.Ping()
	if err != nil {
		log.Fatal(err)
	}

	e.GET("/", func(c echo.Context) error {
		return c.String(http.StatusOK, "hello")
	})
	e.POST("/pages", func(c echo.Context) error {
		req := new(PostRequest)
		err := c.Bind(req)
		if err != nil {
			return err
		}

		_, err = sqlHandler.DB.Exec("INSERT INTO pages (title) VALUES (?)", req.Title)
		if err != nil {
			return err
		}
		return c.String(http.StatusCreated, "created.")
	})
	e.Logger.Fatal(e.Start(":1323"))
}

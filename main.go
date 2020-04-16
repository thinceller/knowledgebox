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

type PostResponse struct {
	Message string `json:"message"`
}

type Page struct {
	Id    string `json:"id"`
	Title string `json:"title"`
}

type Pages []Page

func main() {
	e := echo.New()

	sqlHandler := infra.NewMySQLHander()

	err := sqlHandler.DB.Ping()
	if err != nil {
		log.Fatal(err)
	}

	e.GET("/", func(c echo.Context) error {
		var pages Pages
		if err := sqlHandler.DB.Select(&pages, "SELECT id, title FROM pages"); err != nil {
			return err
		}
		return c.JSON(http.StatusOK, pages)
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
		res := &PostResponse{
			Message: "created.",
		}
		return c.JSON(http.StatusCreated, res)
	})
	e.Logger.Fatal(e.Start(":1323"))
}

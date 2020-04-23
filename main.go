package main

import (
	"log"

	"github.com/labstack/echo/v4"

	"github.com/thinceller/knowledgebox/backend/infra"
	"github.com/thinceller/knowledgebox/backend/injector"
)

func main() {
	e := echo.New()

	// TODO: db を flag などで切り替えられるように変更
	sqlHandler := infra.NewMySQLHander()

	err := sqlHandler.DB.Ping()
	if err != nil {
		log.Fatal(err)
	}

	pageHandler := injector.InjectDBtoHandler(sqlHandler.DB)

	// routing 設定
	e.GET("/pages", pageHandler.Index)
	e.GET("/pages/:title", pageHandler.Get)
	e.POST("/pages", pageHandler.Create)
	e.PUT("/pages/:title", pageHandler.Save)

	e.Logger.Fatal(e.Start(":1323"))
}

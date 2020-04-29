package main

import (
	"log"
	"os"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"

	"github.com/thinceller/knowledgebox/backend/infra"
	"github.com/thinceller/knowledgebox/backend/injector"
)

func myCORS(env string) echo.MiddlewareFunc {
	// 開発環境ではデフォルトのCORS設定を用いる
	if env != "production" {
		return middleware.CORS()
	}

	clientOrigin := os.Getenv("CLIENT_ORIGIN")

	return middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{clientOrigin},
	})
}

func main() {
	e := echo.New()

	env := os.Getenv("APP_ENV")
	port := os.Getenv("PORT")

	// TODO: db を flag などで切り替えられるように変更
	sqlHandler := infra.NewMySQLHander()

	if err := sqlHandler.DB.Ping(); err != nil {
		log.Fatal(err)
	}

	pageHandler := injector.InjectDBtoHandler(sqlHandler.DB)

	e.Use(myCORS(env))
	e.Use(middleware.Logger())

	// routing 設定
	e.GET("/pages", pageHandler.Index)
	e.GET("/pages/:title", pageHandler.Get)
	e.POST("/pages", pageHandler.Create)
	e.PUT("/pages/:title", pageHandler.Save)
	e.DELETE("/pages/:title", pageHandler.Delete)

	var addr string
	if env == "production" {
		addr = ":" + port
	} else {
		addr = ":1323"
	}
	e.Logger.Fatal(e.Start(addr))
}

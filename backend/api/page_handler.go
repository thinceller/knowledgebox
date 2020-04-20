package api

import (
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/thinceller/knowledgebox/backend/domain"
)

type PageHandler struct {
	repository domain.PageRepository
}

type PostRequest struct {
	Title string `json:"title"`
}

type PostResponse struct {
	Message string `json:"message"`
}

func NewPageHandler(repo domain.PageRepository) *PageHandler {
	return &PageHandler{
		repository: repo,
	}
}

func (h *PageHandler) Index(c echo.Context) error {
	pages := h.repository.All()
	return c.JSON(http.StatusOK, pages)
}

func (h *PageHandler) Create(c echo.Context) error {
	req := new(PostRequest)
	err := c.Bind(req)
	if err != nil {
		return err
	}

	h.repository.Create(req.Title)
	res := &PostResponse{
		Message: "created.",
	}
	return c.JSON(http.StatusCreated, res)
}

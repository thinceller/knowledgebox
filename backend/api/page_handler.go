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

type PutRequest struct {
	Page domain.Page `json:"page"`
}

func NewPageHandler(repo domain.PageRepository) *PageHandler {
	return &PageHandler{
		repository: repo,
	}
}

func (h *PageHandler) Index(c echo.Context) error {
	pages, err := h.repository.All()
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, pages)
}

func (h *PageHandler) Get(c echo.Context) error {
	title := c.Param("title")
	page, err := h.repository.Get(title)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, page)
}

func (h *PageHandler) Create(c echo.Context) error {
	req := new(PostRequest)
	if err := c.Bind(req); err != nil {
		return err
	}

	if err := h.repository.Create(req.Title); err != nil {
		return err
	}

	res := &PostResponse{
		Message: "created.",
	}
	return c.JSON(http.StatusCreated, res)
}

func (h *PageHandler) Save(c echo.Context) error {
	page := new(domain.Page)
	if err := c.Bind(page); err != nil {
		return err
	}

	if err := h.repository.Save(page); err != nil {
		return err
	}

	return c.JSON(http.StatusOK, page)
}

func (h *PageHandler) Delete(c echo.Context) error {
	page := new(domain.Page)
	if err := c.Bind(page); err != nil {
		return err
	}

	if err := h.repository.Delete(page); err != nil {
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

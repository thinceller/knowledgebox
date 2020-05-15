package api

import (
	"database/sql"
	"net/http"

	"github.com/labstack/echo/v4"

	"github.com/thinceller/knowledgebox/backend/domain"
)

type PageHandler struct {
	repository domain.PageRepository
}

type PostResponse struct {
	Message string `json:"message"`
}

type PutRequest struct {
	Page domain.Page `json:"page"`
}

type APIError struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}

func NewPageHandler(repo domain.PageRepository) *PageHandler {
	return &PageHandler{
		repository: repo,
	}
}

type Title struct {
	Id           int      `json:"id"`
	Title        string   `json:"title"`
	Descriptions []string `json:"descriptions"`
	Links        []string `json:"links"`
}

type Titles []Title

func newTitles(pages domain.Pages) Titles {
	var titles Titles
	for _, page := range pages {
		var desc []string
		for i, l := range page.Lines {
			desc = append(desc, l.Body)
			if i == 4 {
				break
			}
		}
		title := Title{
			Id:           page.Id,
			Title:        page.Title,
			Descriptions: desc,
			Links:        page.Links,
		}
		titles = append(titles, title)
	}
	return titles
}

func (h *PageHandler) Index(c echo.Context) error {
	pages, err := h.repository.All()
	if err != nil {
		var apierr APIError
		apierr.Code = http.StatusInternalServerError
		apierr.Message = err.Error()
		c.JSON(http.StatusInternalServerError, apierr)
		return err
	}
	titles := newTitles(pages)

	return c.JSON(http.StatusOK, titles)
}

func (h *PageHandler) Get(c echo.Context) error {
	title := c.Param("title")
	page, err := h.repository.Get(title)
	if err != nil {
		var apierr APIError
		if err == sql.ErrNoRows {
			apierr.Code = http.StatusNotFound
			apierr.Message = "Not Found"
		} else {
			apierr.Code = http.StatusInternalServerError
			apierr.Message = err.Error()
		}
		c.JSON(apierr.Code, apierr)
		return err
	}

	return c.JSON(http.StatusOK, page)
}

func (h *PageHandler) Create(c echo.Context) error {
	page := new(domain.Page)
	if err := c.Bind(page); err != nil {
		var apierr APIError
		apierr.Code = http.StatusBadRequest
		apierr.Message = err.Error()
		c.JSON(http.StatusBadRequest, apierr)
		return err
	}

	if err := h.repository.Create(page); err != nil {
		var apierr APIError
		apierr.Code = http.StatusInternalServerError
		apierr.Message = err.Error()
		c.JSON(http.StatusInternalServerError, apierr)
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
		var apierr APIError
		apierr.Code = http.StatusBadRequest
		apierr.Message = err.Error()
		c.JSON(http.StatusBadRequest, apierr)
		return err
	}

	if err := h.repository.Save(page); err != nil {
		var apierr APIError
		apierr.Code = http.StatusInternalServerError
		apierr.Message = err.Error()
		c.JSON(http.StatusInternalServerError, apierr)
		return err
	}

	return c.JSON(http.StatusOK, page)
}

func (h *PageHandler) Delete(c echo.Context) error {
	page := new(domain.Page)
	if err := c.Bind(page); err != nil {
		var apierr APIError
		apierr.Code = http.StatusBadRequest
		apierr.Message = err.Error()
		c.JSON(http.StatusBadRequest, apierr)
		return err
	}

	if err := h.repository.Delete(page); err != nil {
		var apierr APIError
		apierr.Code = http.StatusInternalServerError
		apierr.Message = err.Error()
		c.JSON(http.StatusInternalServerError, apierr)
		return err
	}

	return c.NoContent(http.StatusNoContent)
}

func (h *PageHandler) Search(c echo.Context) error {
	query := c.QueryParam("q")
	// TODO: query がない場合の400error

	pages, err := h.repository.Search(query)
	if err != nil {
		return err
	}

	return c.JSON(http.StatusOK, pages)
}

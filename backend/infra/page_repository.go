package infra

import (
	"log"

	"github.com/jmoiron/sqlx"

	"github.com/thinceller/knowledgebox/backend/domain"
)

type PageRepository struct {
	DB *sqlx.DB
}

func NewPageRepository(db *sqlx.DB) domain.PageRepository {
	return &PageRepository{DB: db}
}

func (r *PageRepository) All() domain.Pages {
	var pages domain.Pages
	if err := r.DB.Select(&pages, "SELECT * FROM pages"); err != nil {
		log.Fatal(err)
	}

	return pages
}

func (r *PageRepository) Get(title string) *domain.Page {
	var page *domain.Page

	return page
}

func (r *PageRepository) Create(title string) {
	_, err := r.DB.Exec("INSERT INTO pages (title) VALUES (?)", title)
	if err != nil {
		log.Fatal(err)
	}

	return
}

func (r *PageRepository) Save() {
	return
}

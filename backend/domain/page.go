package domain

import "time"

type Page struct {
	Id        int        `json:"id" db:"id"`
	Title     string     `json:"title" db:"title"`
	CreatedAt *time.Time `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
	Lines     []*Line    `json:"lines"`
	Links     []string   `json:"links"`
}

type Pages []*Page

type PageRepository interface {
	All() (Pages, error)
	Get(title string) (*Page, error)
	GetByID(id int) (*Page, error)
	Create(page *Page) error
	Save(page *Page) error
	Delete(page *Page) error
	Search(query string) (Pages, error)
}

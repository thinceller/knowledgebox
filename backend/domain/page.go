package domain

type Page struct {
	Id    int     `json:"id" db:"id"`
	Title string  `json:"title" db:"title"`
	Lines []*Line `json:"lines"`
}

type Pages []*Page

type PageRepository interface {
	All() (Pages, error)
	Get(title string) (*Page, error)
	Create(title string) error
	Save(page *Page) error
	Delete(page *Page) error
}

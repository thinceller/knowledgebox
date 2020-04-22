package domain

type Page struct {
	Id    string  `json:"id" db:"id"`
	Title string  `json:"title" db:"title"`
	Lines []*Line `json:"lines"`
}

type Pages []*Page

type PageRepository interface {
	All() (Pages, error)
	Get(title string) (*Page, error)
	Create(title string) error
	Save() error
}

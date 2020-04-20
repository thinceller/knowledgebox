package domain

type Page struct {
	Id    string `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
	Lines []*Line
}

type Pages []*Page

type PageRepository interface {
	All() Pages
	Get(title string) *Page
	Create(title string)
	Save()
}

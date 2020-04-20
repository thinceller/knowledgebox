package domain

type Line struct {
	Id     string `json:"id" db:"id"`
	Body   string `json:"body" db:"body"`
	PageId string `json:"page_id" db:"page_id"`
	Index  int    `json:"index" db:"index"`
}

type LineRepository interface {
	All() []*Page
	Get(title string) *Page
	Save()
}

package domain

type Line struct {
	Id        int    `json:"id" db:"id"`
	Body      string `json:"body" db:"body"`
	PageId    int    `json:"page_id" db:"page_id"`
	PageIndex int    `json:"page_index" db:"page_index"`
}

type LineRepository interface {
	All() []*Page
	Get(title string) *Page
	Save()
}

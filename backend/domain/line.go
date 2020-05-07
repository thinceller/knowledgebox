package domain

import "time"

type Line struct {
	Id        int        `json:"id" db:"id"`
	Body      string     `json:"body" db:"body"`
	PageId    int        `json:"page_id" db:"page_id"`
	PageIndex int        `json:"page_index" db:"page_index"`
	CreatedAt *time.Time `json:"created_at" db:"created_at"`
	UpdatedAt *time.Time `json:"updated_at" db:"updated_at"`
}

type LineRepository interface {
	All() []*Page
	Get(title string) *Page
	Save()
}

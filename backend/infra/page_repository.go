package infra

import (
	"database/sql"
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

func (r *PageRepository) All() (domain.Pages, error) {
	var pages domain.Pages
	if err := r.DB.Select(&pages, "SELECT * FROM page"); err != nil {
		return nil, err
	}

	// TODO: N+1問題解消
	for _, p := range pages {
		if err := r.DB.Select(
			&p.Lines,
			"SELECT * FROM line WHERE line.page_id = ? ORDER BY page_index",
			p.Id,
		); err != nil {
			return nil, err
		}
	}

	return pages, nil
}

func (r *PageRepository) Get(title string) (*domain.Page, error) {
	var page domain.Page
	if err := r.DB.Get(&page, "SELECT * from page WHERE title = ? LIMIT 1", title); err != nil {
		return nil, err
	}
	if err := r.DB.Select(
		&page.Lines, "SELECT * from line WHERE line.page_id = ? ORDER BY page_index",
		page.Id,
	); err != nil {
		return nil, err
	}

	return &page, nil
}

// TODO: line の生成も同時に行っているので application層に分けたい
func (r *PageRepository) Create(title string) error {
	tx := r.DB.MustBegin()
	defer func() {
		if rollbackErr := tx.Rollback(); rollbackErr != nil {
			if rollbackErr != sql.ErrTxDone {
				log.Fatal(rollbackErr)
			}
		}
	}()

	result := tx.MustExec("INSERT INTO page (title) VALUES (?)", title)
	page_id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	_ = tx.MustExec(
		"INSERT INTO line (body,page_id,page_index) VALUES (?,?,?)",
		title,
		page_id,
		0,
	)

	err = tx.Commit()
	if err != nil {
		return err
	}

	return nil
}

func (r *PageRepository) Save() error {
	return nil
}

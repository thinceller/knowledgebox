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
	if err := r.DB.Select(&pages, "SELECT * FROM page ORDER BY updated_at DESC"); err != nil {
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
func (r *PageRepository) Create(page *domain.Page) error {
	tx := r.DB.MustBegin()
	defer func() {
		if rollbackErr := tx.Rollback(); rollbackErr != nil {
			if rollbackErr != sql.ErrTxDone {
				log.Fatal(rollbackErr)
			}
		}
	}()

	result, err := tx.Exec("INSERT INTO page (title) VALUES (?)", page.Title)
	if err != nil {
		return err
	}

	pageId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	for _, line := range page.Lines {
		_ = tx.MustExec(
			"INSERT INTO line (body,page_id,page_index) VALUES (?,?,?)",
			line.Body,
			pageId,
			line.PageIndex,
		)
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (r *PageRepository) Save(page *domain.Page) error {
	tx := r.DB.MustBegin()
	defer func() {
		if rollbackErr := tx.Rollback(); rollbackErr != nil {
			if rollbackErr != sql.ErrTxDone {
				log.Fatal(rollbackErr)
			}
		}
	}()

	// page 本体の更新
	_ = tx.MustExec(
		"UPDATE page SET title = ?, updated_at = NOW() WHERE id = ?",
		page.Title,
		page.Id,
	)

	// lines の更新/追加
	for _, line := range page.Lines {
		if line.Id == 0 {
			// 新しい行追加
			result, err := tx.Exec(
				"INSERT INTO line (body,page_id,page_index) VALUES (?,?,?)",
				line.Body,
				line.PageId,
				line.PageIndex,
			)
			if err != nil {
				return err
			}

			if id, err := result.LastInsertId(); err != nil {
				return err
			} else {
				line.Id = int(id)
			}
		} else {
			_ = tx.MustExec(
				"UPDATE line SET body = ?, page_index = ? WHERE id = ?",
				line.Body,
				line.PageIndex,
				line.Id,
			)
		}
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (r *PageRepository) Delete(page *domain.Page) error {
	tx := r.DB.MustBegin()
	defer func() {
		if rollbackErr := tx.Rollback(); rollbackErr != nil {
			if rollbackErr != sql.ErrTxDone {
				log.Fatal(rollbackErr)
			}
		}
	}()

	_ = tx.MustExec("DELETE FROM line WHERE page_id = ?", page.Id)

	_ = tx.MustExec("DELETE FROM page WHERE id = ?", page.Id)

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

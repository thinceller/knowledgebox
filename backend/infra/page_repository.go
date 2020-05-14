package infra

import (
	"database/sql"
	"fmt"
	"log"
	"regexp"
	"strings"
	"sync"

	"github.com/jmoiron/sqlx"

	"github.com/thinceller/knowledgebox/backend/domain"
)

var linkRe = regexp.MustCompile(`\[([^[]*)\]`)

type PageRepository struct {
	DB *sqlx.DB
}

func NewPageRepository(db *sqlx.DB) domain.PageRepository {
	return &PageRepository{DB: db}
}

func ExtractLinksFromPage(page *domain.Page) []string {
	var links []string
	var bodyList []string

	for _, line := range page.Lines {
		bodyList = append(bodyList, line.Body)
	}

	ch := extractLinksFromLine(bodyList)

	for link := range ch {
		if contains(links, link) {
			break
		}
		links = append(links, link)
	}

	return links
}

func contains(slice []string, s string) bool {
	for _, v := range slice {
		if v == s {
			return true
		}
	}
	return false
}

func extractLinksFromLine(lines []string) <-chan string {
	ch := make(chan string, 3)

	go func() {
		defer close(ch)

		var wg1 sync.WaitGroup
		for _, line := range lines {
			wg1.Add(1)
			go func(l string) {
				defer wg1.Done()
				result := linkRe.FindAllStringSubmatch(l, -1)
				if len(result) == 0 {
					return
				}
				for _, r := range result {
					if strings.HasPrefix(r[1], "https://") || strings.HasPrefix(r[1], "http://") {
						return
					}
					ch <- r[1]
				}

			}(line)
		}

		wg1.Wait()
	}()

	return ch
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

		links := ExtractLinksFromPage(p)
		p.Links = links
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

	links := ExtractLinksFromPage(&page)
	page.Links = links

	return &page, nil
}

func (r *PageRepository) GetByID(id int) (*domain.Page, error) {
	var page domain.Page
	if err := r.DB.Get(&page, "SELECT * from page WHERE id = ? LIMIT 1", id); err != nil {
		return nil, err
	}
	if err := r.DB.Select(
		&page.Lines, "SELECT * from line WHERE line.page_id = ? ORDER BY page_index",
		page.Id,
	); err != nil {
		return nil, err
	}

	links := ExtractLinksFromPage(&page)
	page.Links = links

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

	result, err := tx.Exec("INSERT INTO page (title,created_at) VALUES (?,NOW())", page.Title)
	if err != nil {
		return err
	}

	pageId, err := result.LastInsertId()
	if err != nil {
		return err
	}

	for _, line := range page.Lines {
		_ = tx.MustExec(
			"INSERT INTO line (body,page_id,page_index,created_at) VALUES (?,?,?,NOW())",
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
				"INSERT INTO line (body,page_id,page_index,created_at) VALUES (?,?,?,NOW())",
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

	// 参照のなくなった Line を削除する
	var lineIds []int
	for _, line := range page.Lines {
		lineIds = append(lineIds, line.Id)
	}
	arg := map[string]interface{}{
		"pageId":  page.Id,
		"lineIds": lineIds,
	}
	query, args, err := sqlx.Named(
		"DELETE FROM line WHERE page_id=:pageId and not id IN (:lineIds)",
		arg,
	)
	query, args, err = sqlx.In(query, args...)
	if err != nil {
		return err
	}
	query = tx.Rebind(query)
	_ = tx.MustExec(query, args...)

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

func (r *PageRepository) Search(query string) (domain.Pages, error) {
	var pages domain.Pages
	var pageIds []int

	if err := r.DB.Select(
		&pageIds,
		"SELECT page_id FROM line WHERE body LIKE ? group by page_id",
		"%"+query+"%",
	); err != nil {
		return nil, err
	}
	fmt.Println(pageIds)
	if len(pageIds) == 0 {
		// TODO: 404 返したい
		return nil, nil
	}

	for _, id := range pageIds {
		page, err := r.GetByID(id)
		if err != nil {
			return nil, err
		}
		pages = append(pages, page)
	}

	return pages, nil
}

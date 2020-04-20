package injector

import (
	"github.com/jmoiron/sqlx"

	"github.com/thinceller/knowledgebox/backend/api"
	"github.com/thinceller/knowledgebox/backend/domain"
	"github.com/thinceller/knowledgebox/backend/infra"
)

func InjectDBtoHandler(db *sqlx.DB) *api.PageHandler {
	var repository domain.PageRepository
	repository = infra.NewPageRepository(db)

	return api.NewPageHandler(repository)
}

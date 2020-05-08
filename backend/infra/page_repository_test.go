package infra

import (
	"os"
	"reflect"
	"testing"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-testfixtures/testfixtures/v3"
	"github.com/jmoiron/sqlx"
	"github.com/thinceller/knowledgebox/backend/domain"
)

var (
	db         *sqlx.DB
	fixtures   *testfixtures.Loader
	targetTime time.Time
)

func TestMain(m *testing.M) {
	conn := NewMySQLHander()
	err := conn.DB.Ping()
	if err != nil {
		panic(err)
	}

	db = conn.DB
	fixtures, err = testfixtures.New(
		testfixtures.Database(db.DB),
		testfixtures.Dialect("mysql"),
		testfixtures.Directory("../../testdata/fixtures"),
	)
	if err != nil {
		panic(err)
	}

	targetTime = time.Date(2020, time.December, 31, 23, 59, 59, 0, time.UTC)

	runTests := m.Run()
	os.Exit(runTests)
}

func prepareTestDatabase() {
	if err := fixtures.Load(); err != nil {
		panic(err)
	}
}

func TestNewPageRepository(t *testing.T) {
	type args struct {
		db *sqlx.DB
	}
	tests := []struct {
		name string
		args args
		want domain.PageRepository
	}{
		{
			name: "PageRepository の初期化に成功",
			args: args{db: db},
			want: &PageRepository{DB: db},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := NewPageRepository(tt.args.db); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("NewPageRepository() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPageRepository_All(t *testing.T) {
	prepareTestDatabase()

	type fields struct {
		DB *sqlx.DB
	}
	tests := []struct {
		name    string
		fields  fields
		want    domain.Pages
		wantErr bool
	}{
		{
			name:   "Page の全取得に成功",
			fields: fields{DB: db},
			want: domain.Pages{
				{
					Id:        1,
					Title:     "testpage",
					CreatedAt: &targetTime,
					UpdatedAt: &targetTime,
					Lines: []*domain.Line{
						{
							Id:        1,
							Body:      "testpage",
							PageId:    1,
							PageIndex: 0,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        2,
							Body:      "",
							PageId:    1,
							PageIndex: 1,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
					},
				},
				{
					Id:        2,
					Title:     "testpage_2",
					CreatedAt: &targetTime,
					UpdatedAt: &targetTime,
					Lines: []*domain.Line{
						{
							Id:        3,
							Body:      "testpage_2",
							PageId:    2,
							PageIndex: 0,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        4,
							Body:      "first line",
							PageId:    2,
							PageIndex: 1,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        5,
							Body:      "second line",
							PageId:    2,
							PageIndex: 2,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
					},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &PageRepository{
				DB: tt.fields.DB,
			}
			got, err := r.All()
			if (err != nil) != tt.wantErr {
				t.Errorf("PageRepository.All() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("PageRepository.All() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPageRepository_Get(t *testing.T) {
	prepareTestDatabase()

	type fields struct {
		DB *sqlx.DB
	}
	type args struct {
		title string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *domain.Page
		wantErr bool
	}{
		{
			name:   "タイトルによる Page の取得に成功",
			fields: fields{DB: db},
			args:   args{title: "testpage"},
			want: &domain.Page{
				Id:        1,
				Title:     "testpage",
				CreatedAt: &targetTime,
				UpdatedAt: &targetTime,
				Lines: []*domain.Line{
					{
						Id:        1,
						Body:      "testpage",
						PageId:    1,
						PageIndex: 0,
						CreatedAt: &targetTime,
						UpdatedAt: &targetTime,
					},
					{
						Id:        2,
						Body:      "",
						PageId:    1,
						PageIndex: 1,
						CreatedAt: &targetTime,
						UpdatedAt: &targetTime,
					},
				},
			},
			wantErr: false,
		},
		{
			name:    "タイトルによる Page の取得に失敗: 存在しないページ",
			fields:  fields{DB: db},
			args:    args{title: "unknown page"},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &PageRepository{
				DB: tt.fields.DB,
			}
			got, err := r.Get(tt.args.title)
			if (err != nil) != tt.wantErr {
				t.Errorf("PageRepository.Get() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("PageRepository.Get() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPageRepository_GetByID(t *testing.T) {
	prepareTestDatabase()

	type fields struct {
		DB *sqlx.DB
	}
	type args struct {
		id int
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    *domain.Page
		wantErr bool
	}{
		{
			name:   "タイトルによる Page の取得に成功",
			fields: fields{DB: db},
			args:   args{id: 1},
			want: &domain.Page{
				Id:        1,
				Title:     "testpage",
				CreatedAt: &targetTime,
				UpdatedAt: &targetTime,
				Lines: []*domain.Line{
					{
						Id:        1,
						Body:      "testpage",
						PageId:    1,
						PageIndex: 0,
						CreatedAt: &targetTime,
						UpdatedAt: &targetTime,
					},
					{
						Id:        2,
						Body:      "",
						PageId:    1,
						PageIndex: 1,
						CreatedAt: &targetTime,
						UpdatedAt: &targetTime,
					},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &PageRepository{
				DB: tt.fields.DB,
			}
			got, err := r.GetByID(tt.args.id)
			if (err != nil) != tt.wantErr {
				t.Errorf("PageRepository.GetByID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("PageRepository.GetByID() = %v, want %v", got, tt.want)
			}
		})
	}
}

func TestPageRepository_Create(t *testing.T) {
	type fields struct {
		DB *sqlx.DB
	}
	type args struct {
		page *domain.Page
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		{
			name:   "新規 Page の作成成功",
			fields: fields{DB: db},
			args: args{page: &domain.Page{
				Title: "new page",
				Lines: []*domain.Line{
					{
						Body:      "newpage",
						PageIndex: 0,
					},
					{
						Body:      "first line",
						PageIndex: 1,
					},
				},
			}},
			wantErr: false,
		},
		{
			name:   "新規 Page の作成失敗: タイトルの重複",
			fields: fields{DB: db},
			args: args{page: &domain.Page{
				Title: "testpage",
				Lines: []*domain.Line{
					{
						Body:      "testpage",
						PageIndex: 0,
					},
					{
						Body:      "first line",
						PageIndex: 1,
					},
				},
			}},
			wantErr: true,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &PageRepository{
				DB: tt.fields.DB,
			}
			if err := r.Create(tt.args.page); (err != nil) != tt.wantErr {
				t.Errorf("PageRepository.Create() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPageRepository_Save(t *testing.T) {
	prepareTestDatabase()

	type fields struct {
		DB *sqlx.DB
	}
	type args struct {
		page *domain.Page
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		{
			name:   "Page の保存成功",
			fields: fields{DB: db},
			args: args{page: &domain.Page{
				Id:    1,
				Title: "testpage",
				Lines: []*domain.Line{
					{
						Id:        1,
						Body:      "testpage",
						PageId:    1,
						PageIndex: 0,
					},
					{
						Id:        2,
						Body:      "",
						PageId:    1,
						PageIndex: 1,
					},
					{
						Body:      "new line",
						PageId:    1,
						PageIndex: 2,
					},
				},
			}},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &PageRepository{
				DB: tt.fields.DB,
			}
			if err := r.Save(tt.args.page); (err != nil) != tt.wantErr {
				t.Errorf("PageRepository.Save() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPageRepository_Delete(t *testing.T) {
	prepareTestDatabase()

	type fields struct {
		DB *sqlx.DB
	}
	type args struct {
		page *domain.Page
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		wantErr bool
	}{
		{
			name:   "Page の削除成功",
			fields: fields{DB: db},
			args: args{page: &domain.Page{
				Id:    2,
				Title: "testpage_2",
				Lines: []*domain.Line{
					{
						Id:        3,
						Body:      "testpage_2",
						PageId:    2,
						PageIndex: 0,
					},
					{
						Id:        4,
						Body:      "first line",
						PageId:    2,
						PageIndex: 1,
					},
					{
						Id:        5,
						Body:      "second line",
						PageId:    2,
						PageIndex: 2,
					},
				},
			}},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &PageRepository{
				DB: tt.fields.DB,
			}
			if err := r.Delete(tt.args.page); (err != nil) != tt.wantErr {
				t.Errorf("PageRepository.Delete() error = %v, wantErr %v", err, tt.wantErr)
			}
		})
	}
}

func TestPageRepository_Search(t *testing.T) {
	prepareTestDatabase()

	type fields struct {
		DB *sqlx.DB
	}
	type args struct {
		query string
	}
	tests := []struct {
		name    string
		fields  fields
		args    args
		want    domain.Pages
		wantErr bool
	}{
		{
			name:   "Page の検索成功",
			fields: fields{DB: db},
			args:   args{query: "page"},
			want: domain.Pages{
				{
					Id:        1,
					Title:     "testpage",
					CreatedAt: &targetTime,
					UpdatedAt: &targetTime,
					Lines: []*domain.Line{
						{
							Id:        1,
							Body:      "testpage",
							PageId:    1,
							PageIndex: 0,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        2,
							Body:      "",
							PageId:    1,
							PageIndex: 1,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
					},
				},
				{
					Id:        2,
					Title:     "testpage_2",
					CreatedAt: &targetTime,
					UpdatedAt: &targetTime,
					Lines: []*domain.Line{
						{
							Id:        3,
							Body:      "testpage_2",
							PageId:    2,
							PageIndex: 0,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        4,
							Body:      "first line",
							PageId:    2,
							PageIndex: 1,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        5,
							Body:      "second line",
							PageId:    2,
							PageIndex: 2,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
					},
				},
			},
			wantErr: false,
		},
		{
			name:   "Page の部分検索成功",
			fields: fields{DB: db},
			args:   args{query: "first"},
			want: domain.Pages{
				{
					Id:        2,
					Title:     "testpage_2",
					CreatedAt: &targetTime,
					UpdatedAt: &targetTime,
					Lines: []*domain.Line{
						{
							Id:        3,
							Body:      "testpage_2",
							PageId:    2,
							PageIndex: 0,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        4,
							Body:      "first line",
							PageId:    2,
							PageIndex: 1,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
						{
							Id:        5,
							Body:      "second line",
							PageId:    2,
							PageIndex: 2,
							CreatedAt: &targetTime,
							UpdatedAt: &targetTime,
						},
					},
				},
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			r := &PageRepository{
				DB: tt.fields.DB,
			}
			got, err := r.Search(tt.args.query)
			if (err != nil) != tt.wantErr {
				t.Errorf("PageRepository.Search() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("PageRepository.Search() = %v, want %v", got, tt.want)
			}
		})
	}
}

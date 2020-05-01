package infra

import (
	"os"
	"reflect"
	"testing"

	_ "github.com/go-sql-driver/mysql"
	"github.com/go-testfixtures/testfixtures/v3"
	"github.com/jmoiron/sqlx"

	"github.com/thinceller/knowledgebox/backend/domain"
)

var (
	db       *sqlx.DB
	fixtures *testfixtures.Loader
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
			name: "Create new page repository",
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
			name:   "PageRepository.All test",
			fields: fields{DB: db},
			want: domain.Pages{
				{
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
					},
				},
				{
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
		// TODO: Add test cases.
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
		// TODO: Add test cases.
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
		// TODO: Add test cases.
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
		// TODO: Add test cases.
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

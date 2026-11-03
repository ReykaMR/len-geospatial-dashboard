package store

import (
	"context"
	"database/sql"
	"errors"
	"os"
	"strings"
	"time"

	"leniot/backend/internal/model"

	_ "modernc.org/sqlite"
)

const Schema = `PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS entities (id TEXT PRIMARY KEY, name TEXT NOT NULL, type TEXT NOT NULL CHECK(type IN ('vehicle','iot_device','facility')), status TEXT NOT NULL CHECK(status IN ('active','warning','offline')), latitude REAL NOT NULL CHECK(latitude >= -90 AND latitude <= 90), longitude REAL NOT NULL CHECK(longitude >= -180 AND longitude <= 180), created_at TEXT NOT NULL, updated_at TEXT NOT NULL)`

type SQLiteStore struct {
	db *sql.DB
}

func Open(path string) (*SQLiteStore, error) {
	if path != ":memory:" {
		d := dir(path)
		if d != "." {
			if err := os.MkdirAll(d, 0750); err != nil {
				return nil, err
			}
		}
	}

	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}
	db.SetMaxOpenConns(1)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := InitSchema(ctx, db); err != nil {
		_ = db.Close()
		return nil, err
	}

	return &SQLiteStore{db: db}, nil
}

func NewSQLite(db *sql.DB) *SQLiteStore {
	return &SQLiteStore{db: db}
}

func InitSchema(ctx context.Context, db *sql.DB) error {
	_, err := db.ExecContext(ctx, Schema)
	return err
}

func (s *SQLiteStore) DB() *sql.DB {
	return s.db
}

func (s *SQLiteStore) Close() error {
	if s.db != nil {
		return s.db.Close()
	}
	return nil
}

func (s *SQLiteStore) List(ctx context.Context) ([]model.Entity, error) {
	rows, err := s.db.QueryContext(ctx, `SELECT id,name,type,status,latitude,longitude,created_at,updated_at FROM entities ORDER BY created_at DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	list := make([]model.Entity, 0)
	for rows.Next() {
		var e model.Entity
		var created, updated string
		if err := rows.Scan(&e.ID, &e.Name, &e.Type, &e.Status, &e.Latitude, &e.Longitude, &created, &updated); err != nil {
			return nil, err
		}
		e.CreatedAt, _ = time.Parse(time.RFC3339Nano, created)
		e.UpdatedAt, _ = time.Parse(time.RFC3339Nano, updated)
		list = append(list, e)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return list, nil
}

func (s *SQLiteStore) Get(ctx context.Context, id string) (model.Entity, error) {
	var e model.Entity
	var created, updated string
	err := s.db.QueryRowContext(ctx, `SELECT id,name,type,status,latitude,longitude,created_at,updated_at FROM entities WHERE id=?`, id).Scan(
		&e.ID, &e.Name, &e.Type, &e.Status, &e.Latitude, &e.Longitude, &created, &updated,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return e, ErrNotFound
	}
	if err != nil {
		return e, err
	}
	e.CreatedAt, _ = time.Parse(time.RFC3339Nano, created)
	e.UpdatedAt, _ = time.Parse(time.RFC3339Nano, updated)
	return e, nil
}

func (s *SQLiteStore) Create(ctx context.Context, e model.Entity) error {
	_, err := s.db.ExecContext(ctx,
		`INSERT INTO entities(id,name,type,status,latitude,longitude,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)`,
		e.ID,
		e.Name,
		e.Type,
		e.Status,
		e.Latitude,
		e.Longitude,
		e.CreatedAt.Format(time.RFC3339Nano),
		e.UpdatedAt.Format(time.RFC3339Nano),
	)
	return err
}

func (s *SQLiteStore) Update(ctx context.Context, e model.Entity) error {
	result, err := s.db.ExecContext(ctx,
		`UPDATE entities SET name=?,type=?,status=?,latitude=?,longitude=?,updated_at=? WHERE id=?`,
		e.Name,
		e.Type,
		e.Status,
		e.Latitude,
		e.Longitude,
		e.UpdatedAt.Format(time.RFC3339Nano),
		e.ID,
	)
	if err != nil {
		return err
	}
	n, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

func (s *SQLiteStore) Delete(ctx context.Context, id string) error {
	result, err := s.db.ExecContext(ctx, `DELETE FROM entities WHERE id=?`, id)
	if err != nil {
		return err
	}
	n, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if n == 0 {
		return ErrNotFound
	}
	return nil
}

func dir(path string) string {
	i := strings.LastIndexAny(path, "/\\")
	if i < 0 {
		return "."
	}
	return path[:i]
}

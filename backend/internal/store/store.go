package store

import (
	"context"
	"errors"

	"len-geospatial-dashboard/backend/internal/model"
)

var ErrNotFound = errors.New("entity not found")

type Repository interface {
	List(ctx context.Context) ([]model.Entity, error)
	Get(ctx context.Context, id string) (model.Entity, error)
	Create(ctx context.Context, e model.Entity) error
	Update(ctx context.Context, e model.Entity) error
	Delete(ctx context.Context, id string) error
	Close() error
}

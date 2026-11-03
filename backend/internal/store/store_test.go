package store

import (
	"context"
	"testing"
	"time"

	"len-geospatial-dashboard/backend/internal/model"
)

func newTestStore(t *testing.T) *SQLiteStore {
	t.Helper()
	st, err := Open(":memory:")
	if err != nil {
		t.Fatalf("failed to open test store: %v", err)
	}
	t.Cleanup(func() { _ = st.Close() })
	return st
}

func TestSQLiteStore_CRUD(t *testing.T) {
	st := newTestStore(t)
	ctx := context.Background()

	now := time.Now().UTC().Truncate(time.Millisecond)
	e := model.Entity{
		ID:        "test-entity-1",
		Name:      "Kapal Nelayan",
		Type:      "vehicle",
		Status:    "active",
		Latitude:  -6.1,
		Longitude: 106.8,
		CreatedAt: now,
		UpdatedAt: now,
	}

	// Create
	if err := st.Create(ctx, e); err != nil {
		t.Fatalf("create failed: %v", err)
	}

	// Get
	got, err := st.Get(ctx, e.ID)
	if err != nil {
		t.Fatalf("get failed: %v", err)
	}
	if got.ID != e.ID || got.Name != e.Name || got.Type != e.Type || got.Status != e.Status {
		t.Fatalf("get mismatch: got %+v, want %+v", got, e)
	}

	// List
	list, err := st.List(ctx)
	if err != nil {
		t.Fatalf("list failed: %v", err)
	}
	if len(list) != 1 || list[0].ID != e.ID {
		t.Fatalf("unexpected list result: %+v", list)
	}

	// Update
	e.Name = "Kapal Nelayan Baru"
	e.Status = "warning"
	e.UpdatedAt = time.Now().UTC().Truncate(time.Millisecond)
	if err := st.Update(ctx, e); err != nil {
		t.Fatalf("update failed: %v", err)
	}

	updated, err := st.Get(ctx, e.ID)
	if err != nil {
		t.Fatalf("get updated failed: %v", err)
	}
	if updated.Name != "Kapal Nelayan Baru" || updated.Status != "warning" {
		t.Fatalf("update not persisted: %+v", updated)
	}

	// Delete
	if err := st.Delete(ctx, e.ID); err != nil {
		t.Fatalf("delete failed: %v", err)
	}

	// Verify deleted
	_, err = st.Get(ctx, e.ID)
	if err != ErrNotFound {
		t.Fatalf("expected ErrNotFound after delete, got %v", err)
	}
}

func TestSQLiteStore_NotFound(t *testing.T) {
	st := newTestStore(t)
	ctx := context.Background()

	if _, err := st.Get(ctx, "nonexistent"); err != ErrNotFound {
		t.Fatalf("expected ErrNotFound for Get, got %v", err)
	}

	e := model.Entity{
		ID:        "nonexistent",
		Name:      "Test",
		Type:      "vehicle",
		Status:    "active",
		Latitude:  0,
		Longitude: 0,
		UpdatedAt: time.Now().UTC(),
	}
	if err := st.Update(ctx, e); err != ErrNotFound {
		t.Fatalf("expected ErrNotFound for Update, got %v", err)
	}

	if err := st.Delete(ctx, "nonexistent"); err != ErrNotFound {
		t.Fatalf("expected ErrNotFound for Delete, got %v", err)
	}
}

func TestSQLiteStore_CanceledContext(t *testing.T) {
	st := newTestStore(t)
	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	if _, err := st.List(ctx); err == nil {
		t.Fatal("expected error with canceled context on List")
	}
	if _, err := st.Get(ctx, "any"); err == nil {
		t.Fatal("expected error with canceled context on Get")
	}
}

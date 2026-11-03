package handler

import (
	"encoding/json"
	"errors"
	"io"
	"net/http"
	"strings"
	"time"

	"len-geospatial-dashboard/backend/internal/model"
	"len-geospatial-dashboard/backend/internal/store"
)

type Handler struct {
	repo store.Repository
}

func New(repo store.Repository) *Handler {
	return &Handler{repo: repo}
}

func (h *Handler) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/api/v1/entities", h.Collection)
	mux.HandleFunc("/api/v1/entities/", h.Item)
	mux.HandleFunc("/api/v1/health", h.Health)
}

func CORS(next http.Handler, origin string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("Origin") == origin {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Vary", "Origin")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		}
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (h *Handler) Health(w http.ResponseWriter, r *http.Request) {
	h.writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (h *Handler) Collection(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		list, err := h.repo.List(r.Context())
		if err != nil {
			h.internal(w)
			return
		}
		h.writeJSON(w, http.StatusOK, list)
	case http.MethodPost:
		var in model.Input
		if !h.decode(w, r, &in) {
			return
		}
		if fields := in.Validate(); len(fields) > 0 {
			h.writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Data yang dikirim tidak valid.", fields)
			return
		}
		id, err := model.NewID()
		if err != nil {
			h.internal(w)
			return
		}
		now := time.Now().UTC()
		e := model.Entity{
			ID:        id,
			Name:      strings.TrimSpace(in.Name),
			Type:      in.Type,
			Status:    in.Status,
			Latitude:  *in.Latitude,
			Longitude: *in.Longitude,
			CreatedAt: now,
			UpdatedAt: now,
		}
		if err := h.repo.Create(r.Context(), e); err != nil {
			h.internal(w)
			return
		}
		h.writeJSON(w, http.StatusCreated, e)
	default:
		w.Header().Set("Allow", "GET, POST")
		h.writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Metode tidak diizinkan.", nil)
	}
}

func (h *Handler) Item(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/api/v1/entities/")
	if id == "" || strings.Contains(id, "/") {
		h.writeError(w, http.StatusNotFound, "NOT_FOUND", "Entitas tidak ditemukan.", nil)
		return
	}
	switch r.Method {
	case http.MethodGet:
		e, err := h.repo.Get(r.Context(), id)
		if errors.Is(err, store.ErrNotFound) {
			h.writeError(w, http.StatusNotFound, "NOT_FOUND", "Entitas tidak ditemukan.", nil)
			return
		}
		if err != nil {
			h.internal(w)
			return
		}
		h.writeJSON(w, http.StatusOK, e)
	case http.MethodPut:
		var in model.Input
		if !h.decode(w, r, &in) {
			return
		}
		if fields := in.Validate(); len(fields) > 0 {
			h.writeError(w, http.StatusBadRequest, "VALIDATION_ERROR", "Data yang dikirim tidak valid.", fields)
			return
		}
		now := time.Now().UTC()
		e := model.Entity{
			ID:        id,
			Name:      strings.TrimSpace(in.Name),
			Type:      in.Type,
			Status:    in.Status,
			Latitude:  *in.Latitude,
			Longitude: *in.Longitude,
			UpdatedAt: now,
		}
		if err := h.repo.Update(r.Context(), e); err != nil {
			if errors.Is(err, store.ErrNotFound) {
				h.writeError(w, http.StatusNotFound, "NOT_FOUND", "Entitas tidak ditemukan.", nil)
				return
			}
			h.internal(w)
			return
		}
		updated, err := h.repo.Get(r.Context(), id)
		if err != nil {
			h.internal(w)
			return
		}
		h.writeJSON(w, http.StatusOK, updated)
	case http.MethodDelete:
		err := h.repo.Delete(r.Context(), id)
		if errors.Is(err, store.ErrNotFound) {
			h.writeError(w, http.StatusNotFound, "NOT_FOUND", "Entitas tidak ditemukan.", nil)
			return
		}
		if err != nil {
			h.internal(w)
			return
		}
		w.WriteHeader(http.StatusNoContent)
	default:
		w.Header().Set("Allow", "GET, PUT, DELETE")
		h.writeError(w, http.StatusMethodNotAllowed, "METHOD_NOT_ALLOWED", "Metode tidak diizinkan.", nil)
	}
}

func (h *Handler) decode(w http.ResponseWriter, r *http.Request, dst *model.Input) bool {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20)
	dec := json.NewDecoder(r.Body)
	dec.DisallowUnknownFields()
	if err := dec.Decode(dst); err != nil {
		h.writeError(w, http.StatusBadRequest, "INVALID_JSON", "Payload JSON tidak valid.", nil)
		return false
	}
	var extra any
	if err := dec.Decode(&extra); !errors.Is(err, io.EOF) {
		h.writeError(w, http.StatusBadRequest, "INVALID_JSON", "Payload harus berisi satu objek JSON.", nil)
		return false
	}
	return true
}

func (h *Handler) writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}

func (h *Handler) writeError(w http.ResponseWriter, status int, code, text string, fields map[string]string) {
	h.writeJSON(w, status, model.ErrorResponse{
		Error: model.APIError{
			Code:    code,
			Message: text,
			Fields:  fields,
		},
	})
}

func (h *Handler) internal(w http.ResponseWriter) {
	h.writeError(w, http.StatusInternalServerError, "INTERNAL_ERROR", "Terjadi kesalahan internal.", nil)
}

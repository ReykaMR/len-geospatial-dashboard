package main

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"leniot/backend/internal/handler"
	"leniot/backend/internal/model"
	"leniot/backend/internal/store"
)

func setupTestServer(t *testing.T) http.Handler {
	t.Helper()
	st, err := store.Open(":memory:")
	if err != nil {
		t.Fatalf("failed to open test store: %v", err)
	}
	t.Cleanup(func() { _ = st.Close() })

	h := handler.New(st)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)
	return mux
}

func ptr(value float64) *float64 {
	return &value
}

func TestValidate(t *testing.T) {
	valid := model.Input{Name: "Sensor", Type: "iot_device", Status: "active", Latitude: ptr(-6), Longitude: ptr(106)}
	if got := valid.Validate(); len(got) != 0 {
		t.Fatalf("valid input errors: %v", got)
	}
	valid.Name = "  "
	valid.Latitude = ptr(91)
	if got := valid.Validate(); got["name"] == "" || got["latitude"] == "" {
		t.Fatalf("expected field errors, got %v", got)
	}
	valid.Name = "Sensor"
	valid.Latitude = ptr(0)
	valid.Type = "unknown"
	if valid.Validate()["type"] == "" {
		t.Fatal("expected invalid type error")
	}
	valid.Type = "iot_device"
	valid.Longitude = nil
	if valid.Validate()["longitude"] == "" {
		t.Fatal("expected missing longitude error")
	}
}

func TestEntityCRUD(t *testing.T) {
	router := setupTestServer(t)

	body := []byte(`{"name":"  Sensor Jakarta  ","type":"iot_device","status":"active","latitude":-6.2,"longitude":106.8}`)
	create := httptest.NewRecorder()
	router.ServeHTTP(create, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewReader(body)))
	if create.Code != http.StatusCreated {
		t.Fatalf("create status %d: %s", create.Code, create.Body.String())
	}
	var created model.Entity
	if err := json.Unmarshal(create.Body.Bytes(), &created); err != nil {
		t.Fatal(err)
	}
	if created.Name != "Sensor Jakarta" {
		t.Fatalf("name not trimmed: %q", created.Name)
	}

	list := httptest.NewRecorder()
	router.ServeHTTP(list, httptest.NewRequest(http.MethodGet, "/api/v1/entities", nil))
	if list.Code != http.StatusOK || !bytes.Contains(list.Body.Bytes(), []byte(created.ID)) {
		t.Fatalf("list failed: %d %s", list.Code, list.Body.String())
	}

	updateBody := []byte(`{"name":"Sensor Bandung","type":"iot_device","status":"warning","latitude":-6.9,"longitude":107.6}`)
	update := httptest.NewRecorder()
	router.ServeHTTP(update, httptest.NewRequest(http.MethodPut, "/api/v1/entities/"+created.ID, bytes.NewReader(updateBody)))
	if update.Code != http.StatusOK || !bytes.Contains(update.Body.Bytes(), []byte("Sensor Bandung")) {
		t.Fatalf("update failed: %d %s", update.Code, update.Body.String())
	}

	getResponse := httptest.NewRecorder()
	router.ServeHTTP(getResponse, httptest.NewRequest(http.MethodGet, "/api/v1/entities/"+created.ID, nil))
	if getResponse.Code != http.StatusOK {
		t.Fatalf("get status %d", getResponse.Code)
	}

	deleteResponse := httptest.NewRecorder()
	router.ServeHTTP(deleteResponse, httptest.NewRequest(http.MethodDelete, "/api/v1/entities/"+created.ID, nil))
	if deleteResponse.Code != http.StatusNoContent {
		t.Fatalf("delete status %d", deleteResponse.Code)
	}

	missing := httptest.NewRecorder()
	router.ServeHTTP(missing, httptest.NewRequest(http.MethodGet, "/api/v1/entities/"+created.ID, nil))
	if missing.Code != http.StatusNotFound {
		t.Fatalf("missing status %d", missing.Code)
	}
}

func TestRejectInvalidJSONAndCoordinates(t *testing.T) {
	router := setupTestServer(t)

	badJSON := httptest.NewRecorder()
	router.ServeHTTP(badJSON, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString("{")))
	if badJSON.Code != http.StatusBadRequest {
		t.Fatalf("JSON status %d", badJSON.Code)
	}

	badCoord := httptest.NewRecorder()
	router.ServeHTTP(badCoord, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString(`{"name":"Sensor","type":"iot_device","status":"active","latitude":91,"longitude":10}`)))
	if badCoord.Code != http.StatusBadRequest {
		t.Fatalf("coordinate status %d", badCoord.Code)
	}

	unknown := httptest.NewRecorder()
	router.ServeHTTP(unknown, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString(`{"name":"Sensor","type":"iot_device","status":"active","latitude":0,"longitude":0,"extra":true}`)))
	if unknown.Code != http.StatusBadRequest {
		t.Fatalf("unknown field status %d", unknown.Code)
	}
}

func TestCanceledContextDoesNotHideError(t *testing.T) {
	st, err := store.Open(":memory:")
	if err != nil {
		t.Fatal(err)
	}
	defer st.Close()

	ctx, cancel := context.WithCancel(context.Background())
	cancel()
	_, err = st.List(ctx)
	if err == nil {
		t.Fatal("expected canceled database context")
	}
}

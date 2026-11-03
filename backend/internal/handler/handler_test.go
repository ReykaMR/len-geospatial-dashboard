package handler

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"len-geospatial-dashboard/backend/internal/store"
)

func newTestHandler(t *testing.T) (*Handler, http.Handler) {
	t.Helper()
	st, err := store.Open(":memory:")
	if err != nil {
		t.Fatalf("failed to open memory store: %v", err)
	}
	t.Cleanup(func() { _ = st.Close() })

	h := New(st)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)
	return h, mux
}

func TestHandler_CRUD(t *testing.T) {
	_, router := newTestHandler(t)

	// Create
	createBody := []byte(`{"name":"  Kapal Patroli  ","type":"vehicle","status":"active","latitude":-5.5,"longitude":105.3}`)
	createReq := httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewReader(createBody))
	createRec := httptest.NewRecorder()
	router.ServeHTTP(createRec, createReq)

	if createRec.Code != http.StatusCreated {
		t.Fatalf("create failed, status: %d body: %s", createRec.Code, createRec.Body.String())
	}
	if !bytes.Contains(createRec.Body.Bytes(), []byte(`"name":"Kapal Patroli"`)) {
		t.Fatalf("name not trimmed: %s", createRec.Body.String())
	}

	// List
	listReq := httptest.NewRequest(http.MethodGet, "/api/v1/entities", nil)
	listRec := httptest.NewRecorder()
	router.ServeHTTP(listRec, listReq)

	if listRec.Code != http.StatusOK {
		t.Fatalf("list failed, status: %d body: %s", listRec.Code, listRec.Body.String())
	}
	if !bytes.Contains(listRec.Body.Bytes(), []byte(`"Kapal Patroli"`)) {
		t.Fatalf("expected created entity in list: %s", listRec.Body.String())
	}

	// Extract created ID
	type entityJSON struct {
		ID string `json:"id"`
	}
	var created entityJSON
	if err := bytesToJSON(createRec.Body.Bytes(), &created); err != nil {
		t.Fatalf("decode created entity: %v", err)
	}

	// Get item
	getReq := httptest.NewRequest(http.MethodGet, "/api/v1/entities/"+created.ID, nil)
	getRec := httptest.NewRecorder()
	router.ServeHTTP(getRec, getReq)

	if getRec.Code != http.StatusOK {
		t.Fatalf("get item failed, status: %d", getRec.Code)
	}

	// Update item
	updateBody := []byte(`{"name":"Kapal Patroli Updated","type":"vehicle","status":"warning","latitude":-5.6,"longitude":105.4}`)
	updateReq := httptest.NewRequest(http.MethodPut, "/api/v1/entities/"+created.ID, bytes.NewReader(updateBody))
	updateRec := httptest.NewRecorder()
	router.ServeHTTP(updateRec, updateReq)

	if updateRec.Code != http.StatusOK {
		t.Fatalf("update failed, status: %d body: %s", updateRec.Code, updateRec.Body.String())
	}
	if !bytes.Contains(updateRec.Body.Bytes(), []byte(`Kapal Patroli Updated`)) {
		t.Fatalf("expected updated name: %s", updateRec.Body.String())
	}

	// Delete item
	delReq := httptest.NewRequest(http.MethodDelete, "/api/v1/entities/"+created.ID, nil)
	delRec := httptest.NewRecorder()
	router.ServeHTTP(delRec, delReq)

	if delRec.Code != http.StatusNoContent {
		t.Fatalf("delete failed, status: %d", delRec.Code)
	}

	// Verify not found after delete
	missingReq := httptest.NewRequest(http.MethodGet, "/api/v1/entities/"+created.ID, nil)
	missingRec := httptest.NewRecorder()
	router.ServeHTTP(missingRec, missingReq)

	if missingRec.Code != http.StatusNotFound {
		t.Fatalf("expected 404 after delete, got %d", missingRec.Code)
	}
}

func TestHandler_ValidationAndJSONErrors(t *testing.T) {
	_, router := newTestHandler(t)

	// Malformed JSON
	badJSON := httptest.NewRecorder()
	router.ServeHTTP(badJSON, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString("{")))
	if badJSON.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for malformed JSON, got %d", badJSON.Code)
	}

	// Extra trailing JSON
	extraJSON := httptest.NewRecorder()
	router.ServeHTTP(extraJSON, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString(`{}{} `)))
	if extraJSON.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for multiple JSON objects, got %d", extraJSON.Code)
	}

	// Unknown fields
	unknownField := httptest.NewRecorder()
	router.ServeHTTP(unknownField, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString(`{"name":"Sensor","type":"iot_device","status":"active","latitude":0,"longitude":0,"extra":true}`)))
	if unknownField.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for unknown field, got %d", unknownField.Code)
	}

	// Invalid latitude
	badCoord := httptest.NewRecorder()
	router.ServeHTTP(badCoord, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString(`{"name":"Sensor","type":"iot_device","status":"active","latitude":91,"longitude":10}`)))
	if badCoord.Code != http.StatusBadRequest {
		t.Fatalf("expected 400 for bad coordinate, got %d", badCoord.Code)
	}
}

func TestHandler_MethodNotAllowedAndNotFound(t *testing.T) {
	_, router := newTestHandler(t)

	// DELETE on collection
	rec1 := httptest.NewRecorder()
	router.ServeHTTP(rec1, httptest.NewRequest(http.MethodDelete, "/api/v1/entities", nil))
	if rec1.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 on DELETE collection, got %d", rec1.Code)
	}
	if rec1.Header().Get("Allow") != "GET, POST" {
		t.Fatalf("expected Allow: GET, POST, got %q", rec1.Header().Get("Allow"))
	}

	// POST on item
	rec2 := httptest.NewRecorder()
	router.ServeHTTP(rec2, httptest.NewRequest(http.MethodPost, "/api/v1/entities/some-id", nil))
	if rec2.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected 405 on POST item, got %d", rec2.Code)
	}
	if rec2.Header().Get("Allow") != "GET, PUT, DELETE" {
		t.Fatalf("expected Allow: GET, PUT, DELETE, got %q", rec2.Header().Get("Allow"))
	}

	// Invalid item path (extra slash)
	rec3 := httptest.NewRecorder()
	router.ServeHTTP(rec3, httptest.NewRequest(http.MethodGet, "/api/v1/entities/a/b", nil))
	if rec3.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for nested item path, got %d", rec3.Code)
	}

	// Empty item ID
	rec4 := httptest.NewRecorder()
	router.ServeHTTP(rec4, httptest.NewRequest(http.MethodGet, "/api/v1/entities/", nil))
	if rec4.Code != http.StatusNotFound {
		t.Fatalf("expected 404 for empty item ID, got %d", rec4.Code)
	}
}

func TestHandler_CORSAndHealth(t *testing.T) {
	_, router := newTestHandler(t)
	origin := "http://localhost:5173"
	handlerWithCORS := CORS(router, origin)

	// Preflight OPTIONS
	optionsReq := httptest.NewRequest(http.MethodOptions, "/api/v1/entities", nil)
	optionsReq.Header.Set("Origin", origin)
	optionsRec := httptest.NewRecorder()
	handlerWithCORS.ServeHTTP(optionsRec, optionsReq)

	if optionsRec.Code != http.StatusNoContent {
		t.Fatalf("expected 204 for OPTIONS, got %d", optionsRec.Code)
	}
	if optionsRec.Header().Get("Access-Control-Allow-Origin") != origin {
		t.Fatalf("expected CORS header matching origin, got %q", optionsRec.Header().Get("Access-Control-Allow-Origin"))
	}

	// Health check
	healthReq := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	healthRec := httptest.NewRecorder()
	router.ServeHTTP(healthRec, healthReq)

	if healthRec.Code != http.StatusOK {
		t.Fatalf("expected 200 for health, got %d", healthRec.Code)
	}
	if !bytes.Contains(healthRec.Body.Bytes(), []byte(`"status":"ok"`)) {
		t.Fatalf("expected status ok in body: %s", healthRec.Body.String())
	}
}

func bytesToJSON(data []byte, v any) error {
	return json.Unmarshal(data, v)
}

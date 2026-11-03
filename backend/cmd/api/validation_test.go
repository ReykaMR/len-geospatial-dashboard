package main

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestCreateRequiresCoordinates(t *testing.T) {
	router := setupTestServer(t)
	cases := []string{
		`{"name":"Sensor","type":"iot_device","status":"active","longitude":106.8}`,
		`{"name":"Sensor","type":"iot_device","status":"active","latitude":-6.2}`,
		`{"name":"Sensor","type":"iot_device","status":"active","latitude":null,"longitude":106.8}`,
	}
	for _, body := range cases {
		response := httptest.NewRecorder()
		router.ServeHTTP(response, httptest.NewRequest(http.MethodPost, "/api/v1/entities", bytes.NewBufferString(body)))
		if response.Code != http.StatusBadRequest {
			t.Fatalf("expected 400 for %s, got %d", body, response.Code)
		}
	}
}

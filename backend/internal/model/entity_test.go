package model

import (
	"math"
	"strings"
	"testing"
)

func floatPtr(v float64) *float64 {
	return &v
}

func TestValidate_Valid(t *testing.T) {
	in := Input{
		Name:      "Sensor Suhu",
		Type:      "iot_device",
		Status:    "active",
		Latitude:  floatPtr(-6.2),
		Longitude: floatPtr(106.8),
	}
	errs := in.Validate()
	if len(errs) != 0 {
		t.Fatalf("expected 0 errors, got: %v", errs)
	}
}

func TestValidate_NameRules(t *testing.T) {
	in := Input{
		Type:      "vehicle",
		Status:    "active",
		Latitude:  floatPtr(0),
		Longitude: floatPtr(0),
	}

	in.Name = ""
	if errs := in.Validate(); errs["name"] != "Nama wajib diisi." {
		t.Fatalf("expected empty name error, got %v", errs)
	}

	in.Name = "   "
	if errs := in.Validate(); errs["name"] != "Nama wajib diisi." {
		t.Fatalf("expected whitespace name error, got %v", errs)
	}

	in.Name = strings.Repeat("A", 121)
	if errs := in.Validate(); errs["name"] != "Nama maksimal 120 karakter." {
		t.Fatalf("expected max length error, got %v", errs)
	}

	in.Name = strings.Repeat("A", 120)
	if errs := in.Validate(); errs["name"] != "" {
		t.Fatalf("expected 120 chars valid, got %v", errs)
	}
}

func TestValidate_TypeRules(t *testing.T) {
	types := []string{"vehicle", "iot_device", "facility"}
	for _, tp := range types {
		in := Input{
			Name:      "Valid",
			Type:      tp,
			Status:    "active",
			Latitude:  floatPtr(0),
			Longitude: floatPtr(0),
		}
		if errs := in.Validate(); errs["type"] != "" {
			t.Fatalf("expected type %q valid, got %v", tp, errs)
		}
	}

	in := Input{
		Name:      "Valid",
		Type:      "unknown_type",
		Status:    "active",
		Latitude:  floatPtr(0),
		Longitude: floatPtr(0),
	}
	if errs := in.Validate(); errs["type"] != "Jenis entitas tidak dikenal." {
		t.Fatalf("expected unknown type error, got %v", errs)
	}
}

func TestValidate_StatusRules(t *testing.T) {
	statuses := []string{"active", "warning", "offline"}
	for _, st := range statuses {
		in := Input{
			Name:      "Valid",
			Type:      "vehicle",
			Status:    st,
			Latitude:  floatPtr(0),
			Longitude: floatPtr(0),
		}
		if errs := in.Validate(); errs["status"] != "" {
			t.Fatalf("expected status %q valid, got %v", st, errs)
		}
	}

	in := Input{
		Name:      "Valid",
		Type:      "vehicle",
		Status:    "invalid_status",
		Latitude:  floatPtr(0),
		Longitude: floatPtr(0),
	}
	if errs := in.Validate(); errs["status"] != "Status tidak dikenal." {
		t.Fatalf("expected unknown status error, got %v", errs)
	}
}

func TestValidate_Coordinates(t *testing.T) {
	base := Input{
		Name:   "Valid",
		Type:   "vehicle",
		Status: "active",
	}

	// Missing coordinates
	in := base
	if errs := in.Validate(); errs["latitude"] != "Latitude wajib diisi." || errs["longitude"] != "Longitude wajib diisi." {
		t.Fatalf("expected missing coordinate errors, got %v", errs)
	}

	// Invalid latitude
	invalidLats := []float64{-90.001, 90.001, math.NaN(), math.Inf(1), math.Inf(-1)}
	for _, lat := range invalidLats {
		in := base
		in.Latitude = floatPtr(lat)
		in.Longitude = floatPtr(0)
		if errs := in.Validate(); errs["latitude"] != "Latitude harus berupa angka finite antara -90 dan 90." {
			t.Fatalf("expected invalid latitude error for %v, got %v", lat, errs)
		}
	}

	// Invalid longitude
	invalidLons := []float64{-180.001, 180.001, math.NaN(), math.Inf(1), math.Inf(-1)}
	for _, lon := range invalidLons {
		in := base
		in.Latitude = floatPtr(0)
		in.Longitude = floatPtr(lon)
		if errs := in.Validate(); errs["longitude"] != "Longitude harus berupa angka finite antara -180 dan 180." {
			t.Fatalf("expected invalid longitude error for %v, got %v", lon, errs)
		}
	}
}

func TestNewID(t *testing.T) {
	id1, err := NewID()
	if err != nil {
		t.Fatalf("NewID failed: %v", err)
	}
	if len(id1) != 32 {
		t.Fatalf("expected 32 hex chars, got %d (%s)", len(id1), id1)
	}
	id2, err := NewID()
	if err != nil {
		t.Fatalf("NewID failed: %v", err)
	}
	if id1 == id2 {
		t.Fatal("expected distinct IDs")
	}
}

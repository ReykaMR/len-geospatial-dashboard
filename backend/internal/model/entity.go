package model

import (
	"crypto/rand"
	"encoding/hex"
	"math"
	"strings"
	"time"
)

type Entity struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Type      string    `json:"type"`
	Status    string    `json:"status"`
	Latitude  float64   `json:"latitude"`
	Longitude float64   `json:"longitude"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

type Input struct {
	Name      string   `json:"name"`
	Type      string   `json:"type"`
	Status    string   `json:"status"`
	Latitude  *float64 `json:"latitude"`
	Longitude *float64 `json:"longitude"`
}

type ErrorResponse struct {
	Error APIError `json:"error"`
}

type APIError struct {
	Code    string            `json:"code"`
	Message string            `json:"message"`
	Fields  map[string]string `json:"fields,omitempty"`
}

func (in Input) Validate() map[string]string {
	fields := make(map[string]string)
	name := strings.TrimSpace(in.Name)
	if name == "" {
		fields["name"] = "Nama wajib diisi."
	} else if len([]rune(name)) > 120 {
		fields["name"] = "Nama maksimal 120 karakter."
	}

	if in.Type != "vehicle" && in.Type != "iot_device" && in.Type != "facility" {
		fields["type"] = "Jenis entitas tidak dikenal."
	}

	if in.Status != "active" && in.Status != "warning" && in.Status != "offline" {
		fields["status"] = "Status tidak dikenal."
	}

	if in.Latitude == nil {
		fields["latitude"] = "Latitude wajib diisi."
	} else if math.IsNaN(*in.Latitude) || math.IsInf(*in.Latitude, 0) || *in.Latitude < -90 || *in.Latitude > 90 {
		fields["latitude"] = "Latitude harus berupa angka finite antara -90 dan 90."
	}

	if in.Longitude == nil {
		fields["longitude"] = "Longitude wajib diisi."
	} else if math.IsNaN(*in.Longitude) || math.IsInf(*in.Longitude, 0) || *in.Longitude < -180 || *in.Longitude > 180 {
		fields["longitude"] = "Longitude harus berupa angka finite antara -180 dan 180."
	}

	return fields
}

func Validate(in Input) map[string]string {
	return in.Validate()
}

func NewID() (string, error) {
	id := make([]byte, 16)
	if _, err := rand.Read(id); err != nil {
		return "", err
	}
	return hex.EncodeToString(id), nil
}

package main

import (
	"log"
	"net/http"
	"os"
	"time"

	"len-geospatial-dashboard/backend/internal/handler"
	"len-geospatial-dashboard/backend/internal/store"
)

func main() {
	path := os.Getenv("DATABASE_PATH")
	if path == "" {
		path = "./data/entities.db"
	}

	st, err := store.Open(path)
	if err != nil {
		log.Fatal(err)
	}
	defer st.Close()

	h := handler.New(st)
	mux := http.NewServeMux()
	h.RegisterRoutes(mux)

	address := os.Getenv("API_ADDR")
	if address == "" {
		address = ":8080"
	}
	origin := os.Getenv("FRONTEND_ORIGIN")
	if origin == "" {
		origin = "http://localhost:5173"
	}

	server := &http.Server{
		Addr:              address,
		Handler:           handler.CORS(mux, origin),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("API listening on %s", address)
	log.Fatal(server.ListenAndServe())
}

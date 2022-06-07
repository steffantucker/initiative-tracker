package handlers

import "net/http"

func NewRoom(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"res":"goop"}`))
}

func GetRoom(w http.ResponseWriter, r *http.Request) {}

package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/steffantucker/initiative-tracker/actors"
)

var combatents actors.Actors

func turnSSEHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	w.Header().Set("Connection", "keep-alive")

	fmt.Fprintf(w, "data: %v\n\n", combatents.Current().JSON())
}

func main() {
	combatents.New()

	http.Handle("/", http.FileServer(http.Dir("www")))
	http.HandleFunc("/public", turnSSEHandler)
	http.HandleFunc("/next", nextHandler)
	http.HandleFunc("/new", newHandler)
	http.HandleFunc("/get", getHandler)
	http.HandleFunc("/end", endHandler)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

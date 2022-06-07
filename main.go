package main

import (
	"log"
	"net/http"

	"github.com/steffantucker/initiative-tracker/handlers"
)

func main() {
	api := http.NewServeMux()
	api.HandleFunc("/newroom", handlers.NewRoom)
	api.HandleFunc("/getroom", handlers.GetRoom)

	http.Handle("/", http.FileServer(http.Dir("www")))
	http.Handle("/api", api)

	log.Fatal(http.ListenAndServe(":8080", nil))
}

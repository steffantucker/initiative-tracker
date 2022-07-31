package main

import (
	"flag"
	"net/http"

	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/handlers"
	"github.com/steffantucker/initiative-tracker/rooms"
	"github.com/steffantucker/initiative-tracker/uidgenerator"
	"github.com/steffantucker/initiative-tracker/users"
)

var addr = flag.String("address", ":8080", "address to serve on")
var debug = flag.Bool("debug", false, "enable debug logging")

func main() {
	flag.Parse()
	if *debug {
		log.SetLevel(log.DebugLevel)
	}
	gen := uidgenerator.NewShortCodeGenerator("")

	roomsInterface := rooms.NewRoomCodesCache(gen)
	userTokenGen := users.NewUserTokensCache(gen)

	http.Handle("/", http.FileServer(http.Dir("www")))
	http.Handle("/room/new", handlers.NewRoomHandler(roomsInterface, userTokenGen))
	http.Handle("/room/join", handlers.JoinRoomHandler(roomsInterface, userTokenGen))
	http.Handle("/ws", handlers.WebsocketHandler(roomsInterface, userTokenGen))

	log.WithField("address", *addr).Info("Starting server")
	log.Fatal(http.ListenAndServe(*addr, nil))
}

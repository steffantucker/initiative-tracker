package main

import (
	"flag"
	"net/http"

	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/handlers"
	"github.com/steffantucker/initiative-tracker/rooms"
	"github.com/steffantucker/initiative-tracker/users"
)

var addr = flag.String("address", ":8080", "address to serve on")
var debug = flag.Bool("debug", false, "enable debug logging")

func main() {
	flag.Parse()
	if *debug {
		log.SetLevel(log.DebugLevel)
	}

	roomCodeGen := rooms.NewRoomCodesCache()
	userTokenGen := users.NewUserTokensCache()

	http.Handle("/", http.FileServer(http.Dir("www")))
	http.Handle("/newroom", handlers.RoomsHandler(roomCodeGen, userTokenGen))
	http.Handle("/ws", handlers.WebsocketHandler(roomCodeGen, userTokenGen))

	log.WithField("address", *addr).Info("Starting server")
	log.Fatal(http.ListenAndServe(*addr, nil))
}

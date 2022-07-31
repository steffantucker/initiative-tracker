package handlers

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/steffantucker/initiative-tracker/rooms"
	"github.com/steffantucker/initiative-tracker/users"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

func WebsocketHandler(roomsList rooms.RoomsContainer, tokens users.UserTokens) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		code := r.FormValue("code")
		token := r.Header.Get("X-Token")

		if code == "" || token == "" {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		valid := tokens.ValidToken(users.UserToken(token))
		room := roomsList.GetRoom(rooms.RoomCode(code))
		if room == nil || !valid {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		room.AddPlayerConnection(users.UserToken(token), conn)
	}
}

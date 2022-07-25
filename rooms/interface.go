package rooms

import (
	"github.com/gorilla/websocket"
	"github.com/steffantucker/initiative-tracker/users"
)

type (
	RoomCode string

	Room struct {
		Code       RoomCode
		Players    map[*Player]bool
		Register   chan *Player
		Unregister chan *Player
		Broadcast  chan []byte
	}

	Player struct {
		token      users.UserToken
		playerType users.UserType

		room *Room
		conn *websocket.Conn
		send chan []byte
	}
)

type RoomsContainer interface {
	NewRoom() Room
	RemoveRoom(RoomCode)
	ValidRoom(RoomCode) bool
	GetRoom(RoomCode) *Room
}

func (r *Room) Run() {

}

func (r *Room) AddPlayerConnection(token users.UserToken, conn *websocket.Conn) {
	p := &Player{
		token:      token,
		playerType: "",
		room:       r,
		conn:       &websocket.Conn{},
		send:       make(chan []byte),
	}

	r.Register <- p
}

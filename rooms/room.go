package rooms

import (
	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/users"
)

type (
	Room struct {
		Code    RoomCode
		DMToken users.UserToken
		// All connected players and their WS connection
		DM      *Player
		Players map[*Player]bool
		// Channel to register new players to the room
		Register chan *Player
		// Channel to unregister players from the room
		Unregister chan *Player
		// Incoming messages to parse
		Messages chan interface{}
	}
)

func NewRoom(code RoomCode) *Room {
	return &Room{
		Code:       code,
		Players:    map[*Player]bool{},
		Register:   make(chan *Player),
		Unregister: make(chan *Player),
		Messages:   make(chan interface{}),
	}
}

func (r *Room) Run() {
	log.WithField("code", r.Code).Debug("Starting room")

	for {
		select {
		case p := <-r.Register:
			if p.token == r.DMToken {
				r.DM = p
			} else {
				r.Players[p] = true
			}
		case p := <-r.Unregister:
			close(p.send)
			if p == r.DM {
				r.DM = nil
			} else {
				delete(r.Players, p)
			}
			if len(r.Players) == 0 && r.DM == nil {
				return
			}
		case m := <-r.Messages:
			log.Debug(m)
			for p := range r.Players {
				p.send <- m
			}
			r.DM.send <- m
		}
	}

}

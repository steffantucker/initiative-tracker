package rooms

import (
	"math/rand"
	"strings"
	"sync"
	"time"

	log "github.com/sirupsen/logrus"
)

type (
	Rooms struct {
		rooms map[RoomCode]*Room
		m     sync.Mutex
	}
)

const (
	codeLength = 4
	key        = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
)

func NewRoomCodesCache() *Rooms {
	return &Rooms{rooms: make(map[RoomCode]*Room)}
}

func (r *Rooms) NewRoom() Room {
	r.m.Lock()
	code := newCode()
	_, ok := r.rooms[code]
	for ok {
		code = newCode()
		_, ok = r.rooms[code]
	}

	newRoom := &Room{
		Code:       code,
		Players:    map[*Player]bool{},
		Register:   make(chan *Player),
		Unregister: make(chan *Player),
		Broadcast:  make(chan []byte),
	}
	r.rooms[code] = newRoom
	r.m.Unlock()
	log.WithField("code", code).Debug("Generated room code")

	return *r.rooms[code]
}

func newCode() RoomCode {
	code := strings.Builder{}
	code.Grow(codeLength)
	rand.Seed(time.Hour.Nanoseconds())
	for i := 0; i < codeLength; i++ {
		r := rand.Intn(len(key))
		code.WriteByte(key[r])
	}
	return RoomCode(code.String())
}

func (r *Rooms) ValidRoom(room RoomCode) bool {
	r.m.Lock()
	_, valid := r.rooms[room]
	r.m.Unlock()

	log.WithFields(log.Fields{"code": room, "valid": valid}).Debug("Validated room code")

	return valid
}

func (r *Rooms) RemoveRoom(room RoomCode) {
	r.m.Lock()
	delete(r.rooms, room)
	r.m.Unlock()

	log.WithField("code", room).Debug("Removed room")
}

func (r *Rooms) GetRoom(code RoomCode) *Room {
	r.m.Lock()
	room, ok := r.rooms[code]
	r.m.Unlock()
	if !ok {
		return nil
	}
	return room
}

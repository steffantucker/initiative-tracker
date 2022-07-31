package rooms

import (
	"sync"

	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/uidgenerator"
)

type (
	Rooms struct {
		rooms map[RoomCode]*Room
		gen   uidgenerator.Generator
		m     sync.Mutex
	}
)

const ()

func NewRoomCodesCache(gen uidgenerator.Generator) *Rooms {
	return &Rooms{
		rooms: make(map[RoomCode]*Room),
		gen:   gen,
	}
}

func (r *Rooms) NewRoom() Room {
	r.m.Lock()
	code := RoomCode(r.gen.NewUID("r-"))
	_, ok := r.rooms[code]
	for ok {
		code = RoomCode(r.gen.NewUID("r-"))
		_, ok = r.rooms[code]
	}

	newRoom := NewRoom(code)
	r.rooms[code] = newRoom
	r.m.Unlock()
	log.WithField("code", code).Debug("Generated room code")

	return *r.rooms[code]
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

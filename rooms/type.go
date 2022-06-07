package rooms

import "github.com/steffantucker/initiative-tracker/actors"

type Room struct {
	Actors      actors.Actors
	Code        string
	Connections []chan string
}

// NewRoom initializes a room and returns it's code
func NewRoom() string {
	// TODO: create actually room key generation
	return "xKcD"
}

// ConnectToRoom adds a new connection to the
// list of connections for the room, and returns
// what would be necessary for the client to use
// to communicate with the room
func ConnectToRoom(code string) string {
	return "ws connection here"
}

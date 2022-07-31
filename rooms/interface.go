package rooms

type (
	RoomCode string
)

type RoomsContainer interface {
	NewRoom() Room
	RemoveRoom(RoomCode)
	ValidRoom(RoomCode) bool
	GetRoom(RoomCode) *Room
}

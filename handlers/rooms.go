package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/steffantucker/initiative-tracker/rooms"
	"github.com/steffantucker/initiative-tracker/users"
)

type NewRoomResponse struct {
	Code    string `json:"code"`
	DMToken string `json:"dmToken"`
}

func RoomsHandler(roomCodeGen rooms.RoomsContainer, dmTokenGen users.UserTokens) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		room := roomCodeGen.NewRoom()
		data := NewRoomResponse{
			Code:    string(room.Code),
			DMToken: string(dmTokenGen.NewDMToken()),
		}
		bytes, err := json.Marshal(data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(bytes)

		go room.Run()
	}
}

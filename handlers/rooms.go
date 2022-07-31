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

type JoinRoomResponse struct {
	Code  string `json:"code"`
	Token string `json:"token"`
}

func NewRoomHandler(roomCodeGen rooms.RoomsContainer, dmTokenGen users.UserTokens) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		room := roomCodeGen.NewRoom()
		dm := dmTokenGen.NewDMToken()
		room.DMToken = dm

		data := NewRoomResponse{
			Code:    string(room.Code),
			DMToken: string(dm),
		}
		bytes, err := json.Marshal(data)
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(bytes)

		go room.Run() //TODO: find way to remove room
	}
}

func JoinRoomHandler(roomsInterface rooms.RoomsContainer, tokenGen users.UserTokens) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		code := rooms.RoomCode(r.FormValue("code"))
		valid := roomsInterface.ValidRoom(code)
		if !valid {
			w.WriteHeader(http.StatusBadRequest)
			// TODO: return error
			return
		}

		token := tokenGen.NewToken()

		data, err := json.Marshal(JoinRoomResponse{Code: string(code), Token: string(token)})
		if err != nil {
			w.WriteHeader(http.StatusInternalServerError)
		}

		w.Write(data)
	}
}

package main

import (
	"encoding/json"
	"io/ioutil"
	"net/http"

	"github.com/steffantucker/initiative-tracker/actor"
)

func nextHandler(w http.ResponseWriter, r *http.Request) {
	combatents.NextTurn()
	w.Header().Set("Content-Type", "text/json")
	write, _ := json.Marshal(map[string]bool{"success": true})
	w.Write(write)
}

func newHandler(w http.ResponseWriter, r *http.Request) {
	newActor := actor.Actor{}
	body, _ := ioutil.ReadAll(r.Body)
	json.Unmarshal(body, &newActor)

	err := combatents.Add(newActor)
	var write []byte
	if err != nil {
		write, _ = json.Marshal(map[string]bool{"success": false})
	} else {
		write, _ = json.Marshal(map[string]bool{"success": true})
	}
	w.Write(write)
}

func getHandler(w http.ResponseWriter, r *http.Request) {
	w.Write(combatents.JSON())
}

func endHandler(w http.ResponseWriter, r *http.Request) {
	combatents.Clear()
	write, _ := json.Marshal(map[string]bool{"success": true})
	w.Write(write)
}

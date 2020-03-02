package actors

import (
	"encoding/json"
	"errors"

	"github.com/steffantucker/initiative-tracker/actor"
)

// Actors holds array of players and monsters
type Actors struct {
	actors []actor.Actor
	turn   int
}

// New instantiates the actors
func (a *Actors) New() {
	a.actors = []actor.Actor{}
	a.turn = 0
}

// Add to add an actor to the encounter
func (a Actors) Add(act actor.Actor) error {
	if len(a.actors) == 0 {
		a.actors = append(a.actors, act)
		return nil
	}

	for i, ac := range a.actors {
		if ac.Initiative > act.Initiative {
			continue
		}
		if ac.Initiative < act.Initiative {
			a.actors = append(a.actors[:i], append([]actor.Actor{act}, a.actors[i:]...)...)
			return nil
		}
	}

	return errors.New("can't add")
}

// Clear resets list to empty
func (a Actors) Clear() {
	a.actors = []actor.Actor{}
}

// Edit allows attributes to be updated, currently assumes same name
func (a Actors) Edit(name string, updated actor.Actor) error {
	for i, act := range a.actors {
		if act.Name == name {
			a.actors[i] = updated
			return nil
		}
	}
	return errors.New("can't update")
}

// NextTurn moves onto the next turn
func (a Actors) NextTurn() {
	i := a.turn + 1
	if i > len(a.actors) {
		i = 0
	}
	for !a.actors[i].IsDead() {
		i++
		if i > len(a.actors) {
			i = 0
		}
		if i == a.turn {
			break
		}
	}
	a.turn = i
}

// Current returns current turn actor
func (a Actors) Current() actor.Actor {
	return a.actors[a.turn]
}

//JSON returns actors as JSON
func (a Actors) JSON() []byte {
	data := map[string][]actor.Actor{"data": a.actors}
	jsn, _ := json.Marshal(data)
	return jsn
}

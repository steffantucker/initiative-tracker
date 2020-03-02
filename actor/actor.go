package actor

import (
	"encoding/json"
	"fmt"
)

// TODO: add ID, and use ID in map in Actors to quicken lookup

// Actor represents a player or monster
type Actor struct {
	Name       string
	Ac         float64
	Chealth    float64
	Mhealth    float64
	Initiative float64
	bgcolor    string
	textcolor  string
	Hidden     bool
}

// JSON returns actor as a JSON byte array
func (a Actor) JSON() []byte {
	jsn, err := json.Marshal(a)
	if err != nil {
		panic(fmt.Sprintf("can't marshal actor: %v", a))
	}
	return jsn
}

// IsDead returns whether actor is dead
func (a Actor) IsDead() bool {
	return a.Chealth >= 0
}

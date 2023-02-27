package turntracker

import (
	"container/list"
	"encoding/json"
	"errors"
	"fmt"
	"sync"

	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/uidgenerator"
)

type (
	Tracker struct {
		m          sync.Mutex
		turnOrder  *list.List
		current    *list.Element
		uidgen     uidgenerator.Generator
		RoundCount int     `json:"roundCounter"`
		OrderList  []Actor `json:"order"`
		Current    string  `json:"currentID"`
	}

	Actor struct {
		ID          string    `json:"id"`
		Name        string    `json:"name"`
		Initiative  int       `json:"initiative"`
		AC          int       `json:"ac"`
		HP          Hitpoints `json:"hp"`
		playerToken string
		//TODO: add visibility options
	}

	Hitpoints struct {
		Current int `json:"currenthp"`
		Max     int `json:"maxhp"`
		//TODO: add death options
	}
)

var ErrNotFound = errors.New("actor not found")
var ErrUnexpectedType = errors.New("unexpected type")

func NewTracker(gen uidgenerator.Generator) *Tracker {
	return &Tracker{
		turnOrder: list.New(),
		uidgen:    gen,
	}
}

func (t *Tracker) MarshalJSON() ([]byte, error) {
	actors := make([]Actor, 0, t.turnOrder.Len())
	actors = append(actors, t.current.Value.(Actor))
	for a := t.current.Next(); a != t.current; a = a.Next() {
		if a == nil {
			a = t.turnOrder.Front()
		}
		actors = append(actors, a.Value.(Actor))
	}

	t.OrderList = actors
	t.Current = t.current.Value.(Actor).ID
	return json.Marshal(t)
}

func (t *Tracker) UnmarshallJSON(data []byte) error {
	var nt *Tracker
	err := json.Unmarshal(data, &nt)
	if err != nil {
		return err
	}
	nl := list.New()
	for _, v := range nt.OrderList {
		e := nl.PushBack(v)
		if v.ID == nt.Current {
			nt.current = e
		}
	}
	nt.turnOrder = nl
	if nt.current == nil {
		nt.current = nt.turnOrder.Front()
	}
	return nil
}

func (t *Tracker) Next() string {
	t.m.Lock()
	defer t.m.Unlock()
	la := t.current.Next()
	if la == nil {
		la = t.turnOrder.Front()
		t.RoundCount++
	}
	t.current = la
	return la.Value.(Actor).ID
}

func (t *Tracker) NextManual(id string) error {
	a := t.findActor(id)
	if a == nil {
		return fmt.Errorf("%w %s", ErrNotFound, id)
	}
	t.current = a
	return nil
}

func (t *Tracker) GetCurrent() Actor {
	return t.current.Value.(Actor)
}

func (t *Tracker) Reset() {
	t.m.Lock()
	defer t.m.Unlock()
	t.current = t.turnOrder.Front()
}

func (t *Tracker) Clear() {
	t.m.Lock()
	defer t.m.Unlock()
	t.turnOrder.Init()
}

func (t *Tracker) ActorCount() int {
	return t.turnOrder.Len()
}

func (t *Tracker) GetActorByID(id string) Actor {
	e := t.findActor(id)
	if e != nil {
		return e.Value.(Actor)
	}
	return Actor{}
}

func (t *Tracker) AddActor(actor Actor) string {
	actor.ID = t.uidgen.NewUID("a-")
	t.m.Lock()
	defer t.m.Unlock()
	if t.turnOrder.Len() == 0 {
		t.current = t.turnOrder.PushFront(actor)
		return actor.ID
	}
	la := t.turnOrder.Front()
	a := la.Value.(Actor)
	for {
		if a.AC < actor.AC {
			t.turnOrder.InsertBefore(actor, la)
			return actor.ID
		}
		la = la.Next()
		if la == nil {
			t.turnOrder.PushBack(actor)
			return actor.ID
		}
		a = la.Value.(Actor)
	}
}

func (t *Tracker) UpdateActor(id string, changes map[string]any) error {
	a := t.findActor(id)
	if a == nil {
		return fmt.Errorf("%w %s", ErrNotFound, id)
	}
	actor := a.Value.(Actor)
	needReorder := false
	for n, v := range changes {
		switch n {
		case "name":
			value, ok := v.(string)
			if !ok {
				return fmt.Errorf("%w for name: expected string got %T", ErrUnexpectedType, v)
			}
			actor.Name = value
		case "initiative":
			value, ok := v.(int)
			if !ok {
				return fmt.Errorf("%w for initiative: expected int got %T", ErrUnexpectedType, v)
			}
			if actor.Initiative != value {
				actor.Initiative = value
				needReorder = true
			}
		case "ac":
			value, ok := v.(int)
			if !ok {
				return fmt.Errorf("%w for ac: expected int got %T", ErrUnexpectedType, v)
			}
			actor.AC = value
		case "currenthp":
			value, ok := v.(int)
			if !ok {
				return fmt.Errorf("%w for current HP: expected int got %T", ErrUnexpectedType, v)
			}
			actor.HP.Current = value
		case "maxhp":
			value, ok := v.(int)
			if !ok {
				return fmt.Errorf("%w for max HP: expected int got %T", ErrUnexpectedType, v)
			}
			actor.HP.Max = value
		default:
			log.WithFields(log.Fields{"name": n, "value": v}).Debug("received unexpected update data")
		}
	}
	t.m.Lock()
	a.Value = actor
	t.m.Unlock()
	if needReorder {
		t.reorder(a)
	}
	return nil
}

func (t *Tracker) RemoveActor(id string) error {
	a := t.findActor(id)
	if a == nil {
		return fmt.Errorf("%w %s", ErrNotFound, id)
	}
	t.m.Lock()
	defer t.m.Unlock()
	t.turnOrder.Remove(a)
	return nil
}

func (t *Tracker) findActor(id string) *list.Element {
	t.m.Lock()
	defer t.m.Unlock()
	la := t.turnOrder.Front()
	a := la.Value.(Actor)
	for {
		if a.ID == id {
			return la
		}
		la = la.Next()
		if la == nil {
			return nil
		}
		a = la.Value.(Actor)
	}
}

func (t *Tracker) reorder(nla *list.Element) {
	t.m.Lock()
	defer t.m.Unlock()
	actor := nla.Value.(Actor)
	la := t.turnOrder.Front()
	a := la.Value.(Actor)
	for {
		if a.AC < actor.AC {
			t.turnOrder.MoveBefore(nla, la)
			return
		}
		la = la.Next()
		if la == nil {
			t.turnOrder.MoveToBack(nla)
			return
		}
		a = la.Value.(Actor)
	}
}

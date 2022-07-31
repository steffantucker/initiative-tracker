package turntracker

import (
	"container/list"
	"encoding/json"
	"fmt"
	"sync"

	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/uidgenerator"
)

type (
	Tracker struct {
		m         sync.Mutex
		turnOrder *list.List
		current   *list.Element
		uidgen    uidgenerator.Generator
		TurnCount int     `json:"turnCounter"`
		OrderList []Actor `json:"order"`
		Current   string  `json:"currentID"`
	}

	Actor struct {
		ID          string    `json:"id"`
		Name        string    `json:"name"`
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
		t.TurnCount++
	}
	t.current = la
	return la.Value.(Actor).ID
}

func (t *Tracker) NextManual(id string) error {
	a := t.findActor(id)
	if a == nil {
		return fmt.Errorf("unable to find id %s", id)
	}
	t.current = a
	return nil
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

func (t *Tracker) AddActor(name string, ac, currhp, maxhp int, token string) error {
	actor := Actor{
		ID:   t.uidgen.NewUID("a-"),
		Name: name,
		AC:   ac,
		HP: Hitpoints{
			Current: currhp,
			Max:     maxhp,
		},
		playerToken: token,
	}
	t.m.Lock()
	defer t.m.Unlock()
	if t.turnOrder.Len() == 0 {
		t.current = t.turnOrder.PushFront(actor)
		return nil
	}
	la := t.turnOrder.Front()
	a := la.Value.(Actor)
	for {
		if a.AC < actor.AC {
			t.turnOrder.InsertBefore(actor, la)
			return nil
		}
		la = la.Next()
		if la == nil {
			t.turnOrder.PushBack(actor)
			return nil
		}
		a = la.Value.(Actor)
	}
}

func (t *Tracker) UpdateActor(id string, changes map[string]any) error {
	a := t.findActor(id)
	if a == nil {
		return fmt.Errorf("unable to find id %s", id)
	}
	actor := a.Value.(Actor)
	t.m.Lock()
	for n, v := range changes {
		switch n {
		case "name":
			value, ok := v.(string)
			if !ok {
				return fmt.Errorf("unexpected type for name: expected string got %T", v)
			}
			actor.Name = value
		case "ac":
			value, ok := v.(int)
			if !ok {
				return fmt.Errorf("unexpected type for name: expected int got %T", v)
			}
			actor.AC = value
			t.reorder(a)
		case "currenthp":
			value, ok := v.(int)
			if !ok {
				return fmt.Errorf("unexpected type for name: expected int got %T", v)
			}
			actor.HP.Current = value
		case "maxhp":
			value, ok := v.(int)
			if !ok {
				return fmt.Errorf("unexpected type for name: expected int got %T", v)
			}
			actor.HP.Max = value
		default:
			log.WithFields(log.Fields{"name": n, "value": v}).Debug("received unexpected update data")
		}
	}
	t.m.Unlock()
	return nil
}

func (t *Tracker) RemoveActor(id string) error {
	a := t.findActor(id)
	if a == nil {
		return fmt.Errorf("unable to find id %s", id)
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

package rooms

import (
	"encoding/json"
	"errors"

	turntracker "github.com/steffantucker/initiative-tracker/turnTracker"
)

var (
	ErrNotImplemented = errors.New("not implemented")
	ErrBadData        = errors.New("bad data")
	ErrNoID           = errors.New("no id provided")
)

type (
	Message struct {
		Type     string      `json:"type"`
		Function string      `json:"function"`
		Data     interface{} `json:"data"`
	}

	MessageProcessor struct {
		TurnTracker *turntracker.Tracker
	}
)

/*
Types:
	Actor:
		New:
			Adds a new actor to the turn order
		Update:
			Changes an actor's properties
		Remove:
			Removes an actor from the turn order
	Turn:
		Restart:
			Restarts the turn order from the top of the round
		Next:
			Moves turn order to the next actor
		Previous:
			Moves turn order to the previous actor
		MoveTo:
			Makes provided actor the current turn
*/

func NewMessageProcessor(tracker *turntracker.Tracker) MessageProcessor {
	return MessageProcessor{
		TurnTracker: tracker,
	}
}

func (m MessageProcessor) Process(bytes []byte) error {
	var message Message
	err := json.Unmarshal(bytes, &message)
	if err != nil {
		return err
	}

	switch message.Type {
	case "Actor":
		m.processActorMessage(message.Function, message.Data)
	case "Turn":
		m.proccessTurnMessage(message.Function, message.Data)
	}
	return nil
}

func (m MessageProcessor) processActorMessage(function string, data any) error {
	switch function {
	case "New":
		actor, ok := data.(turntracker.Actor)
		if !ok {
			return ErrBadData
		}
		m.TurnTracker.AddActor(actor)
		return nil
	case "Update":
		updates, ok := data.(map[string]any)
		if !ok {
			return ErrBadData
		}
		id, ok := updates["id"].(string)
		if !ok {
			return ErrNoID
		}
		return m.TurnTracker.UpdateActor(id, updates)
	case "Remove":

	}
	return ErrNotImplemented
}

func (m MessageProcessor) proccessTurnMessage(function string, data any) error {
	switch function {
	case "Restart":
	case "Next":
	case "Previous":
	case "MoveTo":
	}
	return ErrNotImplemented
}

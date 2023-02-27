package turntracker_test

import (
	"encoding/base64"
	"errors"
	"fmt"
	"math/rand"
	"testing"

	turntracker "github.com/steffantucker/initiative-tracker/turnTracker"
	"github.com/steffantucker/initiative-tracker/uidgenerator"
)

func TestJSON(t *testing.T) {
	tracker := turntracker.NewTracker(uidgenerator.NewShortCodeGenerator(""))

	actor := turntracker.Actor{
		Name:       "testactor",
		Initiative: 10,
		AC:         10,
		HP: turntracker.Hitpoints{
			Current: 40,
			Max:     40,
		},
	}

	actorID := tracker.AddActor(actor)
	actor = tracker.GetActorByID(actorID)

	data, err := tracker.MarshalJSON()
	if err != nil {
		t.Fatal("unexpected Marshal error", err)
	}

	newtracker := turntracker.NewTracker(uidgenerator.NewShortCodeGenerator(""))
	err = newtracker.UnmarshallJSON(data)
	if err != nil {
		t.Fatal("unexpected Unmarshal error", err)
	}

	newactor := newtracker.GetActorByID(actorID)
	if newactor != actor {
		t.Fatal("did not Unmarshal as expected", newactor)
	}
}

func TestActors(t *testing.T) {
	tracker := turntracker.NewTracker(uidgenerator.NewShortCodeGenerator(""))

	actor := turntracker.Actor{
		Name:       "testactor",
		Initiative: 10,
		AC:         10,
		HP: turntracker.Hitpoints{
			Current: 40,
			Max:     40,
		},
	}

	actorID := tracker.AddActor(actor)
	actor.ID = actorID
	nactor := tracker.GetActorByID(actorID)
	if nactor != actor {
		t.Fatal("Got unexpected actor")
	}

	emptyactor := turntracker.Actor{}
	if tracker.GetActorByID("badid") != emptyactor {
		t.Fatal("Got an actor with bad ID")
	}

	tracker.Clear()
	if tracker.ActorCount() > 0 {
		t.Fatal("Actor list not cleared")
	}
}

func TestActorOrder(t *testing.T) {
	tracker := turntracker.NewTracker(uidgenerator.NewShortCodeGenerator(""))

	actor := turntracker.Actor{
		Name:       "testactor",
		Initiative: 10,
		AC:         10,
		HP: turntracker.Hitpoints{
			Current: 40,
			Max:     40,
		},
	}
	lowerACactor := turntracker.Actor{
		Name:       "testactor",
		Initiative: 10,
		AC:         8,
		HP: turntracker.Hitpoints{
			Current: 40,
			Max:     40,
		},
	}
	higherACactor := turntracker.Actor{
		Name:       "testactor",
		Initiative: 10,
		AC:         12,
		HP: turntracker.Hitpoints{
			Current: 40,
			Max:     40,
		},
	}
	actorID := tracker.AddActor(actor)

	if tracker.ActorCount() != 1 {
		t.Fatal("Actor list is a different size than expected")
	}

	higherACID := tracker.AddActor(higherACactor)
	lowerACID := tracker.AddActor(lowerACactor)

	tracker.Reset()

	if tracker.GetCurrent().ID != higherACID {
		t.Fatal("Incorrect order", higherACactor.ID, tracker.Current)
	}

	err := tracker.NextManual(actorID)
	if err != nil {
		t.Fatal("Got unexpected error on next manual", err)
	}
	if tracker.GetCurrent().ID != actorID {
		t.Fatal("Didn't change current manually")
	}

	err = tracker.NextManual("badid")
	if !errors.Is(err, turntracker.ErrNotFound) {
		t.Fatal("Expected not found error, got nil")
	}

	if n := tracker.Next(); n != lowerACID {
		t.Fatal("Next actor was not the expected actor", n)
	}

	currentCount := tracker.RoundCount
	_ = tracker.Next()
	if tracker.RoundCount != currentCount+1 {
		t.Fatal("Expected round count increase")
	}

	err = tracker.RemoveActor(lowerACID)
	if err != nil {
		t.Fatal("Got unexpected error removing actor", err)
	}
	if tracker.ActorCount() != 2 {
		t.Fatal("Actor not removed")
	}

	err = tracker.RemoveActor("badid")
	if !errors.Is(err, turntracker.ErrNotFound) {
		t.Fatal("Expected error on removing actor with id=badid")
	}

	tracker.Clear()
	if tracker.ActorCount() > 0 {
		t.Fatal("Actor list not cleared")
	}
}

func TestUpdateActor(t *testing.T) {
	tracker := turntracker.NewTracker(uidgenerator.NewShortCodeGenerator(""))

	actor := turntracker.Actor{
		Name:       "testactor",
		Initiative: 10,
		AC:         10,
		HP: turntracker.Hitpoints{
			Current: 40,
			Max:     40,
		},
	}
	actorID := tracker.AddActor(actor)
	generateTracker(tracker, 10)

	finalActor := turntracker.Actor{
		Name:       "Grog",
		Initiative: 1,
		AC:         22,
		HP: turntracker.Hitpoints{
			Current: 7,
			Max:     44,
		},
	}
	finalActor.ID = actorID

	type args struct {
		id      string
		changes map[string]any
	}
	tests := []struct {
		name      string
		args      args
		wantErr   bool
		wantedErr error
	}{
		{
			name: "Nonexistent actor",
			args: args{
				id:      "badid",
				changes: map[string]any{},
			},
			wantErr:   true,
			wantedErr: turntracker.ErrNotFound,
		},
		{
			name: "Bad name type",
			args: args{
				id:      actorID,
				changes: map[string]any{"name": 4},
			},
			wantErr:   true,
			wantedErr: turntracker.ErrUnexpectedType,
		},
		{
			name: "Bad initiative type",
			args: args{
				id:      actorID,
				changes: map[string]any{"initiative": "13"},
			},
			wantErr:   true,
			wantedErr: turntracker.ErrUnexpectedType,
		},
		{
			name: "Bad AC type",
			args: args{
				id:      actorID,
				changes: map[string]any{"ac": "13"},
			},
			wantErr:   true,
			wantedErr: turntracker.ErrUnexpectedType,
		},
		{
			name: "Bad current HP type",
			args: args{
				id:      actorID,
				changes: map[string]any{"currenthp": "13"},
			},
			wantErr:   true,
			wantedErr: turntracker.ErrUnexpectedType,
		},
		{
			name: "Bad maxhp type",
			args: args{
				id:      actorID,
				changes: map[string]any{"maxhp": "13"},
			},
			wantErr:   true,
			wantedErr: turntracker.ErrUnexpectedType,
		},
		{
			name: "Bad field",
			args: args{
				id:      actorID,
				changes: map[string]any{"badfield": "aaargg"},
			},
			wantErr:   false,
			wantedErr: nil,
		},
		{
			name: "Change name",
			args: args{
				id:      actorID,
				changes: map[string]any{"name": "Grog"},
			},
			wantErr:   false,
			wantedErr: nil,
		},
		{
			name: "Change initiative",
			args: args{
				id:      actorID,
				changes: map[string]any{"initiative": 1},
			},
			wantErr:   false,
			wantedErr: nil,
		},
		{
			name: "Change ac",
			args: args{
				id:      actorID,
				changes: map[string]any{"ac": 22},
			},
			wantErr:   false,
			wantedErr: nil,
		},
		{
			name: "Change currenthp",
			args: args{
				id:      actorID,
				changes: map[string]any{"currenthp": 7},
			},
			wantErr:   false,
			wantedErr: nil,
		},
		{
			name: "Change maxhp",
			args: args{
				id:      actorID,
				changes: map[string]any{"maxhp": 44},
			},
			wantErr:   false,
			wantedErr: nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tracker.UpdateActor(tt.args.id, tt.args.changes)
			if tt.wantErr && !errors.Is(err, tt.wantedErr) {
				t.Errorf("Tracker.UpdateActor() got unexpected error = %v", err)
			} else if !tt.wantErr && err != nil {
				t.Errorf("Tracker.UpdateActor() didn't want error = %v", err)
			}
		})
	}
	changedActor := tracker.GetActorByID(actorID)
	if changedActor != finalActor {
		t.Fatal("Actor did not change as expected", changedActor)
	}
}

func generateTracker(t *turntracker.Tracker, length int) {
	for i := 0; i < length; i++ {
		chp := rand.Intn(40)
		actor := turntracker.Actor{
			Name:       base64.StdEncoding.EncodeToString([]byte(fmt.Sprint(rand.Uint64()))),
			Initiative: rand.Intn(24),
			AC:         rand.Intn(22),
			HP: turntracker.Hitpoints{
				Current: chp,
				Max:     chp + rand.Intn(5),
			},
		}
		t.AddActor(actor)
	}
}

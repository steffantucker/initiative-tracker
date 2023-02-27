package rooms

import (
	"time"

	"github.com/gorilla/websocket"
	"github.com/sirupsen/logrus"
	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/users"
)

const (
	messageSize = 512
	pongTime    = 60 * time.Second
	pingPeriod  = (pongTime * 9) / 10
	writeTime   = 10 * time.Second
)

type (
	Player struct {
		token      users.UserToken
		playerType users.UserType

		room *Room
		conn *websocket.Conn
		send chan interface{}
	}
)

func (r *Room) AddPlayerConnection(token users.UserToken, conn *websocket.Conn) {
	p := &Player{
		token: token,
		room:  r,
		conn:  conn,
		send:  make(chan interface{}),
	}

	r.Register <- p

	go p.Run()
}

func (p *Player) Run() {
	go p.readPump()
	go p.writePump()
}

func (p *Player) readPump() {
	defer func() {
		p.room.Unregister <- p
		p.conn.Close()
	}()

	p.conn.SetReadLimit(messageSize)
	p.conn.SetReadDeadline(time.Now().Add(pongTime))
	p.conn.SetPongHandler(func(string) error { p.conn.SetReadDeadline(time.Now().Add(pongTime)); return nil })

	for {
		var m interface{}
		err := p.conn.ReadJSON(&m)
		logrus.Debug("Received message", m)
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.WithFields(log.Fields{"code": p.room.Code, "token": p.token}).Warn("unexpected ws closure")
			}
			log.Warn(err)
			break
		}

		p.room.Messages <- m
	}
}

func (p *Player) writePump() {
	t := time.NewTicker(pingPeriod)

	defer func() {
		t.Stop()
		p.conn.Close()
	}()

	for {
		select {
		case <-t.C:
			if err := p.conn.WriteControl(websocket.PingMessage, []byte{}, time.Now().Add(writeTime)); err != nil {
				return
			}
		case m, ok := <-p.send:
			p.conn.SetWriteDeadline(time.Now().Add(writeTime))
			if !ok {
				p.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			err := p.conn.WriteJSON(m)
			if err != nil {
				return
			}

			n := len(p.send)
			for i := 0; i < n; i++ {
				p.conn.WriteJSON(<-p.send)
			}
		}
	}
}

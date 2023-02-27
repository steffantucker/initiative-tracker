package uidgenerator

import (
	"math/rand"
	"strings"
	"time"
)

type (
	Generator interface {
		NewUID(string) string
		NewUIDWithLength(int, string) string
	}
	ShortCodeGenerator struct {
		usedCodes map[string]bool
		key       string
	}
)

const (
	defaultkey = "123456789ABCDEFGHLJKMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
)

func NewShortCodeGenerator(key string) Generator {
	if key == "" {
		key = defaultkey
	}

	rand.Seed(int64(time.Now().Nanosecond()))

	return &ShortCodeGenerator{
		usedCodes: make(map[string]bool),
		key:       key,
	}
}

func (g *ShortCodeGenerator) NewUID(pre string) string {
	return g.NewUIDWithLength(4, pre)
}

func (g *ShortCodeGenerator) NewUIDWithLength(l int, pre string) string {
	token := pre + generateUID(l, g.key)
	_, ok := g.usedCodes[token]
	for ok {
		token = pre + generateUID(l, g.key)
		_, ok = g.usedCodes[token]
	}
	g.usedCodes[token] = true
	return token
}

func generateUID(l int, key string) string {
	token := strings.Builder{}
	token.Grow(l)
	for i := 0; i < l; i++ {
		r := rand.Intn(len(key))
		token.WriteByte(key[r])
	}
	return token.String()
}

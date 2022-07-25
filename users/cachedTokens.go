package users

import (
	"math/rand"
	"strings"
	"sync"

	log "github.com/sirupsen/logrus"
)

type (
	UserTokensCache struct {
		tokens map[UserToken]*user
		m      sync.Mutex
	}

	user struct {
		token    UserToken
		userType UserType
	}
)

const (
	tokenLength = 7
	key         = "123456789ABCDEFGHLJKMNPQRSTUVWXYZ"
)

func NewUserTokensCache() *UserTokensCache {
	return &UserTokensCache{
		tokens: make(map[UserToken]*user),
	}
}

func (u *UserTokensCache) NewToken() UserToken {
	u.m.Lock()
	token := newToken()
	_, ok := u.tokens[token]
	for ok {
		token = newToken()
		_, ok = u.tokens[token]
	}

	u.tokens[token] = &user{token: token, userType: PlayerUserType}
	u.m.Unlock()

	log.WithField("token", token).Debug("Generated new user token")

	return token
}

func (u *UserTokensCache) NewDMToken() UserToken {
	t := u.NewToken()
	u.m.Lock()
	u.tokens[t].userType = DMUserType
	u.m.Unlock()

	log.WithField("token", t).Debug("Generated new DM token")

	return t
}

func newToken() UserToken {
	token := strings.Builder{}
	token.Grow(tokenLength)
	for i := 0; i < 7; i++ {
		r := rand.Intn(len(key))
		token.WriteByte(key[r])
	}
	return UserToken(token.String())
}

func (u *UserTokensCache) ValidToken(t UserToken) bool {
	_, ok := u.tokens[t]

	log.WithFields(log.Fields{"token": t, "valid": ok}).Debug("Validated token")
	return ok
}

func (u *UserTokensCache) GetUserType(t UserToken) UserType {
	u.m.Lock()
	user, ok := u.tokens[t]
	u.m.Unlock()
	if !ok {
		return InvalidUserType
	}
	return user.userType
}

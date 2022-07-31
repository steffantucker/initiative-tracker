package users

import (
	"math/rand"
	"strings"
	"sync"
	"time"

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
	token := newUniqueToken(u.tokens)
	token = UserToken("p-" + string(token))
	u.tokens[token] = &user{token: token, userType: PlayerUserType}
	u.m.Unlock()

	log.WithField("token", token).Debug("Generated new user token")

	return token
}

func (u *UserTokensCache) NewDMToken() UserToken {
	u.m.Lock()
	token := newUniqueToken(u.tokens)
	token = UserToken("dm-" + string(token))
	u.tokens[token] = &user{token: token, userType: DMUserType}
	u.m.Unlock()

	log.WithField("token", token).Debug("Generated new DM token")

	return token
}

func newUniqueToken(tokens map[UserToken]*user) UserToken {
	token := newToken()
	_, ok := tokens[token]
	for ok {
		token = newToken()
		_, ok = tokens[token]
	}
	return token
}

func newToken() UserToken {
	token := strings.Builder{}
	rand.Seed(time.Now().Unix())
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

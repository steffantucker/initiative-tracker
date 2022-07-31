package users

import (
	"sync"

	log "github.com/sirupsen/logrus"
	"github.com/steffantucker/initiative-tracker/uidgenerator"
)

type (
	UserTokensCache struct {
		tokens map[UserToken]*user
		gen    uidgenerator.Generator
		m      sync.Mutex
	}

	user struct {
		token    UserToken
		userType UserType
	}
)

func NewUserTokensCache(gen uidgenerator.Generator) *UserTokensCache {
	return &UserTokensCache{
		tokens: make(map[UserToken]*user),
		gen:    gen,
	}
}

func (u *UserTokensCache) NewToken() UserToken {
	u.m.Lock()
	token := UserToken(u.gen.NewUID("p-"))
	u.tokens[token] = &user{token: token, userType: PlayerUserType}
	u.m.Unlock()

	log.WithField("token", token).Debug("Generated new user token")

	return token
}

func (u *UserTokensCache) NewDMToken() UserToken {
	u.m.Lock()
	token := UserToken(u.gen.NewUID("dm-"))
	u.tokens[token] = &user{token: token, userType: DMUserType}
	u.m.Unlock()

	log.WithField("token", token).Debug("Generated new DM token")

	return token
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

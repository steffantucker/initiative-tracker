package users

type UserToken string
type UserType string

const (
	InvalidUserType UserType = "invalid"
	DMUserType      UserType = "DM"
	PlayerUserType  UserType = "Player"
)

type UserTokens interface {
	NewToken() UserToken
	NewDMToken() UserToken
	ValidToken(UserToken) bool
	GetUserType(UserToken) UserType
}

package model

// GithubMetadata contains metadata for user github account
type GithubMetadata struct {
	User User `json:"user"`
}

// User represents GitHub user information along with user repositories
type User struct {
	GithubHandle  string
	GithubURL     string
	AvatarURL     string
	Email         string
	FollowerCount float64
	Repositories  []Repository
}

// UserMetadata represents User information and the endpoint to get the list of user repositories
type UserMetadata struct {
	User          `json:"user"`
	RepositoryURL string `json:"repositoryURL"`
}

// Repository represents GitHub repositoy metadata
type Repository struct {
	Name             string `json:"name"`
	URL              string `json:"url"`
	CommitCount      int    `json:"commitCount"`
	PullRequestCount int    `json:"pullRequestCount"`
}

// ErrorMessage contains the error message
type ErrorMessage struct {
	Message string `json:"message"`
}

// NewErrorMessage returns ErrorMessage type from the error type
func NewErrorMessage(err error) ErrorMessage {
	return ErrorMessage{Message: err.Error()}
}

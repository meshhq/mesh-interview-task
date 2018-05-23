package clients

import "github.com/elumbantoruan/mesh-interview-task/model"

// GitHubAPI interface
type GitHubAPI interface {
	GetUserMetadata(account string) (*model.UserMetadata, error)
	GetUserRepositories(um *model.UserMetadata) ([]model.Repository, error)
}

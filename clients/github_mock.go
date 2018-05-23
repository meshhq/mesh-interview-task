package clients

import (
	"fmt"

	"github.com/elumbantoruan/mesh-interview-task/model"
)

// GitHubMock mocks the GitHubAPI
type GitHubMock struct{}

// GetUserMetadata returns user metadata
func (g GitHubMock) GetUserMetadata(account string) (*model.UserMetadata, error) {
	return &model.UserMetadata{
		User: model.User{
			GithubHandle:  account,
			FollowerCount: 100,
		},
		RepositoryURL: fmt.Sprintf("https://api.github.com/users/%s/repos", account),
	}, nil
}

// GetUserRepositories .
func (g GitHubMock) GetUserRepositories(um *model.UserMetadata) ([]model.Repository, error) {
	return []model.Repository{
		{
			Name:             "myrepo",
			CommitCount:      10,
			PullRequestCount: 10,
		},
	}, nil
}

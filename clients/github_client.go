package clients

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"

	"github.com/elumbantoruan/mesh-interview-task/model"
)

// GitHubClient implements GitHubAPI interface
type GitHubClient struct {
}

// NewGitHubClient creates GithubClient
func NewGitHubClient() *GitHubClient {
	return &GitHubClient{}
}

// GetUserMetadata returns user metadata
func (c *GitHubClient) GetUserMetadata(account string) (*model.UserMetadata, error) {
	var user model.UserMetadata
	req, _ := http.NewRequest("GET", fmt.Sprintf("https://api.github.com/users/%s", account), nil)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	var usermetadata = make(map[string]interface{})
	json.NewDecoder(resp.Body).Decode(&usermetadata)

	if _, ok := usermetadata["login"]; !ok {
		// most likely you get throttle
		if _, ok := usermetadata["message"]; ok {
			return nil, fmt.Errorf("ERROR: %v", usermetadata["message"].(string))
		}
		return nil, errors.New("UNKNOWN ERROR has occured")
	}

	user.GithubHandle = usermetadata["login"].(string)
	user.GithubURL = usermetadata["url"].(string)
	user.AvatarURL = usermetadata["avatar_url"].(string)

	user.FollowerCount = usermetadata["followers"].(float64)

	emailURL := fmt.Sprintf("https://api.github.com/users/%s/events/public", user.GithubHandle)
	req, _ = http.NewRequest("GET", emailURL, nil)
	client = &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		return nil, err
	}
	var eventsData []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&eventsData)

	var (
		payload map[string]interface{}
		commits []interface{}
		commit  map[string]interface{}
		author  map[string]interface{}
	)

	for _, v := range eventsData {
		payload = v["payload"].(map[string]interface{})
		if cm, ok := payload["commits"]; ok {
			commits = cm.([]interface{})
			for _, c := range commits {
				commit = c.(map[string]interface{})
				author = commit["author"].(map[string]interface{})
				user.Email = author["email"].(string)
				break
			}
			break
		}
	}

	user.RepositoryURL = usermetadata["repos_url"].(string)

	return &user, nil
}

// GetUserRepositories returns list of user repositories
func (c *GitHubClient) GetUserRepositories(um *model.UserMetadata) ([]model.Repository, error) {
	var repositories []model.Repository
	req, _ := http.NewRequest("GET", um.RepositoryURL, nil)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	var repos []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&repos)

	for _, r := range repos {
		var repository model.Repository
		repository.Name = r["name"].(string)
		repository.URL = r["url"].(string)

		commitCount, err := c.CountCommits(fmt.Sprintf("https://api.github.com/repos/%s/%s/commits", um.GithubHandle, repository.Name))
		if err != nil {
			return nil, err
		}
		repository.CommitCount = commitCount

		prCount, err := c.CountPullRequests(fmt.Sprintf("https://api.github.com/repos/%s/%s/pulls?state=all", um.GithubHandle, repository.Name))
		if err != nil {
			return nil, err
		}
		repository.PullRequestCount = prCount
		repositories = append(repositories, repository)
	}
	return repositories, nil
}

// CountCommits .
func (c *GitHubClient) CountCommits(endpoint string) (int, error) {
	req, _ := http.NewRequest("GET", endpoint, nil)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return -1, err
	}
	var commits []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&commits)

	return len(commits), nil
}

// CountPullRequests .
func (c *GitHubClient) CountPullRequests(endpoint string) (int, error) {
	req, _ := http.NewRequest("GET", endpoint, nil)
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return -1, err
	}
	var prs []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&prs)

	return len(prs), nil
}

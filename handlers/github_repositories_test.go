package handlers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/elumbantoruan/mesh-interview-task/clients"
	"github.com/elumbantoruan/mesh-interview-task/model"
	"github.com/gorilla/mux"
	"github.com/stretchr/testify/assert"
)

// Returns not found as query parameter "account" is not found
func TestGitHubRepositories_HandleGetRepositories_NotFound(t *testing.T) {
	request, _ := http.NewRequest("GET", "githubrepositories", strings.NewReader(""))
	mapper := map[string]string{}
	request = mux.SetURLVars(request, mapper)

	responseRecorder := httptest.NewRecorder()

	api := clients.GitHubMock{}
	handler := NewGitHubRepositories(api)
	handler.HandleGetRepositories(responseRecorder, request)

	assert.Equal(t, http.StatusNotFound, responseRecorder.Code)

}

func TestGitHubRepositories_HandleGetRepositories(t *testing.T) {
	account := "testaccount"
	request, _ := http.NewRequest("GET", "githubrepositories", strings.NewReader(""))
	mapper := map[string]string{
		"account": account,
	}
	request = mux.SetURLVars(request, mapper)

	responseRecorder := httptest.NewRecorder()

	api := clients.GitHubMock{}
	handler := NewGitHubRepositories(api)
	handler.HandleGetRepositories(responseRecorder, request)

	assert.Equal(t, http.StatusOK, responseRecorder.Code)

	// verify if body returns appropriate payload
	var gh model.GithubMetadata
	json.NewDecoder(responseRecorder.Body).Decode(&gh)

	assert.Equal(t, gh.User.GithubHandle, account)

}

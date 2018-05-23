package handlers

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/elumbantoruan/mesh-interview-task/clients"
	"github.com/elumbantoruan/mesh-interview-task/model"
)

// GitHubRepositories represents github user metadata and user repositories
type GitHubRepositories struct {
	api clients.GitHubAPI
}

// NewGitHubRepositories creates a new instance of GithubRepositories
func NewGitHubRepositories(api clients.GitHubAPI) *GitHubRepositories {
	return &GitHubRepositories{
		api: api,
	}
}

// HandleGetRepositories fetches github metadata which includes user information
// and user repositories
func (g *GitHubRepositories) HandleGetRepositories(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	vars := mux.Vars(r)

	if _, ok := vars["account"]; !ok {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	um, err := g.api.GetUserMetadata(vars["account"])
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(model.NewErrorMessage(err))
	}

	repos, err := g.api.GetUserRepositories(um)
	if err != nil {
		log.Println(err)
	}
	var user model.User
	user = um.User
	user.Repositories = repos

	gh := model.GithubMetadata{User: user}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(gh)
}

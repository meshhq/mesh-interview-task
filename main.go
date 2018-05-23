package main

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"

	"github.com/elumbantoruan/mesh-interview-task/clients"
	"github.com/elumbantoruan/mesh-interview-task/handlers"
)

func main() {

	m, err := registerHandlers()
	if err != nil {
		log.Panic(err)
	}
	http.Handle("/", m)

	err = http.ListenAndServe(":5000", nil)
	if err != nil {
		log.Panic(err)
	}
}

func registerHandlers() (*mux.Router, error) {
	m := mux.NewRouter()

	// Register GitHubRepositories handler
	// creates an api
	// then set it into GithubRepositories handler
	api := clients.NewGitHubClient()
	gh := handlers.NewGitHubRepositories(api)
	m.HandleFunc("/githubrepositories/{account}", gh.HandleGetRepositories).Methods("GET")

	return m, nil
}

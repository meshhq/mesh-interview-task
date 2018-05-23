# Github Repositories API
Simple GitHub Repositories API retrieves user metadata along with user repositories

## Dependencies:
* github.com/gorilla/mux
    * HTTP router

## Project Structures: 
### clients
It's a package to manage client connectivity to GitHub.
It contains the interface, concrete client implementation, and mocks.

### handlers
Handlers handles the GET request to get GitHub metadata.
The unit test verifies http status code and response body

### model
It's a package for response payload.


const githubApi = require('./github');

// githubApi.getUserInfo('leonardojperez', (data) => {
//     //console.log(data.repositories);
// });

githubApi.getUserInfo('octokit', (data) => {
    //console.log(data.repositories);
});
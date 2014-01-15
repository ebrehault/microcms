var microcms = {};

microcms.params = {
  repository: 'ebrehault/microcms',
  branch: 'master',
  public_key: 'sYYCj64pggkfSav1Ycm3PpmEAwo'
};

microcms.edit = function() {
  document.designMode = "on";
};

microcms.save = function() {
  OAuth.initialize(microcms.params.public_key);
  OAuth.popup('github', function(error, result) {
    if (error) {
      console.log(err); // do something with error
      return;
    }

    var base_url = 'https://api.github.com/repos/'
    + microcms.params.repository
    + '/contents/';
    result.get(base_url + 'index.html').done(
      function(response) {
        console.log(response);
        var sha = response.sha;
        console.log("FILE SHA: " + sha);
        result.put({
          url: base_url + 'index.html',
          data: JSON.stringify({
            "message": "updated via microcms",
            "content": btoa($('html')[0].outerHTML),
            "sha": sha,
            "path": 'index.html',
            "branch": "gh-pages"
          })
        }).done(function(response) {
          console.log(response);
        });
      });
  });
};
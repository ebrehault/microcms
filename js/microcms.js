var microcms = {};

microcms.params = {
  repository: 'ebrehault/microcms',
  branch: 'master',
  public_key: 'sYYCj64pggkfSav1Ycm3PpmEAwo'
};

microcms.edit = function() {
  document.designMode = "on";
  microcms.authenticate();
};

microcms.close = function() {
  location.reload()
};

microcms.authenticate = function() {
  var self = this;

  OAuth.initialize(microcms.params.public_key);
  OAuth.popup('github', function(error, result) {
    if (error) {
      console.log(err); // do something with error
      return;
    }

    self.save = function() {
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
    };

    $("#microcms_save").show();
    $("#microcms_save").click(function() {
      self.save();
    });
  });
};

microcms.initialize = function() {
  $('body').append('<div id="microcms_buttons" style="position: fixed; top: 0; right:0">'
    + '<button id="microcms_edit">Edit</button>'
    + '<button id="microcms_close">Close</button>'
    + '<button id="microcms_save">Save</button>'
    + '</div>'
    );
  $("#microcms_save").hide();
  $("#microcms_edit").click(function() {
    microcms.edit();
  });
  $("#microcms_close").click(function() {
    microcms.close();
  });
}

$(document).ready(function() {
  microcms.initialize();
});
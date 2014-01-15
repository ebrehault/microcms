var microcms = {};

microcms.params = {
  repository: 'ebrehault/microcms',
  branch: 'gh-pages',
  public_key: 'sYYCj64pggkfSav1Ycm3PpmEAwo'
};

microcms.edit = function() {
  document.designMode = "on";
  microcms.authenticate();
};

microcms.close = function() {
  location.reload()
};

microcms.html = function() {
  $("#microcms_buttons").remove();
  var html = $('html')[0].outerHTML
  microcms.insert_toolbar();
  return html;
};

microcms.authenticate = function() {
  var self = this;

  OAuth.initialize(microcms.params.public_key);
  OAuth.popup('github', function(error, result) {
    if (error) {
      console.log(error); // do something with error
      return;
    }

    self.save = function() {
      $("#microcms_save").text("Saving...");
      var base_url = 'https://api.github.com/repos/'
      + microcms.params.repository
      + '/contents/';
      result.get(base_url + 'index.html?ref=' + microcms.params.branch).done(
        function(response) {
          console.log(response);
          var sha = response.sha;
          console.log("FILE SHA: " + sha);
          result.put({
            url: base_url + 'index.html',
            data: JSON.stringify({
              "message": "updated via microcms",
              "content": btoa(microcms.html()),
              "sha": sha,
              "path": 'index.html',
              "branch": microcms.params.branch
            })
          }).done(function(response) {
            $("#microcms_save").text("Save");
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

microcms.insert_toolbar = function() {
  $('body').append('<div id="microcms_buttons" style="position: fixed; top: 0; right:0">'
    + '<div id="spinner"></div>'
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
  microcms.insert_toolbar();
});
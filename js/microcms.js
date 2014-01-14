var microcms = {};

microcms.login = function() {
    OAuth.initialize('sYYCj64pggkfSav1Ycm3PpmEAwo');
    OAuth.popup('github', function(error, result) {
        if(result) {
            console.log("Logged in");
        }
    });
};

microcms.edit = function() {
    document.designMode = "on";
};

microcms.save = function() {
    
};

microcms.console = function(url) {
    $.getJSON(url, {}, function(response) {
        var meta = response.meta
        var data = response.data
        console.log(meta)
        console.log(data)
    });
};
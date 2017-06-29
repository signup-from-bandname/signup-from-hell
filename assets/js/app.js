var devmode = 0;

var init = function() {
  checkForDevMode();
};

var checkForDevMode = function() {
  devmode = getParameterByName('devmode') || 0;
  if(parseInt(devmode) !== 0) {
    console.log('DEV_MODE detected:', devmode)
  }
};



document.addEventListener("DOMContentLoaded", init);

// ############################################
// ############# HELPER FUNCTIONS #############
// ############################################

var getParameterByName = function(name) {
  var url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  var results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};

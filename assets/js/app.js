var devmode = 0;

var init = function() {
  checkForDevMode();
  randomizeTabIndex();
};

var checkForDevMode = function() {
  devmode = getParameterByName('devmode') || 0;
  if(parseInt(devmode) !== 0) {
    console.log('DEV_MODE detected:', devmode)
  }
};

var randomizeTabIndex = function() {
  var inputs = document.querySelectorAll('input')
  inputs.forEach(function(element) {
    element.tabIndex = getRandomInt(0, inputs.length -1);
  });
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
var getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min +1)) + min; 
}
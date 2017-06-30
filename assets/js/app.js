var devmode = false;
var fieldsets;

var init = function() {
  closeChromeModal();
  initFieldsets();
  beEasyFieldset();
  checkForDevMode();
  randomizeTabIndex();
  initCaptchasong();
  initCountthedogs();
  birthdayPicker();
  initPaging();
};

function initPaging() {
  var pagingTemplate = $('<div class="paging" />').text('Seite').prependTo('fieldset');
  $(fieldsets).each(function(index) {
    var count = index,
      fieldset = $(this),
      paginator = fieldset.find('.paging'),
      current = count + 1,
      final = count +2;

    paginator.text('Seite ' + current + ' von ' + final);

  })
}

var closeChromeModal = function () {
  $('body').on('click', function() {
    document.querySelector('#chrome-download').classList.add('hidden');
  });
};

var initFieldsets = function() {
  fieldsets = document.querySelectorAll('fieldset');
  var len = fieldsets.length;
  for (var i = 0; i < len; i++) {
    var _this = fieldsets[i];
    _this.id = 'fieldset' + i;
    if (i !== 0) {
      _this.classList.add('hidden');
    }
    if (i !== len - 1) {
      var nextBtn = document.createElement('button');
      var textnode = document.createTextNode("weiter >");

      nextBtn.appendChild(textnode);
      nextBtn.classList.add('nextBtn');
      nextBtn.setAttribute('type', 'button');
      nextBtn.setAttribute('data-num', i.toString());
      nextBtn.setAttribute('disabled', 'disabled');
      nextBtn.addEventListener('click', function() {
        var fake = this.getAttribute('data-fake');
        if (!fake) {
          var num = parseInt(this.getAttribute('data-num'));
          var currentFieldset = document.querySelector('#fieldset' + num);
          currentFieldset.classList.add('hidden');
          var nextFieldset = document.querySelector('#fieldset' + (num + 1));
          nextFieldset.classList.remove('hidden');
        }
      });
      _this.appendChild(nextBtn);
    }
  }
};

/**
 * Prüft ob als getParameter "devmode" angegeben wurde.
 * Mit einem integer (z.B. "devmode=2") kann direkt das entsprechende Fieldset angesprungen werden.
 */
var checkForDevMode = function() {
  devmode = getParameterByName('devmode') || false;

  if(devmode) {
    console.log('DEV_MODE detected:', devmode);
    var num = parseInt(devmode);
    if(!isNaN(num)) {
      document.querySelector('#chrome-download').classList.add('hidden');
      for (var i = 0; i < fieldsets.length; i++) {
        if (i === num) {
          fieldsets[i].classList.remove('hidden');
        } else {
          fieldsets[i].classList.add('hidden');
        }
      }
    }
    $('body').removeClass('rainbow-background');
  }
};

var randomizeTabIndex = function() {
  var inputs = document.querySelectorAll('input')
  inputs.forEach(function(element) {
    element.tabIndex = getRandomInt(0, inputs.length -1);
  });
};

var beEasyFieldset = function () {
  var target = document.querySelector('.everything-is-awesome');
  var errorText = document.querySelector('.everything-is-awesome .error');
  var inputs = document.querySelectorAll('.everything-is-awesome input');
  var currentNextBtn = document.querySelector('.everything-is-awesome .nextBtn');

  currentNextBtn.setAttribute('data-fake', 'true');
  enableNextButton();
  for (var i = 0; i < inputs.length; i++) {
    var currentInput = inputs[i];

    if (currentInput.value == '') {
      errorText.classList.add('hidden');
    }

  }

  currentNextBtn.addEventListener('click', function(event){
    event.preventDefault();
    console.log('do something')
    currentNextBtn.removeAttribute('data-fake');
    return false;
   });
  console.log(currentNextBtn);
}

var birthdayPicker = function () {
  $( "#birthday" ).datepicker();
};

var initCaptchasong = function() {
  var captchas = document.querySelectorAll('#captchasong input');
  var errorText = document.querySelector('#captchasong .error');
  for (var i = 0; i < captchas.length; i++) {
    var currentCaptcha = captchas[i];
    currentCaptcha.setAttribute('placeholder', captchaDB.succeed_at_last[i]);
    currentCaptcha.addEventListener('focus', function() { errorText.classList.add('hidden'); } );
    currentCaptcha.addEventListener('blur', function(e) {
      var current = e.currentTarget;
      if(current.getAttribute('placeholder') !== current.value) {
        current.value = '';
        errorText.classList.remove('hidden');
      } else {
        current.classList.add('valid');
        var allInputCount = document.querySelectorAll('#captchasong input').length;
        var validCount = document.querySelectorAll('#captchasong input.valid').length;
        if(allInputCount === validCount) {
          enableNextButton();
        }
      }
    } );
  }
};

/**
 * Funktion um vom aktuell aktiven Fieldset den "Weiter"-Button freizuschalten.
 */
var enableNextButton = function() {
  var currentNextBtn = document.querySelector("fieldset:not(.hidden) .nextBtn");
  currentNextBtn.removeAttribute('disabled');
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

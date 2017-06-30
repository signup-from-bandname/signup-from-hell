(function() {
  // Create audio (context) container
  var audioCtx = new (AudioContext || webkitAudioContext)();

  // Table of notes with correspending keyboard codes. Frequencies are in hertz.
  // The notes start from middle C
  var notesByKeyCode = {
    65: { noteName: 'c4', frequency: 261.6, keyName: 'a' },
    83: { noteName: 'd4', frequency: 293.7, keyName: 's' },
    68: { noteName: 'e4', frequency: 329.6, keyName: 'd' },
    70: { noteName: 'f4', frequency: 349.2, keyName: 'f' },
    71: { noteName: 'g4', frequency: 392, keyName: 'g' },
    72: { noteName: 'a4', frequency: 440, keyName: 'h' },
  };

  //  A  S  D  F  G  H
  // 65 83 68 70 71 72
  var melody = [ 65 , 83, 68, 65, 70, 72, 71 ];
  var userMelody = [];

  function Key(keyCode, noteName, keyName, frequency) {
    var keyHTML = document.createElement('div');
    var keySound = new Sound(frequency, 'sawtooth');

    /* Cheap way to map key on touch screens */
    keyHTML.setAttribute('data-key', keyCode);

    /* Style the key */
    keyHTML.className = 'key';
    keyHTML.innerHTML = noteName + '<br><span>' + keyName + '</span>';

    return {
      html: keyHTML,
      sound: keySound
    };
  }

  function Sound(frequency, type) {
    this.osc = audioCtx.createOscillator(); // Create oscillator node
    this.pressed = false; // flag to indicate if sound is playing

    /* Set default configuration for sound */
    if(typeof frequency !== 'undefined') {
      /* Set frequency. If it's not set, the default is used (440Hz) */
      this.osc.frequency.value = frequency;
    }

    /* Set waveform type. Default is actually 'sine' but sawtooth sounds better :) */
    this.osc.type = type || 'sawtooth';

    /* Start playing the sound. You won't hear it yet as the oscillator node needs to be
     piped to output (AKA your speakers). */
    this.osc.start(0);
  };

  Sound.prototype.play = function() {
    if(!this.pressed) {
      this.pressed = true;
      this.osc.connect(audioCtx.destination);
    }
  };

  Sound.prototype.stop = function() {
    this.pressed = false;
    this.osc.disconnect();
  };

  function createKeyboard(notes, containerId) {
    var sortedKeys = []; // Placeholder for keys to be sorted
    var waveFormSelector = document.getElementById('soundType');

    for(var keyCode in notes) {
      var note = notes[keyCode];

      /* Generate playable key */
      note.key = new Key(keyCode, note.noteName, note.keyName, note.frequency);

      /* Add new key to array to be sorted */
      sortedKeys.push(notes[keyCode]);
    }

    /* Sort keys by frequency so that they'll be added to the DOM in the correct order */
    sortedKeys = sortedKeys.sort(function(note1, note2) {
      if (note1.frequency < note2.frequency) return -1;
      if (note1.frequency > note2.frequency) return 1;

      return 0;
    });

    // Add those sorted keys to DOM
    for(var i = 0; i < sortedKeys.length; i++) {
      document.getElementById(containerId).appendChild(sortedKeys[i].key.html);
    }

    var playNote = function(event) {
      event.preventDefault();

      var keyCode = event.keyCode || event.target.getAttribute('data-key');

      userMelody.push(keyCode);

      if(typeof notesByKeyCode[keyCode] !== 'undefined') {
        _noteStart(keyCode);
      }
    };

    var endNote = function(event) {
      var keyCode = event.keyCode || event.target.getAttribute('data-key');

      if(typeof notesByKeyCode[keyCode] !== 'undefined') {
        _noteStop(keyCode);
      }

      if(userMelody.length !== 0) {
        _checkMelody();
      }
    };

    var setWaveform = function(event) {
      for(var keyCode in notes) {
        notes[keyCode].key.sound.osc.type = this.value;
      }

      // Unfocus selector so value is not accidentally updated again while playing keys
      this.blur();
    };

    // Check for changes in the waveform selector and update all oscillators with the selected type
    waveFormSelector.addEventListener('change', setWaveform);

    window.addEventListener('keydown', playNote);
    window.addEventListener('keyup', endNote);
    window.addEventListener('touchstart', playNote);
    window.addEventListener('touchend', endNote);
  }

  var _noteStart = function(keyCode) {
    // Pipe sound to output (AKA speakers)
    notesByKeyCode[keyCode].key.sound.play();

    // Highlight key playing
    notesByKeyCode[keyCode].key.html.className = 'key playing';
  };

  var _noteStop = function(keyCode) {
    // Kill connection to output
    notesByKeyCode[keyCode].key.sound.stop();

    // Remove key highlight
    notesByKeyCode[keyCode].key.html.className = 'key';
  };

  var _playMelody = function() {
    console.log("melody");
    var isRunning = false;
    var i = 0;

    var _run = function() {
      var note = melody[i];

      if(!isRunning) {
        _noteStart(note);
        isRunning = true;
      } else {
        _noteStop(note);
        isRunning = false;
        i++;
      }

      if (i < melody.length) {
        setTimeout(_run, 150);
      }
    };

    _run();

  };

  var _checkMelody = function() {
    for (var i = 0; i < userMelody.length;) {
      // console.log("check", userMelody[i], melody[i]);
      if(userMelody[i] === melody[i]) {
        i++;
        if(i >= melody.length) {
          enableNextButton();
        }
      } else {
        userMelody = [];
        setTimeout(_playMelody, 500);
        break;
      }
    }
  };

  window.addEventListener('load', function() {
    var start = document.querySelector('#pipiano .start');
    start.addEventListener('click', function() {
      document.querySelector('#pipiano .startWrapper').classList.add('hidden');
      createKeyboard(notesByKeyCode, 'pianoKeyboard');

      setTimeout(_playMelody, 1000);
    })
  });
})();

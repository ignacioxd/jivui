(function() {
  var Replay = new JIVUI.UIModule();

  Replay.controls = {};

  Replay.init = function(state) {
    Replay.controls.replayText = document.getElementById("replayText");
    Replay.reset();
  };

  Replay.onDataProcessed = function(settings, data) {
    $('#dataTitle').html(settings.title);
  };

  Replay.onStop = function() {
    Replay.reset();
  };


  Replay.onFrame = function(frame, entry) {
    if(entry && entry['key']) {
      for(var i = 0; i < entry['key'].length; i++) {
        Replay.controls.replayText.innerHTML += entry['key'][i].key;
      }
    }
    //ReplayTypingTest.update();
  };

  Replay.reset = function() {
    Replay.controls.replayText.innerHTML = "";
  };

  JIVUI.registerUIModule(Replay);
})();

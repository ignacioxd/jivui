(function() {
  var ReplayControls = new JIVUI.UIModule();

  ReplayControls.controls = {};

  ReplayControls.init = function(state) {
    this.controls.play = $("#play");
    this.controls.playIcon = $("#play > i");
    this.controls.stop = $("#stop");
    this.controls.speed = $("#speed");
    this.controls.frame = $("#frame");
    this.controls.slower = $("#slower");
    this.controls.faster = $("#faster");

    this.controls.play.on('click', function( event ) {
      if(state.isPlaying()) { // Pausing
        state.pause();
      }
      else { //Playing
        state.play();
      }
    });

    this.controls.stop.on('click', function( event ) {
      state.stop();
    });

    this.controls.slower.on('click', function( event ) {
      state.setFPS(state.getFPS() - 10);
    });
    this.controls.faster.on('click', function( event ) {
      state.setFPS(state.getFPS() + 10);
    });

    this.controls.speed.val(state.getFPS());
    this.controls.speed.change(function() {
      state.setFPS($(this).val());
    });

    this.controls.frame.val(0);
    this.controls.frame.change(function() {
      state.setFrame($(this).val());
    });

    //Keyboard shortcuts
    Mousetrap.bind('space', function() { ReplayControls.controls.play.click(); return false; }); // Play/Pause
    Mousetrap.bind('backspace', function() { ReplayControls.controls.stop.click(); return false; }); // Stop
  };


  ReplayControls.onDataProcessed = function(settings, data) {
    this.controls.frame.attr('min', settings.start);
    this.controls.frame.attr('max', settings.end);
    this.controls.frame.val(settings.start*1);

  };

  ReplayControls.onPlay = function() {
    this.controls.playIcon.removeClass("fa-play");
    this.controls.playIcon.addClass("fa-pause");
    this.controls.stop.prop('disabled', false);
  };
  ReplayControls.onPause = function() {
    this.controls.playIcon.removeClass("fa-pause");
    this.controls.playIcon.addClass("fa-play");
  };
  ReplayControls.onStop = function() {
    this.controls.stop.prop('disabled', true);
    this.controls.play.prop('disabled', false);
    this.controls.playIcon.removeClass("fa-pause");
    this.controls.playIcon.addClass("fa-play");
  };

  ReplayControls.onFPS = function(fps) {
    this.controls.speed.val(fps);
  };

  ReplayControls.onFrame = function(frame, entry) {
    this.controls.frame.val(frame);
  };


  ReplayControls.onScrub = function(frame) {
    this.controls.frame.val(frame);
  };




  JIVUI.registerUIModule(ReplayControls);
})();

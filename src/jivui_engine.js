function JIVUIEngineFactory() {

  var isActive = false;
  var intervalId = null;
  var tickHandler = null;
  var prevTime = 0;
  var expectedElapsedTime = 0;
  var startTime = 0;
  var interval = 1;

  var listenerIterator = 0;

  return {
    isActive: function() {
      return isActive;
    },
    start: function() {
      if(isActive) {
        return;
      }
      isActive = true;
      expectedElapsedTime = 0;
      prevTime = Date.now();
      startTime = Date.now();
      this.tick(interval);
    },
    tick: function(int) {
      var thisInstance = this;
      intervalId = setTimeout(function() {
        var newTime = Date.now();
        expectedElapsedTime += interval;
        var correction = (newTime - startTime) - expectedElapsedTime;
        var skippedFrames = correction > 0 ? Math.round(correction / interval) : 0;
        expectedElapsedTime += skippedFrames * interval;
        //var realFPS = 1000 / (newTime - prevTime);
        prevTime = newTime;
        tickHandler(skippedFrames);

        if(isActive) {
          thisInstance.tick(interval - correction);
        }
      }, int);
    },
    addTickHandler: function(handler) {
      tickHandler = handler;
    },
    stop: function() {
      prevTime = 0;
      isActive = false;
      clearTimeout(intervalId);
      intervalId = null;
      return Date.now() - startTime;
    },
    getFPS: function() {
      return Math.round(1000 / interval);
    },
    setFPS: function(fps) {
      if(fps > 1000) {
        fps = 1000;
      }
      else if(fps < 1) {
        fps = 1;
      }
      interval = 1000 / fps;
    }
  };
}

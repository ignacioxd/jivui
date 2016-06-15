(function() {
  var FixationPreprocessor = new JIVUI.Preprocessor();

  FixationPreprocessor.onDataLoaded = function(settings, data) {
    var IDT = new VisualProcessor();

    for(var ms in data) {
      if(typeof(data[ms].gaze) != "undefined") {
        IDT.processPoint(ms, data[ms].gaze);
        data[ms].gaze.fixated = false;
      }
    }
    if(IDT.currentlyFixated) {
      IDT.recordFixation();
    }
    IDT.fixations.forEach(function(fixation, index) {
      data[fixation.start].fixation = fixation;
      for(var i = fixation.start; i <= fixation.start + fixation.duration; i++){
        if(data[i] && data[i]['gaze']) {
          data[i].gaze.fixated = true;
        }
      }
    });
  };

  JIVUI.registerPreprocessor(FixationPreprocessor);



  var VisualProcessor = function() {
    return {
      fixationWindowSize: 150,
      dispersionThreshold: 45,
      fixationWindow: [],
      currentlyFixated: false,
      fixations: [],
      recordFixation: function() {
        this.fixations.push({
          start: 1*this.fixationWindow[0].ms,
          duration: 1*this.fixationWindow[this.fixationWindow.length - 1].ms - this.fixationWindow[0].ms,
          //center: {x: null, y: null},
          //points: this.fixationWindow,
        });
        this.fixationWindow = [];
        this.currentlyFixated = false;
      },
      processPoint: function(ms, point) {

        if(this.fixationWindow.length > 0 && ms - this.fixationWindow[0].ms > this.fixationWindowSize) { //The new point will make the window too large
          if(!this.currentlyFixated && this.isFixated()) { //We haven't recorded the fixation for the current window
            this.currentlyFixated = true;
          }
          //Add the point to the window
          this.fixationWindow.push({ms:ms, point: { x: point.x, y: point.y}});
          //Are we currently in a fixation?
          if(this.currentlyFixated) {
            //Then make sure the current point doesn't break the fixation
            if(!this.isFixated()) { //The new point broke the fixation
              //Save the fixation without the new point
              this.fixationWindow.pop();
              this.recordFixation(); //This resets the fixation window
              //Add the new point as the fist one in window
              this.fixationWindow.push({ms:ms, point: { x: point.x, y: point.y}});
            }
          }
          else { //If we're not fixated, We need to remove old ponts to make the window be the right size
            while(!this.currentlyFixated && this.fixationWindow[this.fixationWindow.length - 1].ms - this.fixationWindow[0].ms > this.fixationWindowSize) {
              this.fixationWindow.shift();
            }
          }
        }
        else { //The window still has more space for the new point
          this.fixationWindow.push({ms:ms, point: { x: point.x, y: point.y}});
        }
      },
      isFixated: function() {
        return this.getDispersionInWindow() < this.dispersionThreshold;
      },
      getDispersionInWindow: function() {
        if(this.fixationWindow.length < 2) {
          return Number.POSITIVE_INFINITY;
        }
        var minX = Number.POSITIVE_INFINITY, maxX = Number.NEGATIVE_INFINITY,
          minY = Number.POSITIVE_INFINITY, maxY = Number.NEGATIVE_INFINITY;
        for(var i = 0; i < this.fixationWindow.length; i++) {
          if(this.fixationWindow[i].point.x < minX) {
            minX = this.fixationWindow[i].point.x;
          }
          if(this.fixationWindow[i].point.x > maxX) {
            maxX = this.fixationWindow[i].point.x;
          }
          if(this.fixationWindow[i].point.y < minY) {
            minY = this.fixationWindow[i].point.y;
          }
          if(this.fixationWindow[i].point.y > maxY) {
            maxY = this.fixationWindow[i].point.y;
          }
        }

        return maxX - minX + maxY - minY;
      },
      distance: function(pointA, pointB) {
        return Math.sqrt(Math.pow(pointB.x - pointA.x, 2) + Math.pow(pointB.y - pointA.y, 2));
      },
      centroid: function() {
        if(this.fixationWindow.length === 0) {
          return {x: null, y: null};
        }
        return {
          x: this.centroidRaw.x / this.fixationWindow.length,
          y: this.centroidRaw.y / this.fixationWindow.length
        };
      }
    };
  };

})();

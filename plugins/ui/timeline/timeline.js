(function() {
  var Timeline = new JIVUI.UIModule();

  Timeline.controls = {};

  Timeline.init = function(state) {
    this.TL = new TimelineObject();
    this.controls.timelineContainer = $(".timelineContainer");
    this.controls.timelineMarker = $(".timelineMarker");

  };

  $( window ).resize(function() {
    Timeline.resize();
  });
  Timeline.resize = function() {
    $(".timeline").css("width", this.TL.frameCount + this.TL.startOffset + this.TL.endOffset + "px");
    $(".timeline").css("max-width", this.TL.frameCount + this.TL.startOffset + this.TL.endOffset + "px");
    $(".timeline").css("min-width", this.TL.frameCount + this.TL.startOffset + this.TL.endOffset + "px");
    this.TL.scrollBuffer = this.controls.timelineContainer.width() / 2;
  };

  Timeline.onDataProcessed = function(settings, data) {
    $(".timelineContainer .timelineItem" ).remove();
    this.TL.startOffset = settings.startOffset ? settings.startOffset : 0;
    this.TL.endOffset = settings.endOffset ? settings.endOffset : 0;
    $(".timelineOrigin").css("left", this.TL.startOffset + "px");
    this.controls.timelineMarker.css("left", this.TL.startOffset + "px");

    this.TL.firstFrame = settings.start;
    this.TL.frameCount = settings.end - this.TL.firstFrame;
    Timeline.resize();

    // Allow each preprocessor to augment each data entry
    var fixationStart = null;
    var fixationEnd = null;

    for(var ms in data) {
      var entry = data[ms];
      //Keystroke Data
      if(typeof(entry.key) != "undefined" && Array.isArray(entry.key)) {
        for(var i = 0; i < entry.key.length; i++) {
          this.TL.addKeystroke(ms, entry.key[i]);
        }
      }
      /*if(typeof(entry.gaze) != "undefined" && typeof(entry.gaze.fixated) != "undefined") { //Gaze Data
        if(entry.gaze.fixated && fixationStart === null) {
          fixationStart = ms;
          fixationEnd = ms;
        }
        else if(entry.gaze.fixated && fixationStart !== null) {
          fixationEnd = ms;
        }
        else if(!entry.gaze.fixated && fixationStart !== null) {
          this.TL.addFixation(fixationStart, fixationEnd);
          fixationStart = null;
          fixationEnd = null;
        }
      }*/
      if(typeof(entry.fixation) != "undefined") {
        this.TL.addFixation(ms, entry.fixation);
      }
      if(typeof(entry.cognitive) != "undefined") {
        this.TL.addCognitive(ms, entry.cognitive);
      }
      if(typeof(entry.perceptual) != "undefined") {
        this.TL.addPerceptual(ms, entry.perceptual);
      }
    }
  };


  Timeline.onFrame = function(frame, entry) {
    var pixels = frame - this.TL.firstFrame + this.TL.startOffset;
    this.controls.timelineContainer.scrollLeft(pixels - this.TL.scrollBuffer);
    this.controls.timelineMarker.css("left", pixels + "px");
  };

  Timeline.onScrub = function(frame) {
    var pixels = frame - this.TL.firstFrame + this.TL.startOffset;
    this.controls.timelineContainer.scrollLeft(pixels - this.TL.scrollBuffer);
    this.controls.timelineMarker.css("left", pixels + "px");
  };




  JIVUI.registerUIModule(Timeline);




  function TimelineObject() {
    return {
      firstFrame: 0,
      startOffset: 0,
      endOffset: 0,
      scrollBuffer: 0,
      lastMotor: 0,
      lastFixation: 0,
      addKeystroke: function(ms, keystroke) {
        var newItem = $("<div>" + keystroke.key + "</div>");
        //var newItem = $( ".timelineProcessor.keyboard" ).add("div");
        newItem.addClass("timelineItem");
        newItem.css("left", ms - this.firstFrame + this.startOffset);
        newItem.css("width", keystroke['duration'] ? keystroke.duration : 100); // If not specified, assume keystroke duration to be 100
        newItem.appendTo(".timelineProcessor.keyboard");
        var tooltip = "Keystroke<br>key: '" + keystroke.key +
          "'<br>start: " + ms +
          "<br>duration: " + keystroke.duration;
        if(typeof(keystroke.msSincePrevious) !== "undefined") {
          tooltip += "<br>ms since last end: " + keystroke.msSincePrevious;
        }
        if(typeof(keystroke.msSincePreviousStart) !== "undefined") {
          tooltip += "<br>ms since last start: " + keystroke.msSincePreviousStart;
        }
        if(typeof(keystroke.correct) !== "undefined") {
          tooltip += "<br>correct: '" + (keystroke.correct ? "yes" : "no") + "'";
          if(!keystroke.correct) {
            newItem.addClass("incorrect");
          }
        }
        if(typeof(keystroke.word) !== "undefined") {
          tooltip += "<br>word: '" + keystroke.word + "'";
        }
        newItem.tooltip({
          title: tooltip,
          html: true,
          container: "body"
        });
        this.lastMotor = ms;
      },
      addCognitive: function(ms, cognitive) {
        var newItem = $("<div>" + cognitive.key + "</div>");
        newItem.addClass("timelineItem cognitive");
        newItem.css("left", (ms - this.firstFrame + this.startOffset));
        newItem.css("width", cognitive.duration);
        newItem.appendTo(".timelineProcessor.cognitive");
        var tooltip = "Cognitive Operator<br>key: '" + cognitive.key +
          "'<br>start: " + ms +
          "<br>duration: " + cognitive.duration;
        newItem.tooltip({
          title: tooltip,
          html: true,
          container: "body"
        });
      },
      addPerceptual: function(ms, perceptual) {
        var newItem = $("<div>" + perceptual.word + "</div>");
        newItem.addClass("timelineItem perceptual");
        newItem.css("left", (ms - this.firstFrame + this.startOffset));
        newItem.css("width", perceptual.duration);
        newItem.appendTo(".timelineProcessor.perceptual");
        var tooltip = "Perceptual Operator<br>word: '" + perceptual.word +
          "'<br>start: " + ms +
          "<br>duration: " + perceptual.duration;
        newItem.tooltip({
          title: tooltip,
          html: true,
          container: "body"
        });
      },
      /*addFixation: function(startFrame, endFrame) {
        var newItem = $("<div></div>");
        newItem.addClass("timelineItem");
        newItem.css("left", startFrame - this.firstFrame + this.startOffset);
        newItem.css("width", endFrame - startFrame);newItem.css("top", -10);
        newItem.css("bottom", 10);
        newItem.appendTo(".timelineProcessor.gaze");
        newItem.tooltip({
          title: "Fixation<br>ms: " + startFrame +
          "<br>duration: " + (endFrame - startFrame) +
          "<br>ms since last: " + (startFrame - this.lastFixation),
          html: true,
          container: "body"
        });
        this.lastFixation = endFrame;
      },*/
      addFixation: function(ms, fixation) {
        var startFrame = fixation.start;
        var endFrame = fixation.start + fixation.duration;
        var newItem = $("<div></div>");
        newItem.addClass("timelineItem");
        newItem.css("left", startFrame - this.firstFrame + this.startOffset);
        newItem.css("width", endFrame - startFrame);
        newItem.appendTo(".timelineProcessor.gaze");
        newItem.tooltip({
          title: "Fixation<br>ms: " + startFrame +
          "<br>duration: " + (endFrame - startFrame) +
          "<br>ms since last: " + (startFrame - this.lastFixation),
          html: true,
          container: "body"
        });
        this.lastFixation = endFrame;
      }
    };
  }
})();

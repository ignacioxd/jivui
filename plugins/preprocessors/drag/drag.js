(function() {
  var DragCalculator = new JIVUI.Preprocessor();

  DragCalculator.onDataLoaded = function(settings, data) {
    var leftClickStart = 0;
    var leftClickDuration = 0;
    //Iterate through data
    for(var ms in data) {
      if(typeof(data[ms].click) !== "undefined" && typeof(data[ms].click.duration) !== "undefined" && data[ms].click.button === "left") {
        leftClickStart = ms;
        leftClickDuration = data[ms].click.duration;
      }
      if(typeof(data[ms].mouse) !== "undefined") {
        data[ms].mouse.dragged = leftClickStart + leftClickDuration <= ms;
      }
    }
  };

  JIVUI.registerPreprocessor(DragCalculator);
})();

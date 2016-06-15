(function() {
  var FilterPreprocessor = new JIVUI.Preprocessor();

  FilterPreprocessor.onDataLoaded = function(settings, data) {
    //Filtering using the 1 Euro filter (http://www.lifl.fr/~casiez/1euro/)
    var filterX = OneEuroFilter(60, 1, 0.001, 10);
    var filterY = OneEuroFilter(60, 1, 0.001, 10);

    for(var ms in data) {
      if(typeof(data[ms].gaze) != "undefined") {
        data[ms].gaze.filteredX = filterX.filter(data[ms].gaze.x, ms);
        data[ms].gaze.filteredY = filterY.filter(data[ms].gaze.y, ms);
      }
    }
  };

  JIVUI.registerPreprocessor(FilterPreprocessor);
})();

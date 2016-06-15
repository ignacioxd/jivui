(function() {
  var EyePosition = new JIVUI.Preprocessor();

  EyePosition.onDataLoaded = function(settings, data) {
    for(var ms in data) {
      if(data[ms]['gaze']) {
        data[ms]['gaze'].x = data[ms]['gaze'].x - 240;
        data[ms]['gaze'].y = data[ms]['gaze'].y - 145;

        if(data[ms]['gaze']['filteredX']) {
          data[ms]['gaze'].filteredX = data[ms]['gaze'].filteredX - 240;
          data[ms]['gaze'].filteredY = data[ms]['gaze'].filteredY - 145;
        }
      }
    }


  };

  JIVUI.registerPreprocessor(EyePosition);
})();

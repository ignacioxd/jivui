(function() {
  var KeystrokeConsolidator = new JIVUI.Preprocessor();

  // A “key” event is expected to contain the key that was pressed, and can also contain optional attributes for the “duration” of the keystroke,
  // whether the keystroke correctly matched an expected keystroke (useful for transcription typing, or when the expected keystroke is otherwise known),
  // and a word context where the keystroke occurred. If not specified, a keystroke is assumed to last 100ms for visualization purposes.

  // The keyboard preprocessor augments keystroke events by adding the number of milliseconds elapsed between the start of the current keystroke and
  // the end of the previous one, as well as between the start of the current keystroke and the start of the previous one
  KeystrokeConsolidator.onDataLoaded = function(settings, data) {
    var previousKeystroke = null;
    var previousMS = 0;
    var i;
    //Iterate through data
    for(var ms in data) {
      if(typeof(data[ms].key) === "undefined") {
        continue;
      }
      for(i = 0; i < data[ms].key.length; i++) { //Handle multiple keystrokes
        data[ms].key[i].msSincePrevious = previousKeystroke && previousKeystroke['duration'] ? ms - previousMS - previousKeystroke.duration : "N/A";
        data[ms].key[i].msSincePreviousStart = previousKeystroke ? ms - previousMS : "N/A";
        previousKeystroke = data[ms].key[i];
        previousMS = ms;
      }
    }
  };

  JIVUI.registerPreprocessor(KeystrokeConsolidator);
})();

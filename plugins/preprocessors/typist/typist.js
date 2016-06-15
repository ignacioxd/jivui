(function() {
  var TYPIST = new JIVUI.Preprocessor();

  //This preprocessor annotates keystroke data with cognitive and perceptual operators based on the Model Human Processor (MHP)
  // and the TYPIST model. For every keystroke, this preprocessor creates a cognitive operator that
  // precedes it, lasting 50ms. Similarly, before the first cognitive operator of every word, this preprocessor includes
  // another cognitive operator that also lasts 50ms. Also for every word, a 340ms perceptual operator is created. The TYPIST
  // model describes a working memory capacity of three words, thus perceptual operators for three words are created by this
  // preprocessor at the beginning of the timeline; it waits for the typing of the first word to be completed before creating
  // the perceptual operator for the next word, and so on.

  TYPIST.onDataLoaded = function(settings, data) {
    var keyCogDuration = 50;
    var wordCogDuration = 50;
    var wordPercDuration = 340;
    var newWord = true;
    var words = [];

    //Make sure there's enough space before the start of the timeline
    settings.startOffset = settings['startOffset'] ? settings.startOffset + 3 * wordPercDuration : 3 * wordPercDuration;
    //Iterate through data
    for(var ms in data) {
      if(typeof(data[ms].key) === "undefined") {
        continue;
      }

      for(var i = 0; i < data[ms].key.length; i++) { //Handle multiple keystrokes
        if(data[ms].key[i].key === " ") { //A space indicates a new word
          newWord = true;
        }
        else {
          data[ms - keyCogDuration] = data[ms - keyCogDuration] ? data[ms - keyCogDuration] : {}; //Initialize millisecond if empty
          data[ms - keyCogDuration].cognitive = { //Keystroke operator
            duration: keyCogDuration,
            key: data[ms].key[i].key
          };
          if(newWord) { //Word operators on keystrokes
            newWord = false;
            words.push({ms: ms, word: "", end: ms});
            data[ms - keyCogDuration - wordCogDuration] = data[ms - keyCogDuration - wordCogDuration] ? data[ms - keyCogDuration - wordCogDuration] : {}; //Initialize millisecond if empty
            data[ms - keyCogDuration - wordCogDuration].cognitive = { //Cognitive
              duration: wordCogDuration,
              key: data[ms].key[i].key
            };
          }
          words[words.length-1].word += data[ms].key[i].key;
          words[words.length-1].end = ms;// + data[ms].key[i].key.duration;
        }
      }
    }

    words.forEach(function(word, i) { //Process whole words
      var start = 0;
      if(i < 3) { //The first three are consecutive
        start = words[0].ms - keyCogDuration - wordCogDuration - (3 - i) * wordPercDuration;
      }
      else {
        start = words[i-3].end;
      }
      data[start] = data[start] ? data[start] : {}; //Initialize millisecond if empty
      data[start].perceptual = { //Perceptual
        duration: wordPercDuration,
        word: word.word
      };

    });

  };

  JIVUI.registerPreprocessor(TYPIST);
})();

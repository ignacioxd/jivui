(function() {
  var ReplayTypingTest = new JIVUI.UIModule();


  function Word() {
    var sentence = "the quick brown fox jumps over the lazy dog";
    return {
      word: sentence,
      isComplete: false,
      completed: "",
      remaining: sentence,
      processKeystroke: function(char) {
        if(this.isComplete) {
          return;
        }
        var c = this.remaining.charAt(0);
        if(c === char) {
          this.completed += char;
          this.remaining = this.remaining.substr(1);
          if(this.remaining === "") {
            this.isComplete = true;
          }
        }
      }
    };
  }


  var WordSet = {
    words: new Word(),
    isComplete: false,
    processKeystroke: function(char) {
      if(!this.words.isComplete) {
        this.words.processKeystroke(char);
      }
      this.checkComplete();
    },
    reset: function() {
      this.words = new Word();
    },
    getWord: function() {
      return "<span class=\"matched\">" + this.words.completed + "</span>" + this.words.remaining;
    },
    checkComplete: function() {
      if(!this.words.isComplete) {
        return false;
      }
      this.isComplete = true;
      return this.isComplete;
    }
  };

  var words = [
    [
      [null, null, null, null],
      ["the", "quick", "brown", "fox"],
      ["jumps", "over", "the", "lazy"],
      ["dog", null, null, null],
      [null, null, null, null]
    ]
  ];




  ReplayTypingTest.init = function(state) {
    ReplayTypingTest.reset();
  };

  ReplayTypingTest.onDataProcessed = function(settings, data) {
    $('#dataTitle').html(settings.title);
  };

  ReplayTypingTest.reset = function() {
    WordSet.reset();
    ReplayTypingTest.update();
  };
  ReplayTypingTest.update = function() {
    $(".text").html("");
    $(".text").html(WordSet.getWord());
  };
  ReplayTypingTest.onStop = function() {
    ReplayTypingTest.reset();
  };


  ReplayTypingTest.onFrame = function(frame, entry) {
    if(entry && entry['key']) {
      for(var i = 0; i < entry['key'].length; i++) {
        WordSet.processKeystroke(entry['key'][i].key);
      }
    }
    ReplayTypingTest.update();
  };



  JIVUI.registerUIModule(ReplayTypingTest);
})();

(function() {
  var ReplayTypingGame = new JIVUI.UIModule();


  function Word(word) {
    return {
      word: word,
      isComplete: false,
      completed: "",
      remaining: word,
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
        else {
          this.remaining = this.word;
          this.completed = "";
        }
      }
    };
  }


  var WordSet = {
    words: [null, null,null, null],
    isComplete: false,
    setWords: function(wordArray) {
      this.isComplete = false;
      for(var i = 0; i < 4; i++) {
        this.words[i] = wordArray[i] === null ? null : new Word(wordArray[i]);
      }
    },
    processKeystroke: function(char) {
      for(var i = 0; i < 4; i++) {
        if(this.words[i] !== null && !this.words[i].isComplete) {
          this.words[i].processKeystroke(char);
        }
      }
      this.checkComplete();
    },
    getWordAt: function(index) {
      if(this.words[index] === null || this.words[index].isComplete) {
        return "";
      }
      return "<span class=\"matched\">" + this.words[index].completed + "</span>" + this.words[index].remaining;
    },
    hasWord: function(word) {
      for(var i = 0; i < 4; i++) {
        if(this.words[i] !== null && this.words[i].word == word) {
          return true;
        }
      }
      return false;
    },
    checkComplete: function() {
      for(var i = 0; i < 4; i++) {
        if(this.words[i] !== null && !this.words[i].isComplete) {
          return false;
        }
      }
      this.isComplete = true;
      return this.isComplete;
    }
  };

  var words = [
    [ // Practice
      [null, null, null, null],
      ["kid", null, null, null],
      [null, null, "jog", null],
      [null, null, null, "make"],
      [null,	"one", null, "set"],
      ["part", null, "fly", null],
      ["lie", null, null, "aqua"],
      ["ham", "quo", "beta", null],
      ["veer", null, "ion",	"play"],
      ["tax",	"mesh", null, "lean"],
      [null, null, null, null]
    ],
    [
      [null, null, null, null],
      [null, null, null,"also"],
      [null,"troll", null, null],
      ["howl", null, null, null],
      [null, null,"guild","keen"],
      ["quit","face", null, null],
      [null,"trio","fuzed", null],
      ["xerox", null,"child","goat"],
      ["waxy","abhor","clamp", null],
      [null, "proxy","jazzy","hydra"],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      [null, null, null,"eht"],
      [null,"nad", null, null],
      [null, null,"erd", null],
      ["thta", null, null,"bni"],
      [null,"vrey","wtih", null],
      [null, null,"sae","yuo"],
      [null,"yne","qou","daeh"],
      ["mla", null,"tnet","nhti"],
      ["eirs","eesd","tiem", null],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      [null, null, null,"haev"],
      [null,"thsi", null, null],
      [null, null,"frmo", null],
      ["sahse", null, null,"mnet"],
      [null,"oguht","frial", null],
      [null, null,"gnet","raelm"],
      [null,"ftghi","osld","trie"],
      ["mspa", null,"luagh","baens"],
      ["grnia","dirft","jedgu", null],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      [null, null,"ihcra", null],
      ["aavst", null, null, null],
      [null, "onsgs", null, null],
      ["cacth", null,"frace", null],
      [null, "teinig","sqaud", null],
      ["puots", null, null,"lnaeod"],
      [null,"hiaksu","madie","gteahr"],
      ["zmobie", null,"cnovex","phnoe"],
      ["rkists","aawkne", null,"legnio"],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      [null, null,"edn", null],
      [null, "mgu", null, null],
      [null, null, null,"arn"],
      [null,"ikte", null,"rto"],
      ["btye", null,"gmy", null],
      [null, "swa","ofnt", null],
      ["coer","ign","ubg", null],
      ["obr","tetn", null,"rdat"],
      [null,"oges","widn","rcae"],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      ["aole", null, null, null],
      ["leam", null, null, null],
      [null, null, null,"mtoa"],
      [null,"nosye","pgae", null],
      ["nior", null,"scotu", null],
      [null, "taerl", null,"nbmu"],
      ["gluf","ublk", null,"ejnoy"],
      [null,"wrpa","faeds","rbave"],
      ["raeve", null,"hcmup","riens"],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      [null, null,"ipnte", null],
      ["mtero", null, null, null],
      [null, "rsoce", null, null],
      [null, "epohcs","atxse", null],
      [null, "pcinic", null,"fnial"],
      ["hcasm", null,"mutlua", null],
      ["qaueys","srhimp","autdi", null],
      ["naelty","ravnie", null,"sonci"],
      ["crusro", null,"rseutl","jepurm"],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      [null, null,"jws", null],
      ["rpp", null, null, null],
      [null, "ebm", null, null],
      ["rks", null,"vnvy", null],
      [null, "bwnk","zuk", null],
      ["adr", null, null,"czq"],
      [null,"bbku","xrdu","wdp"],
      ["zar", null,"wwhq","ytk"],
      ["flsq","zhep", null,"tmfi"],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      ["gfni", null, null, null],
      [null, "eziy", null, null],
      [null, null,"rsrn", null],
      [null, "vjwyw", null,"mltk"],
      ["iajy","eusw", null, null],
      [null, null,"ynuiy","yithr"],
      ["icte", null,"adjkr","rjvlj"],
      [null, "zjqpd","deibe","ivib"],
      ["yuvtj","tocwz","cxcce", null],
      [null, null, null, null],
    ],
    [
      [null, null, null, null],
      [null, null, null,"udheg"],
      ["mkkxd", null, null, null],
      [null, null, null,"lxmcq"],
      [null,"hcelnq","nttgvi", null],
      [null, null,"xlxre","tcrqg"],
      ["fadow","sxjzvt", null, null],
      [null, "ccacu","spwtbd","fghmb"],
      ["tibrqk","jnxnfh","kqtir", null],
      ["rckuar", null,"tshslk","wdzsfm"],
      [null, null, null, null],
    ]
  ];

  var Board = {
    level: 0,
    row: 0,
    wordSet: 0,
    init: function(level) {
      this.level = level;
      this.reset();
    },
    reset: function() {
      this.row = 0;
      this.wordSet = 0;
      WordSet.setWords(words[this.level][this.wordSet]);
      this.update();
    },
    next: function() {
      this.row = 0;
      this.wordSet++;
      if(this.wordSet > words[this.level].length - 1) this.wordSet = words[this.level].length - 1;
      WordSet.setWords(words[this.level][this.wordSet]);
    },
    setRow: function(row) {
      this.row = row;
    },
    update: function() {
      $(".cell").removeClass("active");
      $(".cell").html("");
      for(var i = 0; i < 4; i++) {
        if(WordSet.getWordAt(i) !== "") {
          $(".row" + this.row ).find(".col" + i).html(WordSet.getWordAt(i));
          $(".row" + this.row ).find(".col" + i).addClass("active");
        }
      }
    },
    processKeystroke: function(keystroke) {
      if(keystroke.row !== null) {
        this.setRow(keystroke.row);
        if(!WordSet.hasWord(keystroke.word)) {
          this.next();
        }
      }
      WordSet.processKeystroke(keystroke.key);
      if(WordSet.isComplete) {
        this.next();
      }
      this.update();
    }
  };


  ReplayTypingGame.init = function(state) {
  };

  ReplayTypingGame.onDataProcessed = function(settings, data) {
    $('#dataTitle').html(settings.title);
    Board.init(settings.level);
    ReplayTypingGame.reset();
  };

  ReplayTypingGame.reset = function() {
    Board.reset();
    Board.update();
  };
  ReplayTypingGame.onStop = function() {
    ReplayTypingGame.reset();
  };

  ReplayTypingGame.onFrame = function(frame, entry) {
    if(entry && entry['key']) {
      for(var i = 0; i < entry['key'].length; i++) {
        Board.processKeystroke(entry['key'][i]);
      }
    }
  };

  JIVUI.registerUIModule(ReplayTypingGame);
})();

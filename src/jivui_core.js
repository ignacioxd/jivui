
var JIVUI = (function() {
  var data = null;

  var engine = new JIVUIEngineFactory();
  engine.addTickHandler(onTick);

  var plugins = new JIVUIPluginManagerFactory();

  var currentFrame = 0;

  var stateManager = {
    getData: function() {
      return data;
    },
    getFPS: function() {
      return engine.getFPS();
    },
    setFPS: function(newFPS) {
      engine.setFPS(newFPS);
      var uiModules = plugins.getUIModules();
      for(var i = 0; i < uiModules.length; i++){
        uiModules[i].onFPS(engine.getFPS());
      }
    },
    setFrame: function(newFrame) {

      currentFrame = newFrame;
      var uiModules = plugins.getUIModules();
      for(var i = 0; i < uiModules.length; i++){
        uiModules[i].onScrub(currentFrame);
      }
    },

    isPlaying: function() {
      return engine.isActive();
    },
    play: function() {
      if(engine.isActive()) {
        return;
      }
      if(data) {
        var uiModules = plugins.getUIModules();
        for(var i = 0; i < uiModules.length; i++){
          uiModules[i].onPlay();
        }
        engine.start();
      }
    },

    pause: function() {
      var uiModules = plugins.getUIModules();
      for(var i = 0; i < uiModules.length; i++){
        uiModules[i].onPause();
      }
      engine.stop();
    },

    stop: function() {
      currentFrame = data ? data.settings.start : 0;
      var uiModules = plugins.getUIModules();
      for(var i = 0; i < uiModules.length; i++){
        uiModules[i].onStop();
      }
      engine.stop();
      this.setFrame(currentFrame);
    },
  };


  function onTick(skippedFrames) {
    var frameIterator = 0, moduleIterator = 0, moduleCount = 0, maxFrames = 0;
    var uiModules = plugins.getUIModules(true);
    for(frameIterator = 0, maxFrames = skippedFrames + 1; frameIterator < maxFrames; ++frameIterator) {
      for(moduleIterator = 0, moduleCount = uiModules.length; moduleIterator < moduleCount; ++moduleIterator) {
        uiModules[moduleIterator].onFrame(currentFrame, data.data[currentFrame]);
      }
      currentFrame++;
      if(data && data.settings.end <= currentFrame) {
        stateManager.stop();
        break;
      }
    }

  }

  function setDataset(newData) {
    // Stop engine and store new dataset
    stateManager.stop();
    data = newData;
    var i;
    // Initialize preprocessors - notifies them of incoming data
    var preprocessors = plugins.getPreprocessors();
    for(i = 0; i < preprocessors.length; i++){
      preprocessors[i].onDataLoaded(data.settings, data.data);
    }
    // Initialize UI modules with processed data - notifies them of new data
    var uiModules = plugins.getUIModules();
    for(i = 0; i < uiModules.length; i++){
      uiModules[i].onDataProcessed(data.settings, data.data);
    }
  }

  function getDataset() {
    return data;
  }

  function registerPreprocessor(obj) {
    plugins.addPlugin(obj, "preprocessor");
  }

  function registerUIModule(obj) {
    obj.setStateManager(stateManager);
    plugins.addPlugin(obj, "ui");
    obj.init(stateManager);
  }

  //Get Plugin definitions on page
  document.addEventListener('DOMContentLoaded', function() {
     plugins.loadPlugins(document);
     console.log("DOMContentLoaded");
  });



  var publicAPI = {
    getDataset: getDataset,
    setDataset: setDataset,
    registerPreprocessor: registerPreprocessor,
    registerUIModule: registerUIModule,

    Preprocessor: JIVUIPluginManagerFactory.Preprocessor,
    UIModule: JIVUIPluginManagerFactory.UIModule,
  };
  return publicAPI;
})();

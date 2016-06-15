/*!
 * Copyright (c) 2016 Ignacio X. Domínguez
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE
 * OR OTHER DEALINGS IN THE SOFTWARE.
 */
function JIVUIEngineFactory() {

  var isActive = false;
  var intervalId = null;
  var tickHandler = null;
  var prevTime = 0;
  var expectedElapsedTime = 0;
  var startTime = 0;
  var interval = 1;

  var listenerIterator = 0;

  return {
    isActive: function() {
      return isActive;
    },
    start: function() {
      if(isActive) {
        return;
      }
      isActive = true;
      expectedElapsedTime = 0;
      prevTime = Date.now();
      startTime = Date.now();
      this.tick(interval);
    },
    tick: function(int) {
      var thisInstance = this;
      intervalId = setTimeout(function() {
        var newTime = Date.now();
        expectedElapsedTime += interval;
        var correction = (newTime - startTime) - expectedElapsedTime;
        var skippedFrames = correction > 0 ? Math.round(correction / interval) : 0;
        expectedElapsedTime += skippedFrames * interval;
        //var realFPS = 1000 / (newTime - prevTime);
        prevTime = newTime;
        tickHandler(skippedFrames);

        if(isActive) {
          thisInstance.tick(interval - correction);
        }
      }, int);
    },
    addTickHandler: function(handler) {
      tickHandler = handler;
    },
    stop: function() {
      prevTime = 0;
      isActive = false;
      clearTimeout(intervalId);
      intervalId = null;
      return Date.now() - startTime;
    },
    getFPS: function() {
      return Math.round(1000 / interval);
    },
    setFPS: function(fps) {
      if(fps > 1000) {
        fps = 1000;
      }
      else if(fps < 1) {
        fps = 1;
      }
      interval = 1000 / fps;
    }
  };
}


function JIVUIPluginManagerFactory() {
  var allPlugins = [];
  var preprocessors = [];
  var uiModules = [];


  function callAjax(url, callback){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if(xmlhttp.readyState == 4 && xmlhttp.status >= 200 && xmlhttp.status < 400) {
        callback(xmlhttp.responseText);
      }
      else if(xmlhttp.readyState == 4) {
        console.warn("Could not load resource: " + url, xmlhttp.status );
      }
    };
    xmlhttp.open("GET", url, false);
    xmlhttp.send();
  }

  function initializePlugin(plugin) {
    console.log("loading: ''" + plugin.path + "/jivuiplugin.json'");
    callAjax(plugin.path + "/jivuiplugin.json", function(jivuiplugin) {
      jivuiplugin = JSON.parse(jivuiplugin);
      if(jivuiplugin.type == "ui" || jivuiplugin.type == "both") {
        if(jivuiplugin.template) { // Load HTML template
          callAjax(plugin.path + "/" + jivuiplugin.template, function(template) {
            plugin.element.innerHTML = template;
            loadPlugins(plugin.element, plugin.path + "/"); //Load other plugins recursively
            loadAllJS(plugin.path, jivuiplugin.src);
          });
        }
        else {
          loadAllJS(plugin.path, jivuiplugin.src);
        }
        loadCSS(plugin.path, jivuiplugin.style);// Load CSS styles
      }
      else {
        loadAllJS(plugin.path, jivuiplugin.src);
      }
    });
  }

  function loadPlugins(element, basePath) {
    basePath = typeof(basePath) !== "undefined" ? basePath : "";
    var plugins = element.querySelectorAll('[data-jivui]');
    for(var i = 0; i < plugins.length; i++) {
      initializePlugin({
        element: plugins[i],
        path: basePath + plugins[i].getAttribute("data-jivui")
      });
    }

  }




  function loadAllJS(path, main) {
    if(!main) {return;}
    if(Array.isArray(main)) {
      main.forEach(function(item, i){
        loadJS(path, item);
      });
    }
    else {
      loadJS(path, main);
    }
  }

  function loadCSS(path, filename) {
    if(!filename) {return;}
    var resourcePath = isFullURL(filename) ? filename : path + "/" + filename;
    var fileref = document.createElement("link");
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", resourcePath);
    document.body.appendChild(fileref);
  }

  function loadJS(path, filename) {
    if(!filename) {return;}
    var resourcePath = isFullURL(filename) ? filename : path + "/" + filename;
    var fileref = document.createElement("script");
    fileref.async = false;
    fileref.setAttribute("type", "text/javascript");
    fileref.setAttribute("src", resourcePath);
    document.head.appendChild(fileref);
  }

  function isFullURL(filename) {
    var re = /^https?:\/\//i;
    return re.test(filename);
  }


  var publicAPI = {
    loadPlugins: loadPlugins,
    addPlugin: function(plugin, type) {
      if(type == "preprocessor") {
        preprocessors.push(plugin);
      }
      else if(type == "ui") {
        uiModules.push(plugin);
      }
    },
    getPreprocessors: function() {return preprocessors;},
    getUIModules: function() {return uiModules;}
  };
  return publicAPI;
}



JIVUIPluginManagerFactory.Preprocessor = function() {
  return {
    onDataLoaded: function(settings, data) {}
  };
};

JIVUIPluginManagerFactory.UIModule = function() {
  return {
    state: null,
    setStateManager: function(state) {this.state = state;},
    init: function(state) {},
    onDataProcessed: function(settings, data) {},
    onPlay: function() {},
    onPause: function() {},
    onStop: function() {},
    onFPS: function(fps) {},
    onFrame: function(frame, entry) {},
    onScrub: function(frame) {},
  };
};


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

JIVUI.saveData = function() {
  var dataset = JIVUI.getDataset();
  if(!dataset){
    return;
  }
  var element = document.createElement('a');
  var filename = dataset.title + ".json";
  element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(dataset)));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
  return false;
};

JIVUI.loadData = function() {
  var element = document.createElement('input');
  element.setAttribute('type', 'file');
  element.addEventListener('change', function(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
      var contents = e.target.result;
      JIVUI.setDataset(JSON.parse(contents));
    };
    reader.readAsText(file);

  }, false);

  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();

  setTimeout(function() {
    document.body.removeChild(element);
  }, 5000);

  return false;
};

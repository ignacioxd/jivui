
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

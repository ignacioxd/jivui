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

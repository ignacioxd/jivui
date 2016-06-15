(function() {
  var EyePath = new JIVUI.UIModule();

  $( window ).resize(function() {
    EyePathRenderer.resize();
  });

  var EyePathRenderer = {
    points: [],
    canvas: null,
    ctx: null,
    style: "black",
    size: 1,
    length: 1,
    init: function(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.resize();
    },
    resize: function() {
      this.canvas.width = this.canvas.parentNode.parentNode.offsetWidth;
      this.canvas.height = this.canvas.parentNode.parentNode.offsetHeight;
    },
    draw: function() {
      this.clear();
      var i, len;
      for(i = 0, len = this.points.length; i < len; i++) {
        if(this.points[i] === null) {
          continue;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(this.points[i].x, 0);
        this.ctx.lineTo(this.points[i].x, this.canvas.scrollHeight);
        this.ctx.strokeStyle = this.style;
        this.ctx.lineWidth = this.size;
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.beginPath();
        this.ctx.moveTo(0, this.points[i].y);
        this.ctx.lineTo(this.canvas.scrollWidth, this.points[i].y);
        this.ctx.strokeStyle = this.style;
        this.ctx.lineWidth = this.size;
        this.ctx.stroke();
        this.ctx.closePath();

        this.points[i].alpha -= 1.0 / this.length;
      }
      if(this.points.length > 0 && this.points[0].alpha <= 0) {
        this.points.shift();
      }
    },
    setPoint: function(x, y, filteredX, filteredY) {
      this.points.push(x === null ? null : {
        x: x,
        y: y,
        filteredX: filteredX,
        filteredY: filteredY,
        alpha: 1.0
      });
    },
    clear: function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };


  EyePath.init = function(state) {
    EyePathRenderer.init('eyeLayerCross');
  };

  EyePath.onDataProcessed = function(settings, data) {
    EyePathRenderer.resize();
  };

  EyePath.onStop = function() {
    EyePathRenderer.clear();
  };

  EyePath.onFrame = function(frame, entry) {
    if(entry && entry['gaze']) {
      EyePathRenderer.setPoint(entry['gaze'].x, entry['gaze'].y);
    }
    EyePathRenderer.draw();
  };

  JIVUI.registerUIModule(EyePath);
})();

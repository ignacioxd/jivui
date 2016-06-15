(function() {
  var MousePath = new JIVUI.UIModule();

  $( window ).resize(function() {
    MousePathRenderer.resize();
  });

  var MousePathRenderer = {
    points: [],
    clicks: [],
    canvas: null,
    ctx: null,
    style: "red",
    size: 1,
    length: 100,
    init: function(canvasId) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext("2d");
      this.resize();
    },
    resize: function() {
      this.canvas.width = this.canvas.parentNode.parentNode.offsetWidth;
      this.canvas.height = this.canvas.parentNode.parentNode.offsetHeight;
    },
    draw: function(ms) {
      this.clear();
      var i, len;
      this.ctx.fillStyle = this.style;
      this.ctx.strokeStyle = this.style;
      for(i = 0, len = this.points.length; i < len; i++) {
        if(this.points[i] === null) {
          continue;
        }
        this.ctx.globalAlpha = this.points[i].alpha;
        this.ctx.fillRect(this.points[i].x, this.points[i].y, this.size, this.size);

        this.points[i].alpha -= 1.0 / this.length;
      }
      if(this.points.length > 0 && this.points[0].alpha <= 0) {
        this.points.shift();
      }
      //Draw clicks, if any
      this.ctx.globalAlpha = 0.75;
      for(i = 0; i < this.clicks.length; i++) {
        if(this.clicks[i] === null) {
          continue;
        }
        this.ctx.beginPath();
        this.ctx.arc(this.clicks[i].x, this.clicks[i].y, 10.5, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.beginPath();
        this.ctx.arc(this.clicks[i].x, this.clicks[i].y, 20.5, 0, 2 * Math.PI);
        this.ctx.stroke();

        if(this.clicks[i].end >= ms) {
          this.clicks.splice(i, 1);
        }
      }
    },
    setPoint: function(x, y) {
      this.points.push(x === null ? null : {
        x: x,
        y: y,
        alpha: 1.0
      });
    },
    setClick: function(ms, click) {
      this.clicks.push({
        x: click.x,
        y: click.y,
        start: ms,
        end: ms + (click.duration ? click.duration * 1 : 100)
      });
    },
    clear: function() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  };


  MousePath.init = function(state) {
    MousePathRenderer.init('mouseLayerTrail');
  };

  MousePath.onDataProcessed = function(settings, data) {
    MousePathRenderer.resize();
  };

  MousePath.onStop = function() {
    MousePathRenderer.clear();
  };

  MousePath.onFrame = function(frame, entry) {
    if(entry && entry['mouse']) {
      MousePathRenderer.setPoint(entry['mouse'].x, entry['mouse'].y);
    }
    if(entry && entry['click']) {
      MousePathRenderer.setClick(frame, entry['click']);
    }
    MousePathRenderer.draw(frame);
  };

  MousePath.onScrub = function(frame) {
    //TODO: go back a set amount of milliseconds to redraw eye position
  };

  JIVUI.registerUIModule(MousePath);
})();

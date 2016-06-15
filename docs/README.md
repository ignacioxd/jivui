# JIVUI Documentation

## Table of Contents

 * [Getting Started with JIVUI](getting_started.md)
 * [JIVUI's JSON Data Description](input_data_description.md)
 * [Plug-ins and Plug-in Architecture](plugins.md)


 At its core, JIVUI consists of a timing engine, a state manager, and a plug-in manager. The timing engine is used on playback to maintain a stable animation framerate regardless of any browser's constraints or performance limitations. Because JIVUI works with millisecond precision, the default framerate is 1000 frames per second (FPS) as an attempt to render the visualization in real-time. This value is configurable, even as an animation is being played. When the timing engine cannot render at the specified speed, it provides the number of frames that are lagging behind. This allows JIVUI to compensate for this lost time to ensure that the animation has accurate timing based on the set speed and the data's total duration.

As the name suggests, the state manager keeps track of JIVUI's state, which includes the currently loaded dataset (if any), the playback speed, the current frame, and whether the animation is playing, paused, or stopped. The state manager also provides an API to control an animation. Specifically, through the state manager a module can control the animation speed, advance and rewind to a specific frame, and can play, pause, and stop the animation.

The plug-in manager maintains a list of registered plug-ins, and provides an API to register and remove them.


```html
<html>
  <head>
    <title>JIVUI Base Template</title>
  </head>
  <body>
    <div data-jivui="./plugins/timeline"></div>
    <!-- It is recommended that JIVUI is loaded after all your HTML tags -->
    <script src="jivui.js"></script>
  </body>
</html>
```

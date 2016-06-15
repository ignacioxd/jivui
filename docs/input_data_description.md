# JIVUI's JSON Data Description

JIVUI works with millisecond precision. It expects a JSON string containing a `settings` object and a `data` object (an example is shown below). The `settings` object is required to contain a `start` numeric attribute indicating the smallest millisecond contained in the data, and an `end` numeric attribute indicating the largest millisecond contained in the data. It can also contain three optional attributes, `title`, `startOffset`, and `endOffset`, providing a label to the data, time padding at the beginning, and time padding at the end of the visualization, respectively.

```JavaScript
{
  "settings": {
    "title": "Participant 31",  // optional
    "start": 200,
    "end": 250,
    "startOffset": 100,        // optional
    "endOffset": 200           // optional
  },
  "data": {
    "200": {
      "click": [{
        "button": "left",
        "x": 200, "y": 150,
        "duration": 60        // optional
      }],
      "key": [{
        "key": "t",
        "duration": 88,       // optional
        "correct": true,      // optional
        "word": "the"         // optional
      }]
    },
    "250": {
      "gaze": {
        "x": 220, "y": 170,
        "fixated": false      // calculated through plug-ins
      },
      "mouse": {
        "x": 210, "y": 151,
        "drag": true          // calculated through plug-ins
      }
    }
  }
}
```

The `data` object is where user or model data will be provided. It is expected to contain an arbitrary number of entries where the keys are milliseconds. Each entry can contain any combination of event types that occurred at that millisecond, keyed by the event type as follows: `click` for mouse clicks, `key` for keystrokes, `mouse` for mouse position, and `gaze` for eye-tracking data. In turn, each of these event types will include a set of required and optional attributes. Because multiple clicks can occur at the same time (e.g., from different mouse buttons), a `click` event is an array where each element is expected to contain the `x` and `y` coordinates where the click happened, as well as the button that was pressed (e.g., "left", "right", or "middle"), and it can also contain an optional `duration` attribute indicating for how long was the mouse button pressed. If not specified, a mouse click is assumed to last 100ms for visualization purposes. Multiple keystrokes can also occur at the same time, so a `key` event is also an array where each element is expected to contain the key that was pressed, and can also contain optional attributes for the `duration` of the keystroke, whether the keystroke correctly matched an expected keystroke (useful for transcription typing, or when the expected keystroke is otherwise known), and a word context where the keystroke occurred. If not specified, a keystroke is assumed to last 100ms for visualization purposes. The `gaze` and `mouse` events are expected to contain the `x` and `y` screen coordinates of the position of the eye-tracking and mouse pointer data, respectively.

Following the JSON standard, this data representation provides a few advantages. First, it guarantees that there is only one data entry per millisecond. Second, it guarantees that every entry contains at most one instance of each event type. Third, attributes and objects can be added to the data either before it is input to JIVUI, or dynamically by plug-ins, as discussed in the \sectionref{Plug-ins} section. More importantly, this representation is a string that can be easily produced from empirical data as well as from the output of cognitive modeling tools, and is supported by virtually all programming languages either natively or through popular libraries.

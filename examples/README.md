# JIVUI Examples

Here are some examples of real-world usage of JIVUI.

---

## Typing Game - Typing Test

This example visualizes a typing test screen in a study involving The Typing Game. Participants were asked to type the sentence "the quick brown fox jumps over the lazy dog". The `data` folder contains sample input files.

### Library Dependencies
  * jQuery
  * jQueryUI
  * FontAwesome
  * Bootstrap 3

### Plugins Used

#### Preprocessors
  * Keystrokes
  * Gaze fixations
  * TYPIST
  * Custom gaze position correction plugin to transform full screen eye positions into visualization coordinates.

#### UI Modules
  * File Loader
  * Controls
  * Timeline
  * Custom replay area

---

## Typing Game - Game Rounds

This example visualizes a round screen in a study involving The Typing Game. Participants were asked to type words as they appeared on the grid. As time elapsed, the words would drop off the grid if not typed correctly. The `data` folder contains sample input files.

### Library Dependencies
  * jQuery
  * jQueryUI
  * FontAwesome
  * Bootstrap 3

### Plugins Used

#### Preprocessors
  * Keystrokes
  * Gaze fixations
  * Custom gaze position correction plugin to transform full screen eye positions into visualization coordinates.

#### UI Modules
  * File Loader
  * Controls
  * Timeline
  * Custom replay area

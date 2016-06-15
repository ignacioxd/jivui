# Getting Started with JIVUI

JIVUI is a purely client-side application that runs on a Web browser. However, to overcome Web browsers' security constraints you will need to host JIVUI on a Web server. Any web server that can serve static files will do, either on a remote server or on a server running on the same computer.

## Supported Browsers

Different browsers have different JavaScript engines, each with their own limitations. Currently, JIVUI runs on the following Web browsers:

  * Google Chrome
  * Firefox
  * Safari

## Running JIVUI

JIVUI's base and examples run out-of-the-box. For example, if you put JIVUI on a folder called `jivui` in the root of your served content, and if your server is listening on port 80, you can load JIVUI by opening `http://localhost/jivui/dist` on your Web browser. You can run any of the examples in the same way by pointing your browser to the path of the example you would like to run.

## Visualizing Your Own Data

The first step to visualizing your own data is to feed it into JIVUI in the correct format. The [JIVUI's JSON Data Description](input_data_description.md) section of the documentation describes this format in detail.

Once you have your data in JIVUI's expected format, you may want to customize the UI so that the replay resembles the user interface used during data collection (in the case of empirical data), or of a target interface (in the case of model data). The interface is provided to JIVUI in the form of a UI Module, as described in [Plug-ins and Plug-in Architecture](plugins.md). You can also look at the `examples` folder for included examples to get a better idea of what an UI Module with a custom UI looks like.

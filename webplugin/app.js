const express = require('express')
var compressor = require('node-minify');
const cors =require("cors");
const bodyParser = require('body-parser');
const validate = require('express-validation');
const path= require("path");
const app = express();
const webpluginController=require("./src/webplugin/controller");
const config = require("./conf/config").config;
const port = config.port || 3991


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());
app.use('/plugin', express.static(path.join(__dirname,"src/webplugin")));
app.use('/plugin/sidebox', express.static(path.join(__dirname,"src/webplugin")));
app.get('/kommunicate.app', webpluginController.getPlugin);



// minify applozic plugin code files into a single file
compressor.minify({
  //compressor: 'gcc',
   compressor: 'no-compress',
  input: ['./src/webplugin/lib/js/jquery-3.2.1.min.js','./src/webplugin/lib/js/mck-ui-widget.min.js', './src/webplugin/lib/js/mck-ui-plugins.min.js', './src/webplugin/lib/js/mqttws31.js', './src/webplugin/lib/js/mck-emojis.min.js',
  './src/webplugin/lib/js/howler-2.0.2.min.js', './src/webplugin/lib/js/tiny-slider-2.4.0.js', './src/webplugin/lib/js/mustache.js', './src/webplugin/lib/js/aes.js', './src/webplugin/js/app/km-utils.js'],
  output: './src/webplugin/js/kommunicatepluginrequirements.min.js',
  callback: function (err, min) {
    if(!err){
    console.log(" kommunicatepluginrequirements.min.js combined successfully");
    }
    else {
      console.log("err while minifying kommunicatepluginrequirements.min.js",err);
    }
  }
});

// minify applozic css files into a single file
compressor.minify({
  compressor: 'clean-css',
  // compressor: 'no-compress',
  input: ['./src/webplugin/lib/css/mck-combined.min.css', './src/webplugin/css/app/mck-sidebox-1.0.css', './src/webplugin/css/app/km-rich-message.css', './src/webplugin/css/app/km-login-model.css',
  './src/webplugin/lib/css/tiny-slider-2.4.0.css'],
  output: './src/webplugin/css/kommunicatepluginrequirements.min.css',
  options: {
  advanced: true, // set to false to disable advanced optimizations - selector & property merging, reduction, etc.
  aggressiveMerging: true, // set to false to disable aggressive merging of properties.
  sourceMap: true
  },
  callback: function (err, min) {
    if(!err){
    console.log(" kommunicatepluginrequirements.min.css combined successfully");
    }
    else {
      console.log("err while minifying kommunicatepluginrequirements.min.css",err);
    }
  }
});

compressor.minify({
  compressor: 'gcc',
  // compressor: 'no-compress',
  input: ['./src/webplugin/knowledgebase/common.js', './src/webplugin/knowledgebase/helpdocs.js', './src/webplugin/knowledgebase/kb.js'],
  output: './src/webplugin/knowledgebase/kommunicate-kb-0.1.min.js',
  callback: function (err, min) {
    if(!err)
    console.log(" kommunicate-kb-0.1.min.js combined successfully");
    else {
      console.log("err while minifying kommunicate-kb-0.1.min.js",err);
    }
  }
});
compressor.minify({
  //compressor: 'gcc',
  compressor: 'uglify-es',
  input: ['./src/webplugin/knowledgebase/kommunicate-kb-0.1.min.js','./src/webplugin/js/app/kommunicate-client.js','./src/webplugin/js/app/kommunicate.js','./src/webplugin/js/app/km-richtext-markup-1.0.js','./src/webplugin/js/app/mck-sidebox-1.0.js','./src/webplugin/js/app/km-rich-text-event-handler.js','./src/webplugin/js/app/kommunicate-ui.js','./src/webplugin/js/app/km-post-initialization.js', './src/webplugin/js/app/mck-ringtone-service.js'],
  output: './src/webplugin/js/app/km-chat-combined-0.1.min.js',
  callback: function (err, min) {
    if(!err)
    console.log(" km-chat-combined-0.1.min.js combined successfully");
    else {
      console.log("err while minifying kkm-chat-combined-0.1.min.js",err);
    }
  }
});

compressor.minify({

  compressor: 'no-compress',
  input: ['./src/webplugin/js/app/applozic.jquery.js','./src/webplugin/js/app/applozic.chat.min.js','./src/webplugin/js/app/km-chat-combined-0.1.min.js'],
  output: './src/webplugin/js/app/kommunicate-plugin-0.2.min.js',
  callback: function (err, min) {
    if(!err)
    console.log(" kommunicate-plugin-0.2.min.js combined successfully");
    else {
      console.log("err while minifying kommunicate-plugin-0.2.min.js",err);
    }
  }
});

compressor.minify({
  compressor: 'clean-css',
  input: ['./src/webplugin/css/app/km-rich-message.css','./src/webplugin/css/app/mck-sidebox-1.0.css'],
  output: './src/webplugin/js/app/mck-sidebox-1.0.min.css',
  callback: function (err, min) {
    if(!err)
    console.log("mck-sidebox-1.0.css minified successfully");
    else {
      console.log("err while minifying mck-sidebox-1.0.css",err);
    }
  }
});

app.listen(port, () => {
  console.log('app listening on port! ', port)
});
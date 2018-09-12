const path = require("path");
const fs=require('fs');
const config = require("../../conf/config").config;
exports.getPlugin =(req,res)=>{
  const PLUGIN_SETTING = config.pluginProperties;
  const MCK_CONTEXTPATH = config.hostUrl
  const MCK_STATICPATH = MCK_CONTEXTPATH+"/plugin";


  fs.readFile(path.join(__dirname,"/plugin.js"), 'utf8', function (err,data) {
  if (err) {
    res.send("err while getting plugin...");
    return console.log(err);
  }
  var plugin= data.replace(":MCK_CONTEXTPATH",MCK_CONTEXTPATH)
                  .replace(":MCK_STATICPATH",MCK_STATICPATH)
                  .replace(":PRODUCT_ID","kommunicate")
                  .replace(":PLUGIN_SETTINGS",JSON.stringify(PLUGIN_SETTING));
  res.setHeader('content-type', 'application/javascript');
  res.send(plugin);
  console.log("plugin code sent successfully:\n with config \n MCK_CONTEXTPATH: ",MCK_CONTEXTPATH,
              "MCK_STATICPATH: ", MCK_STATICPATH, 
              "PLUGIN_SETTING: ", JSON.stringify(PLUGIN_SETTING));
  });

}

const express =require("express");
const path= require("path");
const bodyParser = require('body-parser');
const config = require("./conf/config");
const routes = require("./src/routers/routes.js");
const app =express();
const Sequelize = require("sequelize");
const port = config.getProperties().port;
const db = require("./src/models");
const homeRouter = require("./src/models");
const cors =require("cors");
const validate = require('express-validation');
var compressor = require('node-minify');
var cleanCss = require ('clean-css');
var hazelCastClient= require("./src/cache/hazelCacheClient");
const eventProcessor= require("./src/events/eventProcessor");
const cronInitializer = require('./src/cron/cronJobInitializer');
const Sentry = require('@sentry/node');
require('./src/webplugin/pluginOptimizer')
global['__basedir'] = __dirname
//var concat = require('concat-files');
app.use(cors());
process.env.NODE_ENV?console.log("\x1b[41m ------Warning: build running into "+process.env.NODE_ENV+" -----\x1b[0m"):console.log("\x1b[41m ------Warning: environment is not -----\x1b[0m");
// minify applozic plugin code files into a single file
const sentryConfig = config.getProperties().thirdPartyIntegration.sentry.server;
sentryConfig.enable && Sentry.init({ 
  dsn: sentryConfig.dsn 
});

app.set("db",db);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//static patchCustomerapp.use('/css', express.static("css"));
app.use('/plugin', express.static(path.join(__dirname,"src/webplugin")));
app.use('/plugin/sidebox', express.static(path.join(__dirname,"src/webplugin")));

app.use('/img', express.static("img"));
app.use('/chat/js',express.static("src/chat-demo"));

//app.use('/',routes.home);
app.use('/',routes.home);
app.use('/users',routes.users);
app.use('/applications',routes.applications);
app.use('/login',routes.login);
app.use('/customers',routes.customers);
app.use('/misc',routes.misc);
app.use('/autosuggest/message',routes.autoSuggest);
//not in use. customer/applozic is being used for applozic signup.
//app.use('/signUpWithApplozic',routes.signUpWithApplozic);
app.use('/chat',routes.chat);
app.use('/profileImage',routes.profileImage);
app.use('/conversations',routes.conversation);
app.use('/group',routes.group);
app.use('/issuetype', routes.issueType);
app.use('/issuetype/autoreply', routes.issueTypeAutoReply);
app.use('/zendesk', routes.zendesk);
app.use('/integration/settings', routes.thirdPartySetting);
app.use('/kb',routes.faq);
app.use('/google', routes.googleAuth);
app.use('/subscription', routes.subscription);
app.use('/agilecrm', routes.agile);
app.use('/settings',routes.setting);
app.use('/v2/users',routes.v2UserRouter);
app.use('/metabase',routes.metabaseRouter);

//Cron Time Stamp Route
app.use('/crontime',routes.cronServiceRouter);

//Chat Popup Route
app.use('/popup', routes.chatPopupRouter);

function startApp() {
    app.listen(port, function () {
        console.log('Express server listening on port : ' + port);
        //to do: start the event consumers
        eventProcessor.initializeEventsConsumers();
        cronInitializer.initiatAllCron();
    });
}

Promise.all([hazelCastClient.initializeClient(),db.sequelize.sync()])
    .then(startApp)
    .catch(e=> {
      console.log("error while syncing with db",e);
        throw new Error(e);
    });

/* app.use(function (err, req, res, next) {
  console.error(err.stack);
  console.log("executing error handlar",err);
  res.status(500).send('Something is broken!')
}) */

app.use((err, req,res,next)=>{
console.log("executing error handlar",err);
if (err instanceof validate.ValidationError){
res.status(err.status).json(err);
} else {
res.status(500).send(err);
}
});
module.exports = app;

import React, { Component } from 'react';
import './botDescription.css';

function getDescription(type){
    switch(type){
        case "ADD_BOT":
        return "You can create a bot here. This step will create a bot in Kommunicate system."+
        "you can configure it with any AI platform later";
        break;
        case "CONFIGURE_BOT":

        return "you can configure your Bot with any AI platform. Right now only Dialog Flow(Google's bot builder platform  is supported)."+
       "check out Dialog Flow here: https://dialogflow.com/ "+
        "let us know if you have any other platform in mind.";
        break;
    }
}



const BotDescription = {

    dialogflowV1: function() {

          return(
            <p>
              1. Login to  <a href ="https://console.dialogflow.com/api-client/#/login">Dialogflow console</a> <br />
             2. Select your Agent from dropdown in left panel.<br />
             3. Click on setting button. It will open a setting page for agent.<br />
             4. Inside general tab search for <b>API KEYS</b>.<br />
             5. Copy <b>Client access token</b> and <b>Developer access token</b> and paste here .<br />
          </p>);
    },

    dialogflowV2 : function(){
          return(
            <p>
              1. Login to  <a href ="https://console.dialogflow.com/api-client/#/login">Dialogflow console</a> <br />
              2. Select your Agent from dropdown in left panel.<br />
              3. Click on setting button. It will open a setting page for agent.<br />
              4. Inside general tab search for <b>GOOGLE PROJECTS</b> and click on your service account.<br />
              5. After getting redirected to your <b>SERIVICE ACCOUNT</b>, create key in JSON format for your project from <b>actions</b> section and it will get automatically downloaded.<br/>
              5. Now upload the <b>key file</b>.<br />
            </p>);
    }

}
export default BotDescription;
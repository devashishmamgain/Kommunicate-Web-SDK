import EventMessages from './event-messages';
import CommonUtils from './CommonUtils';

const EventMessageClient = { 

    getClientGroupId: function(userId) {
        return "km-onboarding-" + userId;
    },
    
    setupEventMessageGroup: function(userId) {
        let clientGroupId = this.getClientGroupId(userId);
        KommunicateGlobal.Applozic.ALApiService.getGroupInfo({
            data: {
                clientGroupId: clientGroupId,
            },
            success: function (response) { 
                if (response.status == "error") {                    
                    var conversationDetail = {
                        "clientGroupId": clientGroupId,
                        "botIds": ["eve"], // Optional. Pass the bot IDs of the bots you want to add in this conversation.
                        "skipRouting":"true", // Optional. If this parameter is set to 'true', then routing rules will be skipped for this conversation.
                        "assignee":"eve" // Optional. You can asign this conversation to any agent or bot. If you do not pass the ID. the conversation will assigned to the default agent.
                    };
                    Kommunicate.startConversation(conversationDetail, function (response) {
                        console.log("new conversation created");
                    });                    
                } else {
                    console.log("onboarding group exists");
                }
            },
            error: function () { }
        });
    },

    sendEventMessage: function(trigger) {
        if (!EventMessages[trigger]) {
          return;
        }
    
        KommunicateGlobal.Applozic.ALApiService.sendMessage({
          data: {
              message: {
                  "type": 5,
                  "contentType": 10,
                  "message": "Event: " + trigger,
                  "clientGroupId": this.getClientGroupId(CommonUtils.getUserSession().userName),
                  "metadata": {"category": "HIDDEN", "KM_TRIGGER_EVENT": trigger},
                  "source": 1
              }
          },
          success: function (response) { 
            console.log(response); 
          },
          error: function () { }
        });
      },
}

export default EventMessageClient;
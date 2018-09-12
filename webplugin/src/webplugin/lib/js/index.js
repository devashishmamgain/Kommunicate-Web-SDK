var applozicUI = new ApplozicUI();
function ApplozicUI() {

  var _this = this;
  var chatTemplate = '<div class="bubble ${youMeExpr}">${msgTextExpr}</div>';

  _this.loadConversation = function(channelId, isGroup) {
      $applozic.fn.applozic('messageList',
        {
          'id': channelId,
          'isGroup': isGroup,
          'callback': function(response) {
            //console.log(response);
            var messages = response.messages;
            var chats = "";
            for (var key in messages) {
              var message = messages[key];
                chats += chatTemplate.replace("${youMeExpr}", (message.type == 'outbox' ? "you" : "me"))
                  .replace("${msgTextExpr}", message.message);
              }
              $(".chat[data-mck-id='" + channelId + "']").append(chats);
          }
        });
  }


}

const db = require('../models');
const registrationService = require('../register/registrationService');
const appUtils = require('./utils');
const applozicClient = require("../utils/applozicClient");
const userService = require('../users/userService');
const defaultMessage ="Hi there! We are here to help you out. Send us a message and we will get back to you as soon as possible";

exports.postWelcomeMsg=(options)=>{
    return db.InAppMsg.find({where:{customerId:options.customer.id}}).then(inAppMessage=>{
        if(!inAppMessage){
            inAppMessage = {
                customerId:options.customer.id,
                eventId:appUtils.EVENTS.CONVERSATION_STARTED,
                message:options.message,
                status:appUtils.EVENT_STATUS.ENABLED
            }
            return db.InAppMsg.create(inAppMessage);
        }else{
            return db.InAppMsg.update({message:options.message},{where:{customerId:options.customer.id}});
        }
    })
}

const getInAppMessage=(customerId)=>{
    return db.InAppMsg.find({where:{customerId:customerId , eventId:appUtils.EVENTS.CONVERSATION_STARTED}});
}

/*exports.sendWelcomeMessage=(message,bot)=>{
    return db.InAppMsg.find({where:{customerId:bot.customerId}}).then(inAppMessage=>{
        //return applozicClient.sendGroupMessage
    });
}*/

exports.processConversationStartedEvent= (conversationId,customer, agentName)=>{
    return Promise.all([userService.getByUserNameAndAppId("bot",customer.applicationId), getInAppMessage(customer.id)]).then(([bot,inAppMessage])=>{

       let  message = inAppMessage&&inAppMessage.dataValues?inAppMessage.dataValues.message:defaultMessage;
        return applozicClient.sendGroupMessageByBot(conversationId,message,new Buffer(bot.userName+":"+bot.accessToken).toString('base64'),customer.applicationId).then(respons=>{
            return "success";
        })
    })
    
}

const countEnableRecordsInAppMsgs = (createdBy, customerId, eventId) => {

    return Promise.resolve(db.InAppMsg.count({where: {
            createdBy: createdBy,
            customerId:customerId,
            eventId:eventId,
            status: 1
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});


}

exports.createInAppMsg=(createdBy, customerId, body)=>{

  inAppMessage = {
      createdBy: createdBy,
      customerId:customerId,
      eventId:body.eventId,
      message:body.message,
      status:body.status,
      sequence: body.sequence,
      metadata: body.metadata
  }

  return countEnableRecordsInAppMsgs(createdBy, customerId, body.eventId)
      .then(countRecords => {
          console.log(countRecords)
          if(countRecords  <  3){
              return Promise.resolve(db.InAppMsg.create(inAppMessage)
                .then(response => {
                  console.log(response);
                  response.message = "Created"
                  response.countOfRecords =  countRecords;
                  return response;    
                }))
          }else{
            let response = {};
            response.message = "Limit reached"
            response.countOfRecords =  countRecords;
            return response;
          }
      }).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
}

exports.disableInAppMessages=(createdBy, customerId)=>{
    return Promise.resolve(db.InAppMsg.update({status: 2}, {
        where: {
            createdBy: createdBy,
            customerId: customerId,
            status: 1
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});

}

exports.enableInAppMessages=(createdBy, customerId)=>{
    return Promise.resolve(db.InAppMsg.update({status: 1}, {
        where: {
            createdBy: createdBy,
            customerId: customerId,
            status: 2
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
}

exports.getInAppMessages2=(createdBy, customerId)=>{
    return Promise.resolve(db.InAppMsg.findAll({
        where: {
            createdBy: createdBy,
            customerId: customerId
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
}

exports.getInAppMessagesByEventId=(createdBy, customerId, eventId)=>{
    return Promise.resolve(db.InAppMsg.findAll({
        where: {
            createdBy: createdBy,
            customerId: customerId,
            eventId: eventId
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
}

exports.softDeleteInAppMsg=(id)=>{
  return Promise.resolve(db.InAppMsg.update({status: 3}, {
        where: {
            id: id
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});

}

exports.getInAppMessage=getInAppMessage;
exports.defaultMessage = defaultMessage;
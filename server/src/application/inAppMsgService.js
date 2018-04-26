const db = require('../models');
const registrationService = require('../register/registrationService');
const appUtils = require('./utils');
const applozicClient = require("../utils/applozicClient");
const userService = require('../users/userService');
const logger = require('../utils/logger');
const defaultMessage ="Hi there! We are here to help you out. Send us a message and we will get back to you as soon as possible";
const Sequelize = require("sequelize");
const constant = require('./utils')

exports.postWelcomeMsg=(options)=>{
    return db.InAppMsg.find({where:{customerId:options.customer.id}}).then(inAppMessage=>{
        if(!inAppMessage){
            inAppMessage = {
                customerId:options.customer.id,
                eventId:appUtils.EVENTS.CONVERSATION_STARTED,
                message:options.message,
                status:appUtils.EVENT_STATUS.ENABLED,
               category:appUtils.IN_APP_MESSAGE_CETAGORY.WELCOME_MESSAGE 
            }
            return db.InAppMsg.create(inAppMessage);
        }else{
            return db.InAppMsg.update({message:options.message},{where:{customerId:options.customer.id}});
        }
    })
}

const getInAppMessage=(customerId, eventType)=>{
  console.log('geting data for', customerId );
  let criteria ={ customerId:customerId, status: appUtils.EVENT_STATUS.ENABLED};

  if (eventType){
    criteria.eventId=eventType
  }
    return db.InAppMsg.findAll(
      {
        where:criteria,
        order:[
          ['id', 'ASC']
        ]
      });
}

exports.sendWelcomeMessage=(conversationId, customer)=>{
  return userService.getByUserNameAndAppId("bot",customer.applicationId)
  .then(bot=>{
    return applozicClient.getGroupInfo(conversationId,customer.applicationId,bot.apzToken,true).then(groupDetail=>{
        // picking admin id if conversation Assignee is not available
        let conversationAssignee="";
        if(groupDetail){
          let conversationAssignee= groupDetail.metadata.CONVERSATION_ASSIGNEE?
          groupDetail.metadata.CONVERSATION_ASSIGNEE:groupDetail.adminId;
          return Promise.resolve(processConversationStartedEvent(constant.EVENT_ID.WELCOME_MESSAGE, conversationId, customer,null,conversationAssignee)).then(response => {
            logger.info("response in sendWelcomeMessage",response);
            return response;
          })
        }
        
    })
  })
 
}

exports.processEventWrapper = (eventType, conversationId, customer,adminUser, agentName) => {

    if(eventType == 1 || eventType == 2 || eventType == 3 || eventType == 4){
      let anonymous = true
      let offline = true
      let eventType = 1
      let apzToken = new Buffer(adminUser.userName+":"+adminUser.accessToken).toString('base64');
      return Promise.resolve(applozicClient.getGroupInfo(conversationId,customer.applicationId,apzToken))
        .then(groupInfo => {
            console.log("groupInfo")
            
            let groupUserRole3 = groupInfo.groupUsers.filter(groupUser => groupUser.role == 3);
            let groupUserRole2 = groupInfo.groupUsers.filter(groupUser => groupUser.role == 1);
            let conversationAssignee = groupInfo.metadata&&groupInfo.metadata.CONVERSATION_ASSIGNEE&&groupInfo.metadata.CONVERSATION_ASSIGNEE!=""?groupInfo.metadata.CONVERSATION_ASSIGNEE:groupUserRole2[0].userId;
            return {userId: groupUserRole3[0].userId, agentUserName: conversationAssignee}
        }).then( groupUser => {
            console.log("groupUser")
            return userService.getByUserNameAndAppId(groupUser.agentUserName,customer.applicationId)
            .then(res => {
              logger.info(res);
              logger.info(res.availabilityStatus)
              if(res.availabilityStatus == 1){
                offline = false
              }
              groupUser.agentId= res.id;
              return groupUser;
            }).then( groupUser => {
              let userId=groupUser.userId;
              console.log("userId")
              return applozicClient.getUserDetails([userId],customer.applicationId,apzToken)
              .then(userInfo => {
                console.log(userInfo);
                if(userInfo[0].hasOwnProperty("email") && userInfo[0].email){
                  anonymous = false;
                }
                if(offline && anonymous){
                  console.log(1);
                  return Promise.all([processConversationStartedEvent(1, conversationId, customer, agentName,groupUser.agentId)]).then(([response]) => {
                    console.log(response);
                    return response;
                  })
                }else if(offline && !anonymous){
                  console.log(2);
                  eventType = 2
                  return Promise.all([processConversationStartedEvent(2, conversationId, customer, agentName,groupUser.agentId)]).then(([response]) => {
                    console.log(response);
                    return response;
                  })
                } /*else if(!offline && anonymous || !offline && !anonymous){
                  eventType = 3
                  console.log(3);
                  return Promise.all([processConversationStartedEvent(3, conversationId, customer, agentName,groupUser.agentId)]).then(([response]) => {
                    console.log(response);
                    return response;
                  })
                }else if(!offline && !anonymous){
                  eventType = 4
                  return Promise.all([processConversationStartedEvent(4, conversationId, customer, agentName,groupUser.agentId)]).then(([response]) => {
                    console.log(response);
                    return response;
                  })
                }*/
                return "EVENT_NOT_SUPPORTED";
          })
    }).catch(err => {console.log(err)})
      })
    }else{
      return "EVENT_NOT_SUPPORTED"
    }
}

const processConversationStartedEvent= (eventType, conversationId, customer, agentName,agentId)=>{
  // inAppMessages.map(inAppMessage => {
  // hard coding event type to fix the welcome messag eissue. 
  // remove this once react changes goes to prod
  // only supporting event type =1;
   //eventType =1;
  if (!agentName) {
    agentName =agentId||customer.userName;
  }
    return Promise.all([userService.getByUserNameAndAppId(agentName,customer.applicationId), getInAppMessage(customer.id, eventType)]).then(([user,inAppMessages])=>{
      if(inAppMessages instanceof Array && inAppMessages.length > 0){
        
          let message1 = inAppMessages[0]
          let  message = message1 && message1.dataValues ? message1.dataValues.message:defaultMessage;
          console.log(message);
          return applozicClient.sendGroupMessage(conversationId,message,new Buffer(user.userName+":"+user.accessToken).toString('base64'),customer.applicationId,{"category": "ARCHIVE","skipBot":"true"})
            .then(response => {
              if(response.status == 200){
                if(inAppMessages[1]){
                  let message2 = inAppMessages[1]
                  let message = message2 && message2.dataValues ? message2.dataValues.message:defaultMessage;
                  applozicClient.sendGroupMessage(conversationId,message,new Buffer(user.userName+":"+user.accessToken).toString('base64'),customer.applicationId,{"category": "ARCHIVE","skipBot":"true"})
                    .then(response => {
                      if(response.status == 200){
                        if(inAppMessages[2]){
                          let message3 = inAppMessages[2]
                          let message = message3 && message3.dataValues ? message3.dataValues.message:defaultMessage;
                          applozicClient.sendGroupMessage(conversationId,message,new Buffer(user.userName+":"+user.accessToken).toString('base64'),customer.applicationId,{"category": "ARCHIVE","skipBot":"true"})
                            .then(response => {
                              if(response.status == 200){
                                return "succcess"
                              }
                            })
                        }
                        return "success";
                      }
                    })
                }
                return "success";
              }
            })
      }else{
        /*remove this to send default welcome message
        let  message = defaultMessage;
        return applozicClient.sendGroupMessageByBot(conversationId,message,new Buffer(bot.userName+":"+bot.accessToken).toString('base64'),customer.applicationId,{"category": "ARCHIVE"}).then(response=>{
            return "success";
          })*/
          return "no_message";
      }
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
      category: body.category,
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

exports.disableInAppMessages=(createdBy, customerId, category)=>{
    let criteria={customerId: customerId, status: 1, category: category};
    // if(constant.CATEGORY.AWAY_MESSAGE == category){
    //   //criteria.createdBy = createdBy
    // }
    return Promise.resolve(db.InAppMsg.update({status: 2}, { where: criteria})).catch(err => {
      return { code: err.parent.code, message: err.parent.sqlMessage }
    });

}

exports.enableInAppMessages=(createdBy, customerId, category)=>{
    let criteria={customerId: customerId, status: 2, category: category};
    // if(constant.CATEGORY.AWAY_MESSAGE == category){
    //   //criteria.createdBy = createdBy
    // }
    return Promise.resolve(db.InAppMsg.update({status: 1}, { where: criteria})).catch(err => {
      return { code: err.parent.code, message: err.parent.sqlMessage }
    });
}

exports.getInAppMessages2=(createdBy, customerId)=>{
    return Promise.resolve(db.InAppMsg.findAll({
        where: {
            createdBy: createdBy,
            customerId: customerId
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
}

exports.getInAppMessagesByEventIds=(createdBy, customerId, type, eventIds)=>{

  let criteria={};
  if(customerId){
    criteria.customerId=customerId;
  }
  
  if(eventIds.length>0){
    criteria.eventId={ $in:eventIds}
  }
  var order= [ ['id', 'ASC']];
  return Promise.resolve(db.InAppMsg.findAll({where: criteria, order, limit:3})).catch(err=>{
    return { code: err.parent.code, message: err.parent.sqlMessage }
  });
  
}

exports.getInAppMessagesByEventId=(createdBy, customerId, type, eventIds)=>{

  logger.info("createdBy", createdBy)
  logger.info("cusotmerId", customerId)
  logger.info("type", type)
  logger.info("eventIds", eventIds)
  // type = 3 for admin user include messages where createdBy is null
  if(type == 3){
    return Promise.resolve(db.InAppMsg.findAll({
        where: {
            createdBy:{
              [Sequelize.Op.or]: [null, createdBy]
            },
            customerId: customerId,
            eventId:{ $in:eventIds}
        },
        order: [
            ['id', 'ASC']
        ],
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
  }else{
    return Promise.resolve(db.InAppMsg.findAll({
        where: {
            createdBy: createdBy,
            customerId: customerId,
        },
        order: [
            ['id', 'ASC']
        ],
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
  }
}

exports.softDeleteInAppMsg=(id)=>{
  //TODO : remove hard coded status
  return Promise.resolve(db.InAppMsg.update({status: 3,deleted_at:new Date()}, {
        where: {
            id: id
        }
    })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});

}

exports.editInAppMsg=(body)=>{

  logger.info(body);
  return Promise.resolve(db.InAppMsg.update({message:body.message}, {
    where : {
      id: body.id
    }}).then(response => {
        logger.info("response is...");
        logger.info(response);
        response.message = "Edited"
        return response;    
      })).catch(err => {return { code: err.parent.code, message: err.parent.sqlMessage }});
}
/**
 * return 1st online user. return undefined if no agents are online. 
 */
exports.checkOnlineAgents=(customer)=>{
  return userService.getAllUsersOfCustomer(customer,[registrationService.USER_TYPE.ADMIN,registrationService.USER_TYPE.AGENT]).then(userList=>{
    let userIdList = userList.filter(user=>user.availabilityStatus==1).map(user=>user.userName);
    let defaultAgent = userList.filter(user=> user.type==3);
    //let avalableUserList = userList.filter(user=>user.availabilityStatus==1)
    logger.info("fetching detail of all agents from applozic");
    if(userIdList.length>0){
      return applozicClient.getUserDetails(userIdList,customer.applicationId, defaultAgent[0].apzToken);
    }else return Promise.resolve([]);
  }).then(agentsDetail=>{
    agentsDetail=agentsDetail||[];
    logger.info("got agent detail from applozic. checking if any agent is online..");
    return agentsDetail.find(agent=>agent.connected);
  })
}

exports.isGroupUserAnonymous=(customer,conversationId)=>{
logger.info("checking if group user is anonymous ");
return userService.getAdminUserByAppId(customer.applicationId).then(adminUser=>{
  let apzToken = new Buffer(adminUser.userName+":"+adminUser.accessToken).toString('base64');
  return Promise.resolve(applozicClient.getGroupInfo(conversationId,customer.applicationId,apzToken))
  .then(groupInfo => {
      logger.info("successfully got groupInfo from applozic for conversationId : ",conversationId);
      
      let groupUser= groupInfo.groupUsers.filter(groupUser => groupUser.role == 3);
      return applozicClient.getUserDetails([groupUser[0].userId],customer.applicationId,apzToken)
      .then(userInfo => { 
        logger.info("received group user info...");
       return Boolean(userInfo[0].email || userInfo[0].phoneNumber);
      })
    })
  })
}
exports.getInAppMessage=getInAppMessage;
exports.defaultMessage = defaultMessage;
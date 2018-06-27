const agileService= require('../agileCrm/agileService');
const applozicClient = require('../utils/applozicClient');
const logger = require('../utils/logger');


exports.processUserCreatedEvent=(user)=>{
    logger.info('processing user created event', user);
    agileService.createContact(null, user).then(data=>{
       if(!data){
           logger.info(" customer not integrated with agile crm, skipping");
       }
        let userToBeUpdated = {
            userId :user.userId,
            metadata:{"KM_AGILE_CRM":JSON.stringify({"contactId": data.id,"hide":true})}
        } 
        applozicClient.updateApplozicClient("bot","bot", user.applicationId, userToBeUpdated,null,true).then(data=>{
            logger.info("agile crm id is updated into user metadata");
        })
    }).catch(e=>{
        logger.error("error whle creating contact in agilecrm", e);
    })
};

exports.processUserUpdatedEvent= (user)=>{
    logger.info("processing user updated event.....",user);
   let  agileCrm = user.metadata && user.metadata.KM_AGILE_CRM && JSON.parse(user.metadata.KM_AGILE_CRM);

    let contactId =  agileCrm && agileCrm.contactId;
    if(contactId && user.applicationId){
        logger.info("updating agilecrmId ",contactId);
        user.metadata.KM_AGILE_CRM = agileCrm;
        agileService.updateContact(null,contactId, user).then(data=>{
            if(!data){
                logger.info(" customer not integrated with agile crm, skipping");
            }
            logger.info("updated successfully");

        }).catch(e=>{
            logger.error("error while updating contact id", contactId);           
        })
    }


}
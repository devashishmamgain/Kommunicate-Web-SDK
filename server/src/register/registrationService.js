const bcrypt= require("bcrypt");
const customerModel = require("../models").customer;
const userModel = require("../models").user;
const config= require("../../conf/config");
const db = require("../models");
const applozicClient = require("../utils/applozicClient");
const botPlatformClient = require("../utils/botPlatformClient");
const userService = require('../users/userService');
const fileService = require('../utils/fileService');
const mailService = require('../utils/mailService');
const path = require('path');
const KOMMUNICATE_APPLICATION_KEY = config.getProperties().kommunicateParentKey;
const KOMMUNICATE_ADMIN_ID =config.getProperties().kommunicateAdminId;
const KOMMUNICATE_ADMIN_PASSWORD =config.getProperties().kommunicateAdminPassword;
const USER_TYPE={"AGENT": 1,"BOT": 2,"ADMIN": 3};
const logger = require("../utils/logger");

exports.USER_TYPE = USER_TYPE;

exports.createCustomer = customer=>{
  // console.log("creating customer",customer);
  // default application name : a unique name
  return Promise.resolve(applozicClient.createApplication(KOMMUNICATE_ADMIN_ID,KOMMUNICATE_ADMIN_PASSWORD,"km-"+customer.userName+"-"+Math.floor(new Date().valueOf() * Math.random()))).then(application=>{
    console.log("successfully created ApplicationId: ",application.applicationId," creating applozic client");
  
    customer.applicationId=application.applicationId;
    customer.role="APPLICATION_WEB_ADMIN";
    return Promise.all([applozicClient.createUserInApplozic(customer),
                   /*applozicClient.createApplozicClient("agent","agent",application.applicationId,null,"APPLICATION_WEB_ADMIN"),*/
                   applozicClient.createApplozicClient("bot","bot",application.applicationId,null,"BOT")
    ]).then(([applozicCustomer,/*agent,*/bot])=>{
      customer.apzToken = new Buffer(customer.userName+":"+customer.password).toString('base64');
      let user = getUserObject(customer,applozicCustomer,application);
      customer.password= bcrypt.hashSync(customer.password, 10);
      customer.applicationId= application.applicationId;
      user.password=customer.password;
      return customerModel.create(customer).then(customer=>{
        console.log("persited in db",customer?customer.dataValues:null);
        user.customerId=customer?customer.dataValues.id:null;
        //let agentobj= getFromApplozicUser(agent,customer,USER_TYPE.ADMIN);
        let botObj = getFromApplozicUser(bot,customer,USER_TYPE.BOT);
        // update bot plateform
        Promise.resolve(botPlatformClient.createBot({
          "name": bot.userId,
          "key": bot.userKey,
          "brokerUrl": bot.brokerUrl,
          "accessToken": botObj.accessToken,
          "applicationKey": application.applicationId,
          "authorization": botObj.authorization,
          "type": "KOMMUNICATE_SUPPORT",
          "handlerModule":"DEFAULT_KOMMUNICATE_SUPPORT_BOT"
        })).then(result=>{
            console.log("bot platform updated....",result);
            return result;
        }).catch(err=>{
          console.log("err while updating bot plateform..",err);
        });
        return userModel.bulkCreate([user,/*agentobj,*/botObj]).spread((user,/*agent,*/bot)=>{
          console.log("user created",user?user.dataValues:null);
         // console.log("created agent",agent.dataValues);
          console.log("created bot ",bot.dataValues);
          return getResponse(user.dataValues,application);
        });
      });
    });
  }).catch(err=>{
    console.log("err while creating Customer ",err);
    throw err;
  });
};
const getUserObject = (customer,applozicCustomer,application)=>{
  let user = JSON.parse(JSON.stringify(customer));
  user.customerId=customer.id;
  // user.apzToken=new Buffer(customer.userName+":"+customer.password).toString('base64');
  user.authorization = new Buffer(customer.userName+":"+applozicCustomer.deviceKey).toString('base64');
  user.accessToken = customer.password;
  user.type = USER_TYPE.ADMIN;
  user.userKey= applozicCustomer.userKey;
  return user;
};

const getResponse = (customer,application)=>{
    let response=JSON.parse(JSON.stringify(customer));
    response.application=JSON.parse(JSON.stringify(application));
    return response;
};

exports.updateCustomer = (userId, customer) => {
  return Promise.resolve(customerModel.update(customer, { where: { "userName": userId } })).then(result => {
    console.log("successfully updated user", result[0]);
    userService.updateUser(userId, customer.applicationId, {name:customer.name, email:customer.email,companyName:customer.companyName})
    return result[0];
  }).catch(err => {
    console.log("error while updating user", err);
    throw err;
  });
};

exports.getCustomerByApplicationId = appId => {
  console.log("getting application by application Id", appId);
  return Promise.resolve(customerModel.findOne({ where: { applicationId: appId } }))
    .then(customer => {
      console.log("found data for customer : ", customer == null ? null : customer.dataValues);
      return customer !== null ? customer.dataValues : null;
    }).catch(err => {
      console.log("err while getting customer by application Id", err);
      throw err;
    });
};

const getFromApplozicUser= (applozicUser,customer,type)=>{
  let userObject = {};
  userObject.userName= applozicUser.userId;
  console.log("data",applozicUser);
  userObject.password= bcrypt.hashSync(applozicUser.userId, 10);
  userObject.apzToken= new Buffer(applozicUser.userId+":"+applozicUser.userId).toString('base64');
  userObject.customerId= customer.id;
  userObject.authorization= new Buffer(applozicUser.userId+":"+applozicUser.deviceKey).toString('base64');
  userObject.accessToken= applozicUser.userId,
  userObject.type= type;
  userObject.name=applozicUser.displayName;
  userObject.brokerUrl=applozicUser.brokerUrl;
  userObject.userKey=applozicUser.userKey;

  return userObject;
};

exports.getCustomerByUserName = userName=>{
  console.log("getting customer by UserName",userName);
  return Promise.resolve(db.customer.findOne({where: {userName: userName}}));
}; 

exports.isAdmin = (userName)=>{
  console.log("checkig if user is an admin", userName);
  return db.customer.findOne({where: {userName: userName}}).then(customer=>{
    return customer?true:false;
  });
}
/**
 * this method returns the customer information by id,
 * @param {Number} id
 * @return {Object} sequalize db object
 */
exports.getCustomerById = (id)=>{
  console.log("fetching customer information by Id", id);
  return db.customer.findOne({where: {id: id}}).then(customer=>{
    return customer;
  });
}
exports.sendWelcomeMail= (email, userName, agent, companyName)=>{
  console.log("sending welcome mail to ",email, companyName);
  let tamplatePath='';
  let templateReplacement='';
  let subject='';
  if(agent){
    let organization=companyName!==undefined && companyName!=null?companyName:'';
    subject="Thanks for joining"+organization+" on Kommunicate"
    templatePath= path.join(__dirname,"../mail/agentWelcomeMailTamplate.html"),
    templateReplacement ={":USER_NAME" : userName, ":ORGANIZATION": organization}
  }else{
    subject="Welcome to Kommunicate!"
    templatePath=path.join(__dirname,"../mail/welcomeMailTemplate.html"),
    templateReplacement= {":USER_NAME" : userName}
  }
  let mailOptions = {
    to:email,
    from:"Devashish From Kommunicate <support@kommunicate.io>",
    subject:subject,
    bcc:"techdisrupt@applozic.com",
    templatePath: templatePath,
    templateReplacement: templateReplacement
  }
  return mailService.sendMail(mailOptions);
}

const populateDataInKommunicateDb = (options,application,applozicCustomer,applozicBot)=>{
 let kmCustomer ={name:applozicCustomer.displayName,userName:options.userName,email:options.email,
 contactNo:applozicCustomer.contactNumber,applicationId:application.applicationId}  ;
 kmCustomer.password = bcrypt.hashSync(options.password, 10);
 kmCustomer.apzToken = new Buffer(options.userName+":"+options.password).toString('base64');

 let kmUser = {name:applozicCustomer.displayName,userName:options.userName,email:options.email,accessToken:options.password,role:options.role,type:USER_TYPE.ADMIN,userKey:applozicCustomer.userKey}
 kmUser.password = bcrypt.hashSync(options.password, 10);
 kmUser.apzToken = bcrypt.hashSync(options.password, 10);
 kmUser.authorization = new Buffer(options.userName+":"+applozicCustomer.deviceKey).toString('base64');
 kmUser.apzToken=new Buffer(options.userName+":"+options.password).toString('base64');

 return db.sequelize.transaction(t=> { 
  return customerModel.create(kmCustomer,{transaction:t}).then(customer=>{
    console.log("persited in db",customer?customer.dataValues:null);
    kmUser.customerId=customer?customer.dataValues.id:null;
    // update bot plateform
    let botObj = getFromApplozicUser(applozicBot,customer,USER_TYPE.BOT);
    Promise.resolve(botPlatformClient.createBot({
      "name": applozicBot.userId,
      "key": applozicBot.userKey,
      "brokerUrl": applozicBot.brokerUrl,
      "accessToken": applozicBot.userId,
      "applicationKey": application.applicationId,
      "authorization":new Buffer(applozicBot.userId+":"+applozicBot.deviceKey).toString('base64'),
      "type": "KOMMUNICATE_SUPPORT",
      "handlerModule":"DEFAULT_KOMMUNICATE_SUPPORT_BOT"
    })).then(result=>{
        console.log("bot platform updated....",result);
        return result;
    }).catch(err=>{
      console.log("err while updating bot plateform..",err);
    });
    return userModel.bulkCreate([kmUser,/*agentobj,*/botObj],{transaction:t}).spread((user,/*agent,*/bot)=>{
      console.log("user created",user?user.dataValues:null);
     // console.log("created agent",agent.dataValues);
      console.log("created bot ",bot.dataValues);
      return getResponse(user.dataValues,application);
    });
  });
})
}

exports.signUpWithApplozic = (options)=>{
    
  return applozicClient.getApplication({"applicationId":options.applicationId,"userName":options.userName,"accessToken":options.password}).then(application=>{
    return Promise.all([applozicClient.applozicLogin({"userName":options.userName,"password":options.password,"applicationId":options.applicationId,"roleName":"APPLICATION_WEB_ADMIN","email":options.email}),
    applozicClient.applozicLogin({"userName":"bot","password":"bot","applicationId":options.applicationId,"roleName":"BOT"})])
    .then(([customer,bot])=>{
      return applozicClient.updateApplozicClient(options.userName,options.password,options.applicationId,{userId:options.userName,roleName:"APPLICATION_WEB_ADMIN"})
      .then(updatedUser=>{
        options.role= "APPLICATION_WEB_ADMIN";
        return populateDataInKommunicateDb(options,application,customer,bot);
      })
    })

  }).catch(e=>{
    console.log("err",e);
    throw e;
  })
}

exports.getCustomerByAgentUserKey= (userKey) =>{
  logger.info("getting user detail from userKey : ",userKey);
  return userModel.findOne({where:{userKey:userKey}}).then(user=>{
    if(user){
      return customerModel.findOne({where:{id:user.customerId}});
    }else{
     throw new Error("User Not found");
    }
  });
}

exports.updateAgentRoutingState = (applicationId, routingState) =>{
  return customerModel.update({agentRouting:routingState}, {where: {applicationId: applicationId}}).then(res=>{
    return {message: "successfully updated"};
  }).catch(err=>{
    return {message: "routing update error "}
  });
}





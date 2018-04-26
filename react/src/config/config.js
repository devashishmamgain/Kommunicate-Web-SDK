var baseurl ={
  prod : {
   baseUrl: "https://chat.kommunicate.io",
   kommunicateAPI: "https://api.kommunicate.io",
   botPlatformAPI:"https://bots.applozic.com"
  },
  dashboard : {
   baseUrl: "https://chat.kommunicate.io",
   kommunicateAPI: "https://api.kommunicate.io",
   botPlatformAPI:"https://bots.applozic.com"
  },
  test:{
   baseUrl: "https://apps-test.applozic.com",
   kommunicateAPI: "https://api-test.kommunicate.io",
   botPlatformAPI:"https://bots-test.applozic.com"
  },
  default:{
   baseUrl: "https://apps-test.applozic.com",
  // baseUrl: "http://localhost:9090/applozic",
  //kommunicateAPI: "http://localhost:3999"
  kommunicateAPI: "https://api-test.kommunicate.io",
  //botPlatformAPI:"http://localhost:5454"
  botPlatformAPI:"https://bots-test.applozic.com"
  }
}
var config = {
  prod: {
      homeUrl:baseurl.prod.baseUrl,
      kommunicateBaseUrl : baseurl.prod.kommunicateAPI,
      kommunicateDashboardUrl:"https://dashboard.kommunicate.io",
      kommunicateWebsiteUrl: "https://www.kommunicate.io",
      applozicPlugin:{
      applozicHosturl:baseurl.prod.baseUrl,
      baseUrl:baseurl.prod.baseUrl+"/kommunicate.app",
      sendMessageUrl:baseurl.prod.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl:baseurl.prod.baseUrl+"/rest/ws/mail/send",
      userDetailUrl:baseurl.prod.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      registerClientUrl: baseurl.prod.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'https://bots.applozic.com/bot',
      editAppModule :baseurl.prod.baseUrl+"/rest/ws/appmodule/edit",
      certificateUpload :baseurl.prod.baseUrl+"/rest/ws/file/upload/cert",
      applicationList:baseurl.prod.baseUrl+'/rest/ws/user/getlist?roleNameList=APPLICATION_WEB_ADMIN',
      statsFilterUrl:baseurl.prod.baseUrl+"/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.prod.baseUrl+"/rest/ws/invite/dev",
      statsUrl:baseurl.prod.baseUrl+'/rest/ws/stats/get?appKey=:appKey',
      autoreplyUrl:'https://api.kommunicate.io/users/',
      getTimeZoneUrl:'https://api.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.prod.baseUrl+"/rest/ws/user/v2/create",
      updateApplozicUser: baseurl.prod.baseUrl+'/rest/ws/user/update'
    },kommunicateApi:{
      login:baseurl.prod.kommunicateAPI+"/login",
      signup:baseurl.prod.kommunicateAPI+"/customers",
      passwordResetUrl:baseurl.prod.kommunicateAPI+"/users/password-reset",
      passwordUpdateUrl:baseurl.prod.kommunicateAPI+"/users/password-update",
      pluginUrl:baseurl.prod.kommunicateAPI+"/kommunicate.app",
      createUser:baseurl.prod.kommunicateAPI+"/users",
      logo:baseurl.prod.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:"https://dashboard.kommunicate.io/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.prod.kommunicateAPI+"/misc/mail",
      signUpWithApplozic:baseurl.prod.kommunicateAPI+"/signUpWithApplozic",
      autoSuggest :baseurl.prod.kommunicateAPI+"/autosuggest/message",
      profileImage:baseurl.prod.kommunicateAPI+"/profileImage",
      subscriptionCount: baseurl.prod.kommunicateAPI + '/subscription/count'
    },adminDetails:{
      kommunicateParentKey: "applozic1a93cb1a2320be20d1e15353c3524c72d",
      kommunicateAdminId: "techdisrupt@applozic.com",
      kommunicateAdminPassword: "techdisrupt",
      kommunicateAdminApzToken: "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0",
    },
    port:5454
  },
  dashboard:{
    homeUrl:baseurl.dashboard.baseUrl,
    kommunicateBaseUrl : baseurl.dashboard.kommunicateAPI,
    kommunicateDashboardUrl:"https://dashboard-test.kommunicate.io",
     applozicPlugin:{
      applozicHosturl:baseurl.dashboard.baseUrl,
      baseUrl:baseurl.dashboard.baseUrl+"/kommunicate.app",
      sendMessageUrl:baseurl.dashboard.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl:baseurl.dashboard.baseUrl+"/rest/ws/mail/send",
      userDetailUrl:baseurl.dashboard.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      certificateUpload :baseurl.dashboard.baseUrl+"/rest/ws/file/upload/cert",
      editAppModule :baseurl.dashboard.baseUrl+"/rest/ws/appmodule/edit",
      registerClientUrl: baseurl.dashboard.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'https://bots.applozic.com/bot',
      applicationList:baseurl.dashboard.baseUrl+'/rest/ws/user/getlist?&roleNameList=APPLICATION_WEB_ADMIN',
      statsFilterUrl:baseurl.dashboard.baseUrl+"/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.dashboard.baseUrl+"/rest/ws/invite/dev",
      statsUrl:baseurl.dashboard.baseUrl+'/rest/ws/stats/get?appKey=:appKey',
      autoreplyUrl:'http://api-test.kommunicate.io/users/',
      getTimeZoneUrl:'http://api-test.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.dashboard.baseUrl+'/rest/ws/user/v2/create',
      updateApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/update',
    },kommunicateApi:{
      login:"https://api.kommunicate.io/login",
      signup:"https://api.kommunicate.io/customers",
      passwordResetUrl:"https://api.kommunicate.io/users/password-reset",
      passwordUpdateUrl:"https://api.kommunicate.io/users/password-update",
      pluginUrl:"https://api.kommunicate.io/kommunicate.app",
      createUser:baseurl.dashboard.kommunicateAPI+"/users",
      logo:baseurl.dashboard.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:"https://dashboard.kommunicate.io/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.dashboard.kommunicateAPI+"/misc/mail",
      signUpWithApplozic:baseurl.dashboard.kommunicateAPI+"/signUpWithApplozic",
      autoSuggest :baseurl.dashboard.kommunicateAPI+"/autosuggest/message",
      profileImage:baseurl.dashboard.kommunicateAPI+"/profileImage",
      subscriptionCount: baseurl.dashboard.kommunicateAPI + '/subscription/count'
    },adminDetails:{
      kommunicateParentKey: "applozic2de64d50463586b9568467a1df9d21102",
      kommunicateAdminId: "suraj@applozic.com",
      kommunicateAdminPassword: "1234567890",
      kommunicateAdminApzToken: "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA=",
    },
    port:5454
  },
  test:{
     homeUrl:baseurl.test.baseUrl,
     kommunicateBaseUrl : baseurl.test.kommunicateAPI,
     kommunicateDashboardUrl:"https://dashboard-test.kommunicate.io",
     kommunicateWebsiteUrl: "https://test.kommunicate.io",
     applozicPlugin:{
      applozicHosturl:"https://apps-test.applozic.com/",
      baseUrl:"https://apps-test.applozic.com/kommunicate.app",
      sendMessageUrl:baseurl.test.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl:baseurl.test.baseUrl+"/rest/ws/mail/send",
      userDetailUrl:baseurl.test.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      registerClientUrl: baseurl.test.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'https://bots-test.applozic.com/bot',
      certificateUpload :baseurl.test.baseUrl+"/rest/ws/file/upload/cert",
      editAppModule :baseurl.test.baseUrl+"/rest/ws/appmodule/edit",
      statsUrl:'https://apps-test.applozic.com/rest/ws/stats/get?appKey=:appKey',
      applicationList:baseurl.test.baseUrl+'/rest/ws/user/getlist?roleNameList=APPLICATION_WEB_ADMIN',
      statsFilterUrl:"https://apps-test.applozic.com/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.test.baseUrl+"/rest/ws/v2/invite/dev",
      autoreplyUrl:'https://api-test.kommunicate.io/users/',
      getTimeZoneUrl:'https://api-test.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.test.baseUrl+'/rest/ws/user/v2/create',
      updateApplozicUser: baseurl.test.baseUrl+'/rest/ws/user/update',
    },kommunicateApi:{
      login:"https://api-test.kommunicate.io/login",
      signup:"https://api-test.kommunicate.io/customers",
      passwordResetUrl:"https://api-test.kommunicate.io/users/password-reset",
      passwordUpdateUrl:"https://api-test.kommunicate.io/users/password-update",
      pluginUrl:"https://api-test.kommunicate.io/kommunicate.app",
      createUser:baseurl.test.kommunicateAPI+"/users",
      logo:baseurl.test.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:"https://dashboard-test.kommunicate.io/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.test.kommunicateAPI+"/misc/mail",
      signUpWithApplozic:baseurl.test.kommunicateAPI+"/signUpWithApplozic",
      autoSuggest :baseurl.test.kommunicateAPI+"/autosuggest/message",
      profileImage:baseurl.test.kommunicateAPI+"/profileImage",
      subscriptionCount: baseurl.test.kommunicateAPI + '/subscription/count'
    },adminDetails:{
      kommunicateParentKey: "applozic2de64d50463586b9568467a1df9d21102",
      kommunicateAdminId: "suraj@applozic.com",
      kommunicateAdminPassword: "1234567890",
      kommunicateAdminApzToken: "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA=",
    },
    port:5454

  },
  development: {
    homeUrl:baseurl.default.baseUrl,
    kommunicateBaseUrl : baseurl.default.kommunicateAPI,
    kommunicateDashboardUrl:"https://dashboard-test.kommunicate.io",
    kommunicateWebsiteUrl: "https://test.kommunicate.io",
    applozicPlugin:{
      applozicHosturl:"https://apps-test.applozic.com",
      baseUrl:"http://api-test.kommunicate.io/kommunicate.app",
      sendMessageUrl:baseurl.default.baseUrl+"/rest/ws/message/v2/send",
      sendMailUrl: "https://apps-test.applozic.com/applozic/rest/ws/mail/send",
      userDetailUrl:baseurl.default.baseUrl+"/rest/ws/user/v2/detail?v=2.1",
      registerClientUrl: baseurl.default.baseUrl+"/rest/ws/register/client",
      addBotUrl: 'https://bots-test.applozic.com/bot',
      statsUrl:'https://apps-test.applozic.com/rest/ws/stats/get?appKey=:appKey',
      applicationList:baseurl.default.baseUrl+'/rest/ws/user/getlist?roleNameList=APPLICATION_WEB_ADMIN',
      certificateUpload :baseurl.default.baseUrl+"/rest/ws/file/upload/cert",
      editAppModule :baseurl.default.baseUrl+"/rest/ws/appmodule/edit",
      statsFilterUrl:"https://apps-test.applozic.com/rest/ws/stats/filter?appKey=:appKey",
      devUrl:baseurl.default.baseUrl+"/rest/ws/v2/invite/dev",
      autoreplyUrl:'https://api-test.kommunicate.io/users/',
      getTimeZoneUrl:'https://api-test.kommunicate.io/misc/tz',
      createApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/v2/create',
      updateApplozicUser: baseurl.default.baseUrl+'/rest/ws/user/update',
    },
    kommunicateApi:{
      login:baseurl.default.kommunicateAPI+"/login",
      signup:baseurl.default.kommunicateAPI+"/customers",
      passwordResetUrl:baseurl.default.kommunicateAPI+"/users/password-reset",
      passwordUpdateUrl:baseurl.default.kommunicateAPI+"/users/password-update",
      pluginUrl:baseurl.default.kommunicateAPI+"/kommunicate.app",
      signUpWithApplozic:baseurl.default.kommunicateAPI+"/signUpWithApplozic",
      createUser:baseurl.default.kommunicateAPI+"/users",
      logo:baseurl.default.kommunicateAPI+"/img/logo1.png",
      activateAccountUrl:baseurl.default.kommunicateAPI+"/register?invite=true&applicationId=:applicationId",
      sendMail :baseurl.default.kommunicateAPI+"/misc/mail",
      autoSuggest :baseurl.default.kommunicateAPI+"/autosuggest/message",
      profileImage:baseurl.default.kommunicateAPI+"/profileImage",
      subscriptionCount: baseurl.default.kommunicateAPI + '/subscription/count'
    },adminDetails:{
      kommunicateParentKey: "applozic2de64d50463586b9568467a1df9d21102",
      kommunicateParentAppName: "suraj",
      kommunicateAdminId: "suraj@applozic.com",
      kommunicateAdminPassword: "1234567890",
      kommunicateAdminApzToken: "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA=",
    },
    port:5454
  },
  resources:{
    defaultImageUrl:"/img/avatars/default.png"
  },
  
}

export function get(env) {
  return config[env] || config.development;
}
export function getEnvironmentId() {
return process.env.REACT_APP_NODE_ENV || "development";
}
export function getConfig() {
  var env =process.env.REACT_APP_NODE_ENV;
 return config[env] || config.development;
}
export function getResource(){
  return config['resources'];
}
export function getBaseUrl(){
  var env =process.env.REACT_APP_NODE_ENV;
  return baseurl[env] || baseurl.default;
}
export {baseurl};

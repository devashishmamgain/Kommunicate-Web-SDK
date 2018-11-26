export default {
    "development":{
    "baseurl": {
        "applozicAPI": "https://apps-test.applozic.com",
        "kommunicateAPI": "https://api-test.kommunicate.io",
        "botPlatformAPI": "https://bots-test.applozic.com"
    },
    "kommunicateDashboardUrl": "https://dashboard-test.kommunicate.io",
    "kommunicateWebsiteUrl": "https://test.kommunicate.io",
    "applozicWebsiteUrl": "https://test.applozic.com",
    "adminDetails": {
        "kommunicateParentKey": "applozic2de64d50463586b9568467a1df9d21102",
        "kommunicateParentAppName": "suraj",
        "kommunicateAdminId": "suraj@applozic.com",
        "kommunicateAdminPassword": "1234567890",
        "kommunicateAdminApzToken": "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
    },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png"
    },
    "services":{
        'baseurl':"https://kong-api.applozic.com"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': false,
            'dsn': "https://2bb347bba0df43d3933fe9b80021e948@sentry.io/1324242"
        }
    }
},

"test" : {

    "baseurl": {
        "applozicAPI": "https://apps-test.applozic.com",
        "kommunicateAPI": "https://api-test.kommunicate.io",
        "botPlatformAPI": "https://bots-test.applozic.com"
    },
    "kommunicateDashboardUrl": "https://dashboard-test.kommunicate.io",
    "kommunicateWebsiteUrl": "https://test.kommunicate.io",
    "applozicWebsiteUrl": "https://test.applozic.com",
    "adminDetails": {
        "kommunicateParentKey": "applozic2de64d50463586b9568467a1df9d21102",
        "kommunicateParentAppName": "suraj",
        "kommunicateAdminId": "suraj@applozic.com",
        "kommunicateAdminPassword": "1234567890",
        "kommunicateAdminApzToken": "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
    },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png"
    },
    "services":{
        'baseurl':"https://kong-api.applozic.com"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': true,
            'dsn': "https://2bb347bba0df43d3933fe9b80021e948@sentry.io/1324242"
        }
    }
},
    
"staging" : {

    "baseurl": {
        "applozicAPI": "https://apps-test.applozic.com",
        "kommunicateAPI": "https://api-staging.kommunicate.io",
        "botPlatformAPI": "https://bots-staging.applozic.com"
    },
    "kommunicateDashboardUrl": "https://dashboard-staging.kommunicate.io",
    "kommunicateWebsiteUrl": "https://test.kommunicate.io",
    "applozicWebsiteUrl": "https://test.applozic.com",
    "adminDetails": {
        "kommunicateParentKey": "applozic2de64d50463586b9568467a1df9d21102",
        "kommunicateParentAppName": "suraj",
        "kommunicateAdminId": "suraj@applozic.com",
        "kommunicateAdminPassword": "1234567890",
        "kommunicateAdminApzToken": "c3VyYWpAYXBwbG96aWMuY29tOjEyMzQ1Njc4OTA="
    },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png"
    },
    "services":{
        'baseurl':"https://kong-api.applozic.com"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': false,
            'dsn': "https://2bb347bba0df43d3933fe9b80021e948@sentry.io/1324242"
        }
    }
},
    
 "prod" :{

    "baseurl": {

        "applozicAPI": "https://chat.kommunicate.io",
        "kommunicateAPI": "https://api.kommunicate.io",
        "botPlatformAPI":"https://bots.applozic.com"

    },
    "kommunicateDashboardUrl": "https://dashboard.kommunicate.io",
    "kommunicateWebsiteUrl": "https://www.kommunicate.io",
    "applozicWebsiteUrl": "https://www.applozic.com",
    "adminDetails":{
        "kommunicateParentKey": "applozic1a93cb1a2320be20d1e15353c3524c72d",
        "kommunicateAdminId": "techdisrupt@applozic.com",
        "kommunicateAdminPassword": "techdisrupt",
        "kommunicateAdminApzToken": "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0"
      },
    "resources": {
        "defaultImageUrl": "/img/avatars/default.png"
    },
    "services":{
        'baseurl':"https://services.kommunicate.io"
    },
    "thirdPartyIntegration":{
        'sentry' :{
            //Sentry:error tracking platform
            'enable': true,
            'dsn': "https://dcf240024fff420794ba240526b2c223@sentry.io/1324431"
        }
    }
},
    
"prod_ca" :{
   "baseurl": {
       "applozicAPI": "https://chat-ca.kommunicate.io",
       "kommunicateAPI": "https://api-ca.kommunicate.io",
       "botPlatformAPI":"https://bot-ca.kommunicate.io",
       "komunicateSupportUrl": "https://chat.kommunicate.io"
   },
   "kommunicateDashboardUrl": "https://dashboard-ca.kommunicate.io",
   "kommunicateWebsiteUrl": "https://www.kommunicate.io",
   "applozicWebsiteUrl": "https://www.applozic.com",
   "adminDetails":{
       "kommunicateParentKey": "applozic1a93cb1a2320be20d1e15353c3524c72d",
       "kommunicateAdminId": "techdisrupt@applozic.com",
       "kommunicateAdminPassword": "techdisrupt",
       "kommunicateAdminApzToken": "dGVjaGRpc3J1cHRAYXBwbG96aWMuY29tOnRlY2hkaXNydXB0"
     },
   "resources": {
       "defaultImageUrl": "/img/avatars/default.png"
   },
   "services":{
       'baseurl':"https://services.kommunicate.io"
   },
   "thirdPartyIntegration":{
    'sentry' :{
        //Sentry:error tracking platform
        'enable': true,
        'dsn': "https://dcf240024fff420794ba240526b2c223@sentry.io/1324431"
    }
   }
}
}


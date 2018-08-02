---
id: ios-pushnotification
title: Push Notification
sidebar_label: Push Notification
---


## Push Notification Setup


Add import statement in AppDelegate file to access the methods
```
import Kommunicate
```

### a) Send device token to Kommunicate server:

In your AppDelegate’s **didRegisterForRemoteNotificationsWithDeviceToken** method send device registration to Kommunicate server after you get deviceToken from APNS. Sample code is as below:             

```
func application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data)
{

    print("DEVICE_TOKEN_DATA :: \(deviceToken.description)")  // (SWIFT = 3) : TOKEN PARSING

    var deviceTokenString: String = ""
    for i in 0..<deviceToken.count
    {
        deviceTokenString += String(format: "%02.2hhx", deviceToken[i] as CVarArg)
    }
    print("DEVICE_TOKEN_STRING :: \(deviceTokenString)")

    if (KMUserDefaultHandler.getApnDeviceToken() != deviceTokenString)
    {
        let kmRegisterUserClientService: KMRegisterUserClientService = KMRegisterUserClientService()
        kmRegisterUserClientService.updateApnDeviceToken(withCompletion: deviceTokenString, withCompletion: { (response, error) in
            print ("REGISTRATION_RESPONSE :: \(String(describing: response))")
        })
    }
}

```


### b) Receiving push notification:

Once your app receives notification, pass it to Kommunicate handler for chat notification processing.

```
func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any]) {
    print("Received notification :: \(userInfo.description)")
    let kmPushNotificationService: KMPushNotificationService = KMPushNotificationService()
    kmPushNotificationService.notificationArrived(to: application, with: userInfo)
}

func application(_ application: UIApplication, didReceiveRemoteNotification userInfo: [AnyHashable: Any], fetchCompletionHandler
    completionHandler: @escaping (UIBackgroundFetchResult) -> Void) {
    print("Received notification With Completion :: \(userInfo.description)")
    let kmPushNotificationService: KMPushNotificationService = KMPushNotificationService()
    kmPushNotificationService.notificationArrived(to: application, with: userInfo)
    completionHandler(UIBackgroundFetchResult.newData)
}                                                        
```


### c) Handling app launch on notification click:

```
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplicationLaunchOptionsKey: Any]?) -> Bool {

    registerForNotification()

    KMPushNotificationHandler.shared.dataConnectionNotificationHandler()
    let kmApplocalNotificationHandler : KMAppLocalNotification =  KMAppLocalNotification.appLocalNotificationHandler()
    kmApplocalNotificationHandler.dataConnectionNotificationHandler()

    if (launchOptions != nil)
    {
        let dictionary = launchOptions?[UIApplicationLaunchOptionsKey.remoteNotification] as? NSDictionary

        if (dictionary != nil)
        {
            print("launched from push notification")
            let kmPushNotificationService: KMPushNotificationService = KMPushNotificationService()

            let appState: NSNumber = NSNumber(value: 0 as Int32)
            let kommunicateProcessed = kmPushNotificationService.processPushNotification(launchOptions,updateUI:appState)
              if !kommunicateProcessed {
                //Note: notification for app
              }
        }
    }
    return true
}

func registerForNotification() {
  if #available(iOS 10.0, *) {
      UNUserNotificationCenter.current().requestAuthorization(options:[.badge, .alert, .sound]) { (granted, error) in

          if granted {
              DispatchQueue.main.async {
                  UIApplication.shared.registerForRemoteNotifications()
              }
          }
      }
  } else {
      // Fallback on earlier versions
      let settings = UIUserNotificationSettings(types: [.alert, .badge, .sound], categories: nil)
      UIApplication.shared.registerUserNotificationSettings(settings)
      UIApplication.shared.registerForRemoteNotifications()

  }
}

```
### d)  AppDelegate changes to observe background/foreground notification:

```
func applicationDidEnterBackground(_ application: UIApplication) {
    print("APP_ENTER_IN_BACKGROUND")
    NotificationCenter.default.post(name: Notification.Name(rawValue: "APP_ENTER_IN_BACKGROUND"), object: nil)
}

```
 ```
 func applicationWillEnterForeground(_ application: UIApplication) {
     KMPushNotificationService.applicationEntersForeground()
     print("APP_ENTER_IN_FOREGROUND")

     NotificationCenter.default.post(name: Notification.Name(rawValue: "APP_ENTER_IN_FOREGROUND"), object: nil)
     UIApplication.shared.applicationIconBadgeNumber = 0
 }
```

### e) Save Context when app terminates:

```
    func applicationWillTerminate(application: UIApplication) {
        KMDBHandler.sharedInstance().saveContext()
    }
```

You can check the sample AppDelegate file [here](https://github.com/Kommunicate-io/Kommunicate-iOS-SDK/blob/master/Example/Kommunicate/AppDelegate.swift).

## Certificates

Upload development and distribution APNS certificates on Kommunicate dashboard so that we can send the notifications.

Note: Make sure `Push Notification` is `On`. Also, select the `Background fetch` and `Remote notifications` options in `Background Modes`. This you need to do in your target's capabilities section.
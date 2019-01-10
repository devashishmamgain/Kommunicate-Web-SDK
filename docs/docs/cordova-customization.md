---
id: cordova-customization
title: Customization
sidebar_label: Customization
---

## Android
Kommunicate provides easy settings to customise message text color, background colors and enable of disable any particular feature.

Follow the below steps:
1) Download the setting file from [here](https://github.com/Kommunicate-io/Kommunicate-Android-Chat-SDK/blob/master/app/src/main/assets/applozic-settings.json).
2) Place the downloaded applozic-settings.json file under your platforms/android/app/src/main/assets directory

There are a lot of customisation options in the file, refer [this link](https://docs.applozic.com/docs/android-chat-theme-and-customization#section-applozic-settings-json-properties-detail) for more details.

### Hiding/Showing media attachment and location sharing options:
You can hide or show the media attachments options like camera,files and location sharing by changing the below values in applozic-settings.json file.
Make an option false if you want to hide it.

```json
"attachmentOptions": {
    ":location": true,
    ":camera": true,
    ":file": true
  }
```

### If location sharing functionality is enabled:
If you are NOT enabling location sharing functionality, you may go to the next step: [Other properties](https://github.com/AppLozic/Kommunicate/blob/reytum-patch-1/docs/docs/android-customization.md#other-properties)

If you are enabling the location option in the `applozic-settings.json` file, make sure to include the below permissions and geo-API key in your `AndroidManifest.xml` file

Add the following permissions in your `AndroidManifest.xml` file in platforms/android/AndroidManifest.xml:

Add this outside `</application>` tag
```xml
   <uses-permission android:name="<your package name>.permission.MAPS_RECEIVE" />
   <permission
        android:name="<your package name>..permission.MAPS_RECEIVE"
        android:protectionLevel="signature" />
```

Add this inside `</application>` tag
```xml
   <meta-data
       android:name="com.google.android.geo.API_KEY"
       android:value="<your-geo-API-KEY>" />
```

### Other properties
Apart from the properties mentioned in the above [Applozic documentation](https://docs.applozic.com/docs/android-chat-theme-and-customization#section-applozic-settings-json-properties-detail), there are some other properties in `applozic-seetings.json` file that are specific to Kommunicate.

```json
"hideGroupSubtitle" : true,   //True will hide the subtitle in the support group(for e.g 'Keith, bot and You' will be hidden)
"enableAwayMessage": false,   //Away message will be disabled
"logoutOption": false,        //The logout option in the Option menu will be hidden
"showStartNewConversation" : false, //The default Start New Conversation button will be hidden
```

### Theme Customization
Not all the colors can be changed from the applozic-settings.json file. There are some colors like the statusbar/toolbar color, message statuc icon colors(sent, delivered etc icons)
which you need to override in your colors file under platforms/android/res/values/colors.xml file. Create the file under the same directory if not created.

Follow the below steps to override the default colors in Kommunicate:
1) Add the below line in your `<resources` tag in the colors.xml file
```
xmlns:tools="http://schemas.android.com/tools"
```
2) Add the below colors in your colors.xml file and use your own color values in them
```xml
    <color name="message_status_icon_colors" tools:override="true">#FF4081</color> // Message status icon color
    <color name="applozic_theme_color" tools:override="true">#FFB3E5FC</color>     //Theme color
    <color name="applozic_theme_color_primary" tools:override="true">#FF4081</color> 
    <color name="applozic_theme_color_primary_dark" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color_accent" tools:override="true">#3F51B5</color>
    <color name="default_start_new_button_color" tools:override="true">#FF4081</color> //Default start new conversation button color
```

Sample colors.xml file:
```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools">
    <Your other app specific colors go here>
    
    <color name="message_status_icon_colors" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color" tools:override="true">#FFB3E5FC</color>
    <color name="applozic_theme_color_primary" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color_primary_dark" tools:override="true">#FF4081</color>
    <color name="applozic_theme_color_accent" tools:override="true">#3F51B5</color>
    <color name="default_start_new_button_color" tools:override="true">#FF4081</color>
</resources>
```
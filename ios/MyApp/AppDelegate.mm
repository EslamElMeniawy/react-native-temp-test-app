#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>

// Imports for notifications.
#import <Firebase.h>
#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

// Import for injecting headless check in application.
#import "RNFBMessagingModule.h"

// Imports for splash screen.
#import "RNBootSplash.h"

// Imports for 'react-native-orientation-locker'.
#import "Orientation.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Initialize Firebase app if not initialized.
  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }
  
  self.moduleName = @"MyApp";

  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = [RNFBMessagingModule addCustomPropsToUserProps:nil withLaunchOptions:launchOptions];

  // Initialize splash screen.
  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:self.window.rootViewController.view];

  // Added for 'react-native-screens'
  #if !TARGET_OS_TV
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
  #endif
  
  // Define UNUserNotificationCenter
  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Added for 'react-native-screens'
- (void)applicationWillTerminate:(UIApplication *)application
{
  #if !TARGET_OS_TV
    [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
  #endif
}

// Added for 'react-native-orientation-locker'.
- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
  [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}

// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
  [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}

// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

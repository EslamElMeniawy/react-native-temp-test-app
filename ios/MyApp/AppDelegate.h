#import <React/RCTBridgeDelegate.h>
#import <UIKit/UIKit.h>

// Imports for notifications.
#import <UserNotifications/UNUserNotificationCenter.h>

@interface AppDelegate : UIResponder <UIApplicationDelegate, RCTBridgeDelegate, UNUserNotificationCenterDelegate>

@property (nonatomic, strong) UIWindow *window;

@end

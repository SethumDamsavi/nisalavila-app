import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const requestNotificationPermission = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status === "granted") {
      const token = await Notifications.getExpoPushTokenAsync();
      console.log("Expo Push Token:", token.data);
      return token.data;
    }
    return null;
  } catch (error) {
    console.error("Notification error:", error);
    return null;
  }
};

export const scheduleLocalNotification = async (
  title: string,
  body: string,
) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null,
  });
};

import { Tabs } from "expo-router";
import "../i18n/index";


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2ecc71",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: { backgroundColor: "#fff" },
        headerShown: false,
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="explore" options={{ title: "Charities" }} />
      <Tabs.Screen name="donate" options={{ title: "Donate" }} />
      <Tabs.Screen name="admin" options={{ title: "Admin" }} />
    </Tabs>
  );
}

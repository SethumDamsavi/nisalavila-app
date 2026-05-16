import { Tabs } from "expo-router";
import { Heart, Home, Search } from "lucide-react-native";
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
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Charities",
        }}
      />
      <Tabs.Screen
        name="donate"
        options={{
          title: "Donate",
        }}
      />
    </Tabs>
  );
}
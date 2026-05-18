import React, { useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { requestNotificationPermission } from "../../utils/firebase";

export default function NotificationsScreen() {
  const [permission, setPermission] = useState<string>("unknown");
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Donation Approved",
      body: "Your donation of LKR 5,000 has been approved!",
      time: "2 mins ago",
      read: false,
      icon: "💳",
    },
    {
      id: 2,
      title: "Charity Update",
      body: "Children Education Fund has reached 25% of its goal!",
      time: "1 hour ago",
      read: false,
      icon: "🏛️",
    },
    {
      id: 3,
      title: "New Announcement",
      body: "School supplies distributed to 200 children in Colombo.",
      time: "2 hours ago",
      read: true,
      icon: "📢",
    },
    {
      id: 4,
      title: "Thank You!",
      body: "Thank you for your generous donation to Nisalavila Foundation.",
      time: "1 day ago",
      read: true,
      icon: "🙏",
    },
  ]);

  const enableNotifications = async () => {
    setLoading(true);
    try {
      const fcmToken = await requestNotificationPermission();
      if (fcmToken) {
        setToken(fcmToken);
        setPermission("granted");
      } else {
        setPermission("denied");
      }
    } catch (error) {
      setPermission("error");
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🔔 Notifications</Text>
          <Text style={styles.headerSubtitle}>
            {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markAllBtn} onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Enable Notifications Card */}
        {permission !== "granted" && (
          <View style={styles.permissionCard}>
            <Text style={styles.permissionIcon}>🔔</Text>
            <Text style={styles.permissionTitle}>Enable Notifications</Text>
            <Text style={styles.permissionText}>
              Get notified about donation updates, charity news and
              announcements
            </Text>
            <TouchableOpacity
              style={styles.enableBtn}
              onPress={enableNotifications}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.enableBtnText}>Enable Notifications</Text>
              )}
            </TouchableOpacity>
            {permission === "denied" && (
              <Text style={styles.deniedText}>
                ⚠️ Notifications blocked. Please enable in browser settings.
              </Text>
            )}
          </View>
        )}

        {permission === "granted" && (
          <View style={styles.successCard}>
            <Text style={styles.successText}>
              ✅ Notifications enabled! You will receive updates.
            </Text>
          </View>
        )}

        {/* Notification List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent</Text>
          {notifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.notifCard, item.read && styles.notifCardRead]}
              onPress={() => markRead(item.id)}
            >
              <View style={styles.notifIcon}>
                <Text style={styles.notifIconText}>{item.icon}</Text>
              </View>
              <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifBody}>{item.body}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f0" },
  header: {
    backgroundColor: "#27ae60",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 12, color: "#d5f5e3", marginTop: 2 },
  markAllBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  markAllText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  permissionCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  permissionIcon: { fontSize: 48, marginBottom: 12 },
  permissionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  enableBtn: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  enableBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  deniedText: {
    color: "#e74c3c",
    fontSize: 12,
    marginTop: 12,
    textAlign: "center",
  },
  successCard: {
    backgroundColor: "#e8f8f0",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
  },
  successText: { color: "#27ae60", fontSize: 14, fontWeight: "600" },
  section: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  notifCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#2ecc71",
  },
  notifCardRead: { opacity: 0.7, borderLeftColor: "#ddd" },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f4f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notifIconText: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  notifTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#2ecc71",
  },
  notifBody: { fontSize: 13, color: "#666", lineHeight: 20, marginBottom: 4 },
  notifTime: { fontSize: 11, color: "#999" },
});

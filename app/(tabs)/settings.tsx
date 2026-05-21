import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../../utils/theme";

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [donationAlerts, setDonationAlerts] = useState(true);
  const [newsUpdates, setNewsUpdates] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [language, setLanguage] = useState("English");

  const SettingRow = ({
    title,
    subtitle,
    value,
    onToggle,
  }: {
    title: string;
    subtitle?: string;
    value: boolean;
    onToggle: () => void;
  }) => (
    <View
      style={[styles.settingRow, { borderBottomColor: theme.colors.border }]}
    >
      <View style={styles.settingText}>
        <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
          {title}
        </Text>
        {subtitle && (
          <Text
            style={[styles.settingSubtitle, { color: theme.colors.subtext }]}
          >
            {subtitle}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: "#ddd", true: "#2ecc71" }}
        thumbColor={value ? "#fff" : "#fff"}
      />
    </View>
  );

  const MenuRow = ({
    icon,
    title,
    subtitle,
    onPress,
    danger,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity
      style={[styles.menuRow, { borderBottomColor: theme.colors.border }]}
      onPress={onPress}
    >
      <View
        style={[
          styles.menuIcon,
          { backgroundColor: danger ? "#fdf0ee" : theme.colors.background },
        ]}
      >
        <Text style={styles.menuIconText}>{icon}</Text>
      </View>
      <View style={styles.menuText}>
        <Text
          style={[
            styles.menuTitle,
            { color: danger ? "#e74c3c" : theme.colors.text },
          ]}
        >
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.menuSubtitle, { color: theme.colors.subtext }]}>
            {subtitle}
          </Text>
        )}
      </View>
      <Text style={[styles.menuArrow, { color: theme.colors.subtext }]}>›</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.header }]}>
        <Text style={styles.headerTitle}>⚙️ Settings</Text>
        <Text style={styles.headerSubtitle}>Manage your preferences</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View
          style={[styles.profileCard, { backgroundColor: theme.colors.card }]}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>S</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.colors.text }]}>
              Sethum Damsavi
            </Text>
            <Text
              style={[styles.profileEmail, { color: theme.colors.subtext }]}
            >
              sethumdamsavi1@gmail.com
            </Text>
          </View>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Appearance */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>
          APPEARANCE
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <SettingRow
            title="Dark Mode"
            subtitle="Switch between light and dark theme"
            value={theme.dark}
            onToggle={toggleTheme}
          />
          <View
            style={[
              styles.settingRow,
              { borderBottomColor: theme.colors.border },
            ]}
          >
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: theme.colors.text }]}>
                Language
              </Text>
              <Text
                style={[
                  styles.settingSubtitle,
                  { color: theme.colors.subtext },
                ]}
              >
                App display language
              </Text>
            </View>
            <View style={styles.languageToggle}>
              <TouchableOpacity
                style={[
                  styles.langBtn,
                  language === "English" && styles.langBtnActive,
                ]}
                onPress={() => setLanguage("English")}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === "English" && styles.langBtnTextActive,
                  ]}
                >
                  EN
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.langBtn,
                  language === "Sinhala" && styles.langBtnActive,
                ]}
                onPress={() => setLanguage("Sinhala")}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    language === "Sinhala" && styles.langBtnTextActive,
                  ]}
                >
                  සිං
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Notifications */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>
          NOTIFICATIONS
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <SettingRow
            title="Push Notifications"
            subtitle="Receive app notifications"
            value={notifications}
            onToggle={() => setNotifications(!notifications)}
          />
          <SettingRow
            title="Donation Alerts"
            subtitle="Get notified about donation status"
            value={donationAlerts}
            onToggle={() => setDonationAlerts(!donationAlerts)}
          />
          <SettingRow
            title="News & Updates"
            subtitle="Charity news and announcements"
            value={newsUpdates}
            onToggle={() => setNewsUpdates(!newsUpdates)}
          />
          <SettingRow
            title="Email Notifications"
            subtitle="Receive updates via email"
            value={emailNotifs}
            onToggle={() => setEmailNotifs(!emailNotifs)}
          />
        </View>

        {/* Account */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>
          ACCOUNT
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <MenuRow
            icon="👤"
            title="Edit Profile"
            subtitle="Update your personal information"
            onPress={() => {}}
          />
          <MenuRow
            icon="🔒"
            title="Change Password"
            subtitle="Update your password"
            onPress={() => {}}
          />
          <MenuRow
            icon="💳"
            title="Payment Methods"
            subtitle="Manage saved payment methods"
            onPress={() => {}}
          />
          <MenuRow
            icon="📋"
            title="Donation History"
            subtitle="View all your donations"
            onPress={() => {}}
          />
        </View>

        {/* Support */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>
          SUPPORT
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <MenuRow
            icon="❓"
            title="Help & FAQ"
            subtitle="Get help with the app"
            onPress={() => {}}
          />
          <MenuRow
            icon="📞"
            title="Contact Us"
            subtitle="Reach out to our team"
            onPress={() => {}}
          />
          <MenuRow
            icon="⭐"
            title="Rate the App"
            subtitle="Share your feedback"
            onPress={() => {}}
          />
          <MenuRow
            icon="📄"
            title="Privacy Policy"
            subtitle="Read our privacy policy"
            onPress={() => {}}
          />
          <MenuRow
            icon="📜"
            title="Terms of Service"
            subtitle="Read our terms"
            onPress={() => {}}
          />
        </View>

        {/* App Info */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>
          ABOUT
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <View
            style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}
          >
            <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>
              Version
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              1.0.0
            </Text>
          </View>
          <View
            style={[styles.infoRow, { borderBottomColor: theme.colors.border }]}
          >
            <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>
              Developer
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              Nisalavila Foundation
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.subtext }]}>
              Build
            </Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>
              2026.05.20
            </Text>
          </View>
        </View>

        {/* Danger Zone */}
        <Text style={[styles.sectionTitle, { color: theme.colors.subtext }]}>
          ACCOUNT ACTIONS
        </Text>
        <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
          <MenuRow
            icon="🚪"
            title="Log Out"
            subtitle="Sign out of your account"
            onPress={() => {}}
            danger
          />
          <MenuRow
            icon="🗑️"
            title="Delete Account"
            subtitle="Permanently delete your account"
            onPress={() => {}}
            danger
          />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 12, color: "#d5f5e3", marginTop: 2 },
  profileCard: {
    margin: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  profileAvatarText: { color: "#fff", fontWeight: "bold", fontSize: 22 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: "700" },
  profileEmail: { fontSize: 12, marginTop: 2 },
  editProfileBtn: {
    backgroundColor: "#e8f8f0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editProfileText: { color: "#2ecc71", fontSize: 13, fontWeight: "600" },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginLeft: 16,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  settingText: { flex: 1 },
  settingTitle: { fontSize: 15, fontWeight: "600" },
  settingSubtitle: { fontSize: 12, marginTop: 2 },
  languageToggle: { flexDirection: "row", gap: 6 },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#ddd",
  },
  langBtnActive: { borderColor: "#2ecc71", backgroundColor: "#e8f8f0" },
  langBtnText: { fontSize: 12, color: "#999", fontWeight: "600" },
  langBtnTextActive: { color: "#2ecc71" },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  menuIconText: { fontSize: 18 },
  menuText: { flex: 1 },
  menuTitle: { fontSize: 15, fontWeight: "600" },
  menuSubtitle: { fontSize: 12, marginTop: 2 },
  menuArrow: { fontSize: 20 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 14,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600" },
});

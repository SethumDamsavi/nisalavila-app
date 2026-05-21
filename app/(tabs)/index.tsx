import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import "../../i18n/index";
import { useTheme } from "../../utils/theme";

type Post = {
  id: number;
  title: string;
  content: string;
  charityId: number;
  createdAt: string;
};

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [language, setLanguage] = useState<"en" | "si">("en");

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "https://nisalavila-api-production.up.railway.app/api/posts",
      );
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  const toggleLike = (id: number) => {
    setLikes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "si" : "en";
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const renderPost = ({ item }: { item: Post }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.colors.card,
          borderLeftColor: theme.colors.primary,
        },
      ]}
    >
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={[styles.charityLabel, { color: theme.colors.text }]}>
            {t("home.title")} Foundation
          </Text>
          <Text style={[styles.dateText, { color: theme.colors.subtext }]}>
            📅 {formatDate(item.createdAt)}
          </Text>
        </View>
        <View
          style={[
            styles.badge,
            { backgroundColor: theme.dark ? "#1a3a2a" : "#e8f8f0" },
          ]}
        >
          <Text style={[styles.badgeText, { color: theme.colors.primary }]}>
            {t("home.update")}
          </Text>
        </View>
      </View>

      <View
        style={[styles.divider, { backgroundColor: theme.colors.border }]}
      />

      <Text style={[styles.postTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
      <Text style={[styles.postContent, { color: theme.colors.subtext }]}>
        {item.content}
      </Text>

      <View
        style={[styles.divider, { backgroundColor: theme.colors.border }]}
      />

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
        >
          <Text style={[styles.actionText, { color: theme.colors.subtext }]}>
            {likes[item.id] ? "❤️" : "🤍"}{" "}
            {likes[item.id] ? t("home.liked") : t("home.like")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/comments?postId=${item.id}`)}
        >
          <Text style={[styles.actionText, { color: theme.colors.subtext }]}>
            💬 {t("home.comment")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={[styles.actionText, { color: theme.colors.subtext }]}>
            🔗 {t("home.share")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={[styles.loadingText, { color: theme.colors.subtext }]}>
          {t("home.loading")}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.header }]}>
        <View>
          <Text style={styles.headerTitle}>🌿 {t("home.title")}</Text>
          <Text style={styles.headerSubtitle}>{t("home.subtitle")}</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {posts.length} {t("home.posts")}
            </Text>
          </View>
          <TouchableOpacity style={styles.langToggle} onPress={toggleLanguage}>
            <Text style={styles.langToggleText}>
              {language === "en" ? "සිං" : "EN"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.langToggle} onPress={toggleTheme}>
            <Text style={styles.langToggleText}>
              {theme.dark ? "☀️" : "🌙"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Bar */}
      <View
        style={[
          styles.statsBar,
          {
            backgroundColor: theme.colors.card,
            borderBottomColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
            {t("home.charity")}
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: theme.colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
            {t("home.updates")}
          </Text>
        </View>
        <View
          style={[styles.statDivider, { backgroundColor: theme.colors.border }]}
        />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>LKR 3M</Text>
          <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
            {t("home.goal")}
          </Text>
        </View>
      </View>

      {posts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
            {t("home.noAnnouncements")}
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.colors.subtext }]}>
            {t("home.checkBack")}
          </Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPost}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2ecc71"]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 12, color: "#d5f5e3", marginTop: 2 },
  headerRight: { alignItems: "flex-end", gap: 6 },
  headerBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  headerBadgeText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  langToggle: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  langToggleText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  statsBar: {
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    elevation: 2,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 16, fontWeight: "700", color: "#27ae60" },
  statLabel: { fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 30 },
  list: { padding: 16, paddingBottom: 20 },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#27ae60",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  cardMeta: { flex: 1 },
  charityLabel: { fontSize: 14, fontWeight: "700" },
  dateText: { fontSize: 11, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: "600" },
  divider: { height: 1, marginVertical: 12 },
  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 22,
  },
  postContent: { fontSize: 14, lineHeight: 22 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 4,
  },
  actionButton: { flexDirection: "row", alignItems: "center", padding: 4 },
  actionText: { fontSize: 13, fontWeight: "500" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, fontSize: 14 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: "600" },
  emptySubtext: { fontSize: 13, marginTop: 4 },
});

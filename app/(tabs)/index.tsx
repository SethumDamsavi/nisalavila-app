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

type Post = {
  id: number;
  title: string;
  content: string;
  charityId: number;
  createdAt: string;
};

export default function HomeScreen() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [likes, setLikes] = useState<{ [key: number]: boolean }>({});
  const [language, setLanguage] = useState<"en" | "si">("en");

  const fetchPosts = async () => {
    try {
      const response = await fetch(
        "http://localhost:HTTPS://NISALAVILA-API-PRODUCTION.UP.RAILWAY.APP/api/posts",
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
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>N</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.charityLabel}>{t("home.title")} Foundation</Text>
          <Text style={styles.dateText}>📅 {formatDate(item.createdAt)}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{t("home.update")}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postContent}>{item.content}</Text>

      <View style={styles.divider} />

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
        >
          <Text style={styles.actionText}>
            {likes[item.id] ? "❤️" : "🤍"}{" "}
            {likes[item.id] ? t("home.liked") : t("home.like")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>💬 {t("home.comment")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>🔗 {t("home.share")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>{t("home.loading")}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
        </View>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>1</Text>
          <Text style={styles.statLabel}>{t("home.charity")}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{posts.length}</Text>
          <Text style={styles.statLabel}>{t("home.updates")}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>LKR 500K</Text>
          <Text style={styles.statLabel}>{t("home.goal")}</Text>
        </View>
      </View>

      {posts.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>{t("home.noAnnouncements")}</Text>
          <Text style={styles.emptySubtext}>{t("home.checkBack")}</Text>
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
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 16, fontWeight: "700", color: "#27ae60" },
  statLabel: { fontSize: 11, color: "#999", marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: "#eee" },
  list: { padding: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#27ae60",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    shadowColor: "#27ae60",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 20 },
  cardMeta: { flex: 1 },
  charityLabel: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  dateText: { fontSize: 11, color: "#999", marginTop: 2 },
  badge: {
    backgroundColor: "#e8f8f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { color: "#27ae60", fontSize: 11, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#f5f5f5", marginVertical: 12 },
  postTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
    lineHeight: 22,
  },
  postContent: { fontSize: 14, color: "#555", lineHeight: 22 },
  cardActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 4,
  },
  actionButton: { flexDirection: "row", alignItems: "center", padding: 4 },
  actionText: { fontSize: 13, color: "#888", fontWeight: "500" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666", fontSize: 14 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: "#999", fontWeight: "600" },
  emptySubtext: { fontSize: 13, color: "#bbb", marginTop: 4 },
});

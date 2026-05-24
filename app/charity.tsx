import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../utils/theme";

type Charity = {
  id: number;
  name: string;
  description: string;
  target: number;
  current: number;
  verified: boolean;
  createdAt: string;
};

type Post = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

const API = "https://nisalavila-api-production.up.railway.app";

const CHARITY_ICONS: { [key: string]: string } = {
  "Children Education Fund": "📚",
  "Clean Water Initiative": "💧",
  "Elderly Care Foundation": "👴",
  "Flood Relief Fund": "🌊",
  "Rural Healthcare Program": "🏥",
};

export default function CharityDetailScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [charity, setCharity] = useState<Charity | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [activeTab, setActiveTab] = useState<"about" | "updates">("about");

  const fetchCharity = useCallback(async () => {
    try {
      const [charityRes, postsRes] = await Promise.all([
        fetch(`${API}/api/charities/${id}`),
        fetch(`${API}/api/posts/charity/${id}`),
      ]);
      const charityData = await charityRes.json();
      const postsData = await postsRes.json();
      setCharity(charityData);
      setPosts(postsData);
    } catch (error) {
      console.error("Error fetching charity:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchCharity();
  }, [id, fetchCharity]);

  const handleFollow = async () => {
    try {
      await fetch(`${API}/api/charities/${id}/follow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: 1 }),
      });
      setFollowed(!followed);
    } catch (error) {
      console.error("Error following charity:", error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  if (!charity) {
    return (
      <View
        style={[styles.centered, { backgroundColor: theme.colors.background }]}
      >
        <Text style={{ color: theme.colors.text }}>Charity not found</Text>
      </View>
    );
  }

  const progress =
    charity.target > 0 ? (charity.current / charity.target) * 100 : 0;
  const icon = CHARITY_ICONS[charity.name] || "🏛️";

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.header }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.followBtn, followed && styles.followBtnActive]}
          onPress={handleFollow}
        >
          <Text
            style={[
              styles.followBtnText,
              followed && styles.followBtnTextActive,
            ]}
          >
            {followed ? "✓ Following" : "+ Follow"}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={[styles.hero, { backgroundColor: theme.colors.header }]}>
          <Text style={styles.heroIcon}>{icon}</Text>
          <Text style={styles.heroTitle}>{charity.name}</Text>
          {charity.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified Charity</Text>
            </View>
          )}
          <Text style={styles.heroDate}>
            Active since {formatDate(charity.createdAt)}
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={styles.statValue}>
              LKR {charity.current.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
              Raised
            </Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: "#2ecc71" }]}>
            <Text style={[styles.statValue, { color: "#fff" }]}>
              {progress.toFixed(1)}%
            </Text>
            <Text style={[styles.statLabel, { color: "#d5f5e3" }]}>
              Goal Reached
            </Text>
          </View>
          <View
            style={[styles.statCard, { backgroundColor: theme.colors.card }]}
          >
            <Text style={styles.statValue}>
              LKR {charity.target.toLocaleString()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.subtext }]}>
              Target
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View
          style={[
            styles.progressSection,
            { backgroundColor: theme.colors.card },
          ]}
        >
          <View style={styles.progressHeader}>
            <Text style={[styles.progressTitle, { color: theme.colors.text }]}>
              Fundraising Progress
            </Text>
            <Text style={styles.progressPercent}>{progress.toFixed(1)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: theme.colors.subtext }]}>
            LKR {charity.current.toLocaleString()} raised of LKR{" "}
            {charity.target.toLocaleString()} goal
          </Text>
        </View>

        {/* Tabs */}
        <View style={[styles.tabRow, { backgroundColor: theme.colors.card }]}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.tabActive]}
            onPress={() => setActiveTab("about")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "about" && styles.tabTextActive,
              ]}
            >
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "updates" && styles.tabActive]}
            onPress={() => setActiveTab("updates")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "updates" && styles.tabTextActive,
              ]}
            >
              Updates ({posts.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === "about" ? (
            <View
              style={[styles.aboutCard, { backgroundColor: theme.colors.card }]}
            >
              <Text style={[styles.aboutTitle, { color: theme.colors.text }]}>
                About This Charity
              </Text>
              <Text style={[styles.aboutText, { color: theme.colors.subtext }]}>
                {charity.description}
              </Text>

              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <Text
                  style={[styles.infoLabel, { color: theme.colors.subtext }]}
                >
                  Status
                </Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: charity.verified ? "#2ecc71" : "#f39c12" },
                  ]}
                >
                  {charity.verified ? "✓ Verified" : "Pending Verification"}
                </Text>
              </View>
              <View
                style={[
                  styles.infoRow,
                  { borderBottomColor: theme.colors.border },
                ]}
              >
                <Text
                  style={[styles.infoLabel, { color: theme.colors.subtext }]}
                >
                  Category
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  Nonprofit
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, { color: theme.colors.subtext }]}
                >
                  Location
                </Text>
                <Text style={[styles.infoValue, { color: theme.colors.text }]}>
                  Sri Lanka 🇱🇰
                </Text>
              </View>
            </View>
          ) : (
            <View>
              {posts.length === 0 ? (
                <View style={styles.centered}>
                  <Text style={styles.emptyIcon}>📭</Text>
                  <Text
                    style={[styles.emptyText, { color: theme.colors.subtext }]}
                  >
                    No updates yet
                  </Text>
                </View>
              ) : (
                posts.map((post) => (
                  <View
                    key={post.id}
                    style={[
                      styles.postCard,
                      {
                        backgroundColor: theme.colors.card,
                        borderLeftColor: "#2ecc71",
                      },
                    ]}
                  >
                    <Text
                      style={[styles.postTitle, { color: theme.colors.text }]}
                    >
                      {post.title}
                    </Text>
                    <Text
                      style={[
                        styles.postContent,
                        { color: theme.colors.subtext },
                      ]}
                    >
                      {post.content}
                    </Text>
                    <Text
                      style={[styles.postDate, { color: theme.colors.subtext }]}
                    >
                      📅 {formatDate(post.createdAt)}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Donate Button */}
      <View
        style={[
          styles.donateBar,
          {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.donateBtn}
          onPress={() => router.push("/donate")}
        >
          <Text style={styles.donateBtnText}>💳 Donate to {charity.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingTop: 50,
  },
  backBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  backBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  followBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  followBtnActive: { backgroundColor: "#fff" },
  followBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },
  followBtnTextActive: { color: "#2ecc71" },
  hero: {
    padding: 24,
    paddingTop: 8,
    alignItems: "center",
    paddingBottom: 30,
  },
  heroIcon: { fontSize: 60, marginBottom: 12 },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  verifiedBadge: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 8,
  },
  verifiedText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  heroDate: { color: "#d5f5e3", fontSize: 12 },
  statsRow: { flexDirection: "row", padding: 16, gap: 10, marginTop: -15 },
  statCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statValue: { fontSize: 14, fontWeight: "700", color: "#1a1a1a" },
  statLabel: { fontSize: 10, marginTop: 4, textAlign: "center" },
  progressSection: {
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressTitle: { fontSize: 14, fontWeight: "600" },
  progressPercent: { fontSize: 14, fontWeight: "700", color: "#2ecc71" },
  progressBar: {
    height: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    marginBottom: 8,
  },
  progressFill: { height: 10, backgroundColor: "#2ecc71", borderRadius: 5 },
  progressText: { fontSize: 12 },
  tabRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    borderRadius: 12,
    padding: 4,
    marginBottom: 12,
  },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  tabActive: { backgroundColor: "#2ecc71" },
  tabText: { fontSize: 14, color: "#999", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  tabContent: { paddingHorizontal: 16 },
  aboutCard: { borderRadius: 12, padding: 16 },
  aboutTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },
  aboutText: { fontSize: 14, lineHeight: 22, marginBottom: 16 },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "600" },
  postCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  postTitle: { fontSize: 15, fontWeight: "700", marginBottom: 6 },
  postContent: { fontSize: 13, lineHeight: 20, marginBottom: 8 },
  postDate: { fontSize: 11 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 15 },
  donateBar: {
    padding: 12,
    borderTopWidth: 1,
  },
  donateBtn: {
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  donateBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});

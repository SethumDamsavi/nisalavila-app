import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Charity = {
  id: number;
  name: string;
  description: string;
  target: number;
  current: number;
  verified: boolean;
};

type Post = {
  id: number;
  title: string;
  content: string;
  charityId: number;
  createdAt: string;
};

type SearchResult = {
  type: "charity" | "post";
  id: number;
  title: string;
  subtitle: string;
  icon: string;
  verified?: boolean;
};

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [allCharities, setAllCharities] = useState<Charity[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "charities" | "posts"
  >("all");

  const API = "https://nisalavila-api-production.up.railway.app";

  const fetchAll = async () => {
    try {
      const [charitiesRes, postsRes] = await Promise.all([
        fetch(`${API}/api/charities`),
        fetch(`${API}/api/posts`),
      ]);
      const charities = await charitiesRes.json();
      const posts = await postsRes.json();
      setAllCharities(charities);
      setAllPosts(posts);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    const q = query.toLowerCase();

    const charityResults: SearchResult[] = allCharities
      .filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q),
      )
      .map((c) => ({
        type: "charity",
        id: c.id,
        title: c.name,
        subtitle: `Target: LKR ${c.target.toLocaleString()} • ${c.verified ? "Verified" : "Pending"}`,
        icon: "🏛️",
        verified: c.verified,
      }));

    const postResults: SearchResult[] = allPosts
      .filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q),
      )
      .map((p) => ({
        type: "post",
        id: p.id,
        title: p.title,
        subtitle: p.content.substring(0, 80) + "...",
        icon: "📢",
      }));

    setResults([...charityResults, ...postResults]);
    setLoading(false);
  };

  const filteredResults = results.filter((r) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "charities") return r.type === "charity";
    if (activeFilter === "posts") return r.type === "post";
    return true;
  });

  const suggestions = ["Education", "Children", "Health", "Food", "School"];

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity style={styles.resultCard}>
      <View style={styles.resultIcon}>
        <Text style={styles.resultIconText}>{item.icon}</Text>
      </View>
      <View style={styles.resultContent}>
        <View style={styles.resultTitleRow}>
          <Text style={styles.resultTitle} numberOfLines={1}>
            {item.title}
          </Text>
          {item.type === "charity" && item.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓</Text>
            </View>
          )}
          <View
            style={[
              styles.typeBadge,
              {
                backgroundColor:
                  item.type === "charity" ? "#e8f8f0" : "#eef2ff",
              },
            ]}
          >
            <Text
              style={[
                styles.typeText,
                { color: item.type === "charity" ? "#27ae60" : "#4f46e5" },
              ]}
            >
              {item.type === "charity" ? "Charity" : "Post"}
            </Text>
          </View>
        </View>
        <Text style={styles.resultSubtitle} numberOfLines={2}>
          {item.subtitle}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔍 Search</Text>
        <Text style={styles.headerSubtitle}>
          Find charities and announcements
        </Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search charities, posts..."
            placeholderTextColor="rgba(255,255,255,0.5)"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setQuery("");
                setResults([]);
                setSearched(false);
              }}
            >
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {!searched ? (
        <View style={styles.body}>
          {/* Suggestions */}
          <Text style={styles.sectionTitle}>Popular Searches</Text>
          <View style={styles.suggestionsRow}>
            {suggestions.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.suggestionChip}
                onPress={() => {
                  setQuery(s);
                }}
              >
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stats */}
          <Text style={styles.sectionTitle}>Available Data</Text>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>🏛️</Text>
              <Text style={styles.statNumber}>{allCharities.length}</Text>
              <Text style={styles.statLabel}>Charities</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📢</Text>
              <Text style={styles.statNumber}>{allPosts.length}</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💳</Text>
              <Text style={styles.statNumber}>∞</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.body}>
          {/* Filter Tabs */}
          <View style={styles.filterRow}>
            {(["all", "charities", "posts"] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.filterTab,
                  activeFilter === f && styles.filterTabActive,
                ]}
                onPress={() => setActiveFilter(f)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === f && styles.filterTextActive,
                  ]}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  {f === "all" && ` (${results.length})`}
                  {f === "charities" &&
                    ` (${results.filter((r) => r.type === "charity").length})`}
                  {f === "posts" &&
                    ` (${results.filter((r) => r.type === "post").length})`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#2ecc71" />
            </View>
          ) : filteredResults.length === 0 ? (
            <View style={styles.centered}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptySubtitle}>
                {'Try searching for "Education" or "Children"'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredResults}
              keyExtractor={(item) => `${item.type}-${item.id}`}
              renderItem={renderResult}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}
        </View>
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
    paddingBottom: 24,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: {
    fontSize: 12,
    color: "#d5f5e3",
    marginTop: 2,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: {
    flex: 1,
    padding: 12,
    color: "#fff",
    fontSize: 15,
  },
  clearBtn: { color: "#fff", fontSize: 16, padding: 4 },
  searchButton: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  searchButtonText: { color: "#27ae60", fontWeight: "700", fontSize: 15 },
  body: { flex: 1, padding: 16 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
    marginTop: 8,
  },
  suggestionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 20,
  },
  suggestionChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#2ecc71",
  },
  suggestionText: { color: "#27ae60", fontWeight: "600", fontSize: 13 },
  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  statIcon: { fontSize: 24, marginBottom: 6 },
  statNumber: { fontSize: 22, fontWeight: "700", color: "#27ae60" },
  statLabel: { fontSize: 11, color: "#999", marginTop: 2 },
  filterRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 4,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTab: { flex: 1, padding: 8, borderRadius: 8, alignItems: "center" },
  filterTabActive: { backgroundColor: "#2ecc71" },
  filterText: { fontSize: 12, color: "#999", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
  resultCard: {
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
  resultIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#f0f4f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  resultIconText: { fontSize: 20 },
  resultContent: { flex: 1 },
  resultTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  resultTitle: { fontSize: 14, fontWeight: "700", color: "#1a1a1a", flex: 1 },
  verifiedBadge: {
    backgroundColor: "#2ecc71",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  verifiedText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  typeText: { fontSize: 10, fontWeight: "700" },
  resultSubtitle: { fontSize: 12, color: "#666", lineHeight: 18 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 6,
  },
  emptySubtitle: { fontSize: 14, color: "#999", textAlign: "center" },
});

import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
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

export default function CharitiesScreen() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchCharities = async () => {
    try {
      const response = await fetch(
        "https://nisalavila-api-production.up.railway.app/api/charities",
      );
      const data = await response.json();
      setCharities(data);
    } catch (error) {
      console.error("Error fetching charities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const renderCharity = ({ item }: { item: Charity }) => {
    const progress = item.target > 0 ? (item.current / item.target) * 100 : 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/charity?id=${item.id}`)}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.charityName}>{item.name}</Text>
          {item.verified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress, 100)}%` },
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            LKR {item.current.toLocaleString()} of LKR{" "}
            {item.target.toLocaleString()}
          </Text>
        </View>

        <TouchableOpacity style={styles.donateButton}>
          <Text style={styles.donateButtonText}>Donate Now</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Loading charities...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Charities</Text>
      <Text style={styles.subheader}>Support a cause you care about</Text>

      {charities.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No charities found</Text>
        </View>
      ) : (
        <FlatList
          data={charities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCharity}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  header: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a", marginTop: 16 },
  subheader: { fontSize: 14, color: "#666", marginBottom: 16 },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  charityName: { fontSize: 18, fontWeight: "700", color: "#1a1a1a", flex: 1 },
  verifiedBadge: {
    backgroundColor: "#e8f8f0",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  verifiedText: { color: "#2ecc71", fontSize: 12, fontWeight: "600" },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: { marginBottom: 12 },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 6,
  },
  progressFill: { height: 8, backgroundColor: "#2ecc71", borderRadius: 4 },
  progressText: { fontSize: 12, color: "#888" },
  donateButton: {
    backgroundColor: "#2ecc71",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  donateButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666", fontSize: 14 },
  emptyText: { fontSize: 16, color: "#999" },
});

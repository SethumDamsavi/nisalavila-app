import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

type Donation = {
  id: number;
  amount: number;
  status: string;
  type: string;
  userId: number;
  charityId: number;
  createdAt: string;
};

type Charity = {
  id: number;
  name: string;
  verified: boolean;
  target: number;
  current: number;
};

export default function AdminScreen() {
  const [activeTab, setActiveTab] = useState<"donations" | "charities">(
    "donations",
  );
  const [donations, setDonations] = useState<Donation[]>([]);
  const [charities, setCharities] = useState<Charity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [donationsRes, charitiesRes] = await Promise.all([
        fetch("http://localhost:5000/api/donations/user/1"),
        fetch("http://localhost:5000/api/charities"),
      ]);
      const donationsData = await donationsRes.json();
      const charitiesData = await charitiesRes.json();
      setDonations(donationsData);
      setCharities(charitiesData);
    } catch (error) {
      Alert.alert("Error", "Cannot load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateDonationStatus = async (id: number, status: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/donations/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        },
      );
      if (response.ok) {
        Alert.alert("Success", `Donation ${status}!`);
        fetchData();
      }
    } catch (error) {
      Alert.alert("Error", "Cannot update donation");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "#2ecc71";
      case "rejected":
        return "#e74c3c";
      default:
        return "#f39c12";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "approved":
        return "#e8f8f0";
      case "rejected":
        return "#fdf0ee";
      default:
        return "#fef9ec";
    }
  };

  const renderDonation = ({ item }: { item: Donation }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View>
          <Text style={styles.cardTitle}>Donation #{item.id}</Text>
          <Text style={styles.cardSubtitle}>
            {item.type === "online" ? "💳 Online" : "🏦 Bank Slip"} • User{" "}
            {item.userId}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBg(item.status) },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Amount</Text>
        <Text style={styles.amountValue}>
          LKR {item.amount.toLocaleString()}
        </Text>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Charity ID</Text>
        <Text style={styles.amountValue}>#{item.charityId}</Text>
      </View>

      <View style={styles.amountRow}>
        <Text style={styles.amountLabel}>Date</Text>
        <Text style={styles.amountValue}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>

      {item.status === "pending" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.approveBtn]}
            onPress={() => updateDonationStatus(item.id, "approved")}
          >
            <Text style={styles.approveBtnText}>✓ Approve</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.rejectBtn]}
            onPress={() => updateDonationStatus(item.id, "rejected")}
          >
            <Text style={styles.rejectBtnText}>✕ Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderCharity = ({ item }: { item: Charity }) => {
    const progress = item.target > 0 ? (item.current / item.target) * 100 : 0;
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardSubtitle}>ID: #{item.id}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.verified ? "#e8f8f0" : "#fef9ec" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.verified ? "#2ecc71" : "#f39c12" },
              ]}
            >
              {item.verified ? "VERIFIED" : "PENDING"}
            </Text>
          </View>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Target</Text>
          <Text style={styles.amountValue}>
            LKR {item.target.toLocaleString()}
          </Text>
        </View>

        <View style={styles.amountRow}>
          <Text style={styles.amountLabel}>Raised</Text>
          <Text style={styles.amountValue}>
            LKR {item.current.toLocaleString()}
          </Text>
        </View>

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
            {progress.toFixed(1)}% of goal reached
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>⚙️ Admin Panel</Text>
        <Text style={styles.headerSubtitle}>
          Manage donations and charities
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{donations.length}</Text>
          <Text style={styles.statLabel}>Donations</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {donations.filter((d) => d.status === "pending").length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{charities.length}</Text>
          <Text style={styles.statLabel}>Charities</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "donations" && styles.tabActive]}
          onPress={() => setActiveTab("donations")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "donations" && styles.tabTextActive,
            ]}
          >
            💳 Donations
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "charities" && styles.tabActive]}
          onPress={() => setActiveTab("charities")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "charities" && styles.tabTextActive,
            ]}
          >
            🏛️ Charities
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={activeTab === "donations" ? donations : charities}
          keyExtractor={(item) => item.id.toString()}
          renderItem={
            activeTab === "donations" ? renderDonation : renderCharity
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No data found</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f0" },
  header: {
    backgroundColor: "#2c3e50",
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 12, color: "#95a5a6", marginTop: 2 },
  statsBar: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 16,
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    elevation: 2,
  },
  statItem: { alignItems: "center" },
  statNumber: { fontSize: 20, fontWeight: "700", color: "#2c3e50" },
  statLabel: { fontSize: 11, color: "#999", marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: "#eee" },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 8,
    margin: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  tabActive: { backgroundColor: "#2ecc71" },
  tabText: { fontSize: 14, color: "#999", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  list: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: "#2c3e50",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  cardSubtitle: { fontSize: 12, color: "#999", marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: "700" },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  amountLabel: { fontSize: 13, color: "#888" },
  amountValue: { fontSize: 13, fontWeight: "600", color: "#1a1a1a" },
  actionRow: { flexDirection: "row", gap: 10, marginTop: 12 },
  actionBtn: { flex: 1, padding: 10, borderRadius: 8, alignItems: "center" },
  approveBtn: {
    backgroundColor: "#e8f8f0",
    borderWidth: 1,
    borderColor: "#2ecc71",
  },
  approveBtnText: { color: "#2ecc71", fontWeight: "700", fontSize: 14 },
  rejectBtn: {
    backgroundColor: "#fdf0ee",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  rejectBtnText: { color: "#e74c3c", fontWeight: "700", fontSize: 14 },
  progressContainer: { marginTop: 10 },
  progressBar: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    marginBottom: 6,
  },
  progressFill: { height: 8, backgroundColor: "#2ecc71", borderRadius: 4 },
  progressText: { fontSize: 12, color: "#888" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: { marginTop: 12, color: "#666" },
  emptyText: { fontSize: 16, color: "#999" },
});

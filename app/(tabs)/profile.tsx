import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Donation = {
  id: number;
  amount: number;
  status: string;
  type: string;
  charityId: number;
  createdAt: string;
};

export default function ProfileScreen() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "approved" | "pending">(
    "all",
  );

  const user = {
    name: "Sethum Damsavi",
    email: "sethumdamsavi1@gmail.com",
    joinedDate: "May 2026",
    avatar: "S",
  };

  const fetchDonations = async () => {
    try {
      const response = await fetch(
        "http://localhost:HTTPS://NISALAVILA-API-PRODUCTION.UP.RAILWAY.APP/api/donations/user/1",
      );
      const data = await response.json();
      setDonations(data);
    } catch (error) {
      console.error("Error fetching donations:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []);

  const filteredDonations = donations.filter((d) => {
    if (activeTab === "all") return true;
    return d.status === activeTab;
  });

  const totalDonated = donations
    .filter((d) => d.status === "approved")
    .reduce((sum, d) => sum + d.amount, 0);

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
    <View style={styles.donationCard}>
      <View style={styles.donationLeft}>
        <View style={styles.donationIcon}>
          <Text style={styles.donationIconText}>
            {item.type === "online" ? "💳" : "🏦"}
          </Text>
        </View>
        <View>
          <Text style={styles.donationTitle}>
            {item.type === "online" ? "Online Donation" : "Bank Slip Donation"}
          </Text>
          <Text style={styles.donationDate}>
            {new Date(item.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.donationCharity}>Charity #{item.charityId}</Text>
        </View>
      </View>
      <View style={styles.donationRight}>
        <Text style={styles.donationAmount}>
          LKR {item.amount.toLocaleString()}
        </Text>
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
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar and Info */}
        <View style={styles.profileInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatar}</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.profileJoined}>
              📅 Joined {user.joinedDate}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{donations.length}</Text>
          <Text style={styles.statLabel}>Total Donations</Text>
        </View>
        <View style={[styles.statCard, styles.statCardGreen]}>
          <Text style={[styles.statValue, { color: "#fff" }]}>
            LKR {totalDonated.toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: "#d5f5e3" }]}>
            Total Donated
          </Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>
            {donations.filter((d) => d.status === "pending").length}
          </Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
      </View>

      {/* Donation History */}
      <View style={styles.historySection}>
        <Text style={styles.sectionTitle}>Donation History</Text>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(["all", "approved", "pending"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                activeTab === tab && styles.filterTabActive,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeTab === tab && styles.filterTabTextActive,
                ]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#2ecc71" />
          </View>
        ) : filteredDonations.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyText}>No donations found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredDonations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDonation}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f0" },
  header: {
    backgroundColor: "#27ae60",
    padding: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  editButton: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  editButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  profileInfo: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: { fontSize: 30, fontWeight: "bold", color: "#27ae60" },
  profileDetails: { flex: 1 },
  profileName: { fontSize: 20, fontWeight: "700", color: "#fff" },
  profileEmail: { fontSize: 13, color: "#d5f5e3", marginTop: 2 },
  profileJoined: { fontSize: 12, color: "#a9dfbf", marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    marginTop: -15,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statCardGreen: { backgroundColor: "#27ae60" },
  statValue: { fontSize: 16, fontWeight: "700", color: "#1a1a1a" },
  statLabel: { fontSize: 10, color: "#999", marginTop: 4, textAlign: "center" },
  historySection: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
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
  filterTab: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  filterTabActive: { backgroundColor: "#2ecc71" },
  filterTabText: { fontSize: 13, color: "#999", fontWeight: "600" },
  filterTabTextActive: { color: "#fff" },
  donationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 3,
    borderLeftColor: "#2ecc71",
  },
  donationLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  donationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f4f0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  donationIconText: { fontSize: 18 },
  donationTitle: { fontSize: 14, fontWeight: "600", color: "#1a1a1a" },
  donationDate: { fontSize: 11, color: "#999", marginTop: 2 },
  donationCharity: { fontSize: 11, color: "#27ae60", marginTop: 2 },
  donationRight: { alignItems: "flex-end" },
  donationAmount: { fontSize: 15, fontWeight: "700", color: "#1a1a1a" },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 4,
  },
  statusText: { fontSize: 10, fontWeight: "700" },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyText: { fontSize: 15, color: "#999" },
});

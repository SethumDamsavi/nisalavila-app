import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Charity = {
  id: number;
  name: string;
  target: number;
  current: number;
};

export default function DonateScreen() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [amount, setAmount] = useState("");
  const [donationType, setDonationType] = useState<"online" | "offline">(
    "online",
  );
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const fetchCharities = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/charities");
      const data = await response.json();
      setCharities(data);
      if (data.length > 0) setSelectedCharity(data[0]);
    } catch (error) {
      Alert.alert("Error", "Cannot load charities");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleDonate = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }
    if (!selectedCharity) {
      Alert.alert("Error", "Please select a charity");
      return;
    }

    setLoading(true);
    try {
      const endpoint =
        donationType === "online"
          ? "http://localhost:5000/api/donations"
          : "http://localhost:5000/api/donations/offline";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          userId: 1,
          charityId: selectedCharity.id,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Success",
          donationType === "online"
            ? "Donation submitted successfully!"
            : "Offline donation submitted! Awaiting admin approval.",
        );
        setAmount("");
      } else {
        Alert.alert("Error", data.message);
      }
    } catch (error) {
      Alert.alert("Error", "Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2ecc71" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.header}>Make a Donation</Text>
      <Text style={styles.subheader}>Your contribution makes a difference</Text>

      {/* Select Charity */}
      <Text style={styles.sectionTitle}>Select Charity</Text>
      {charities.map((charity) => (
        <TouchableOpacity
          key={charity.id}
          style={[
            styles.charityOption,
            selectedCharity?.id === charity.id && styles.charityOptionSelected,
          ]}
          onPress={() => setSelectedCharity(charity)}
        >
          <View style={styles.charityOptionInner}>
            <View
              style={[
                styles.radio,
                selectedCharity?.id === charity.id && styles.radioSelected,
              ]}
            />
            <Text
              style={[
                styles.charityOptionText,
                selectedCharity?.id === charity.id &&
                  styles.charityOptionTextSelected,
              ]}
            >
              {charity.name}
            </Text>
          </View>
        </TouchableOpacity>
      ))}

      {/* Donation Type */}
      <Text style={styles.sectionTitle}>Donation Type</Text>
      <View style={styles.typeRow}>
        <TouchableOpacity
          style={[
            styles.typeButton,
            donationType === "online" && styles.typeButtonSelected,
          ]}
          onPress={() => setDonationType("online")}
        >
          <Text
            style={[
              styles.typeButtonText,
              donationType === "online" && styles.typeButtonTextSelected,
            ]}
          >
            Online
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.typeButton,
            donationType === "offline" && styles.typeButtonSelected,
          ]}
          onPress={() => setDonationType("offline")}
        >
          <Text
            style={[
              styles.typeButtonText,
              donationType === "offline" && styles.typeButtonTextSelected,
            ]}
          >
            Bank Slip
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Amounts */}
      <Text style={styles.sectionTitle}>Quick Amount (LKR)</Text>
      <View style={styles.quickAmounts}>
        {quickAmounts.map((q) => (
          <TouchableOpacity
            key={q}
            style={[
              styles.quickAmount,
              amount === q.toString() && styles.quickAmountSelected,
            ]}
            onPress={() => setAmount(q.toString())}
          >
            <Text
              style={[
                styles.quickAmountText,
                amount === q.toString() && styles.quickAmountTextSelected,
              ]}
            >
              {q.toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Custom Amount */}
      <Text style={styles.sectionTitle}>Or Enter Amount (LKR)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter custom amount"
        placeholderTextColor="#999"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      {/* Summary */}
      {selectedCharity && amount ? (
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Donation Summary</Text>
          <Text style={styles.summaryText}>
            Charity: {selectedCharity.name}
          </Text>
          <Text style={styles.summaryText}>
            Amount: LKR {parseFloat(amount).toLocaleString()}
          </Text>
          <Text style={styles.summaryText}>
            Type: {donationType === "online" ? "Online Payment" : "Bank Slip"}
          </Text>
        </View>
      ) : null}

      {/* Donate Button */}
      <TouchableOpacity
        style={styles.donateButton}
        onPress={handleDonate}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.donateButtonText}>
            {donationType === "online" ? "Donate Now" : "Submit Bank Slip"}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", padding: 16 },
  header: { fontSize: 28, fontWeight: "bold", color: "#1a1a1a", marginTop: 16 },
  subheader: { fontSize: 14, color: "#666", marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 10,
    marginTop: 16,
  },
  charityOption: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: "#eee",
  },
  charityOptionSelected: { borderColor: "#2ecc71", backgroundColor: "#f0fdf4" },
  charityOptionInner: { flexDirection: "row", alignItems: "center" },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#ccc",
    marginRight: 10,
  },
  radioSelected: { borderColor: "#2ecc71", backgroundColor: "#2ecc71" },
  charityOptionText: { fontSize: 15, color: "#444" },
  charityOptionTextSelected: { color: "#2ecc71", fontWeight: "600" },
  typeRow: { flexDirection: "row", gap: 10 },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#eee",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  typeButtonSelected: { borderColor: "#2ecc71", backgroundColor: "#f0fdf4" },
  typeButtonText: { fontSize: 14, color: "#666" },
  typeButtonTextSelected: { color: "#2ecc71", fontWeight: "600" },
  quickAmounts: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  quickAmount: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  quickAmountSelected: { borderColor: "#2ecc71", backgroundColor: "#f0fdf4" },
  quickAmountText: { fontSize: 14, color: "#444" },
  quickAmountTextSelected: { color: "#2ecc71", fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: "#1a1a1a",
  },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  summaryText: { fontSize: 14, color: "#555", marginBottom: 4 },
  donateButton: {
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  donateButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666" },
});

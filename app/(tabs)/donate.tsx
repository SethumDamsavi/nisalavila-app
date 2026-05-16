import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
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
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const quickAmounts = [500, 1000, 2500, 5000, 10000];

  const fetchCharities = async () => {
    try {
      const response = await fetch(
        "https://nisalavila-api-production.up.railway.app/api/charities",
      );
      const data = await response.json();
      setCharities(data);
      if (data.length > 0) setSelectedCharity(data[0]);
    } catch (error) {
      setErrorMessage("Cannot load charities");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCharities();
  }, []);

  const handleOnlineDonate = async () => {
    setErrorMessage("");
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }
    if (!selectedCharity) {
      setErrorMessage("Please select a charity");
      return;
    }
    setLoading(true);
    try {
      const intentResponse = await fetch(
        "https://nisalavila-api-production.up.railway.app/api/donations/create-payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: parseFloat(amount) }),
        },
      );
      const intentData = await intentResponse.json();
      if (!intentResponse.ok) {
        setErrorMessage(intentData.message);
        return;
      }
      const donationResponse = await fetch(
        "https://nisalavila-api-production.up.railway.app/api/donations",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            userId: 1,
            charityId: selectedCharity.id,
          }),
        },
      );
      if (donationResponse.ok) {
        setPaymentSuccess(true);
        setAmount("");
      } else {
        setErrorMessage("Donation failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOfflineDonate = async () => {
    setErrorMessage("");
    if (!amount || parseFloat(amount) <= 0) {
      setErrorMessage("Please enter a valid amount");
      return;
    }
    if (!selectedCharity) {
      setErrorMessage("Please select a charity");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://nisalavila-api-production.up.railway.app/api/donations/offline",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: parseFloat(amount),
            userId: 1,
            charityId: selectedCharity.id,
          }),
        },
      );
      const data = await response.json();
      if (response.ok) {
        setPaymentSuccess(true);
        setAmount("");
      } else {
        setErrorMessage(data.message);
      }
    } catch (error) {
      setErrorMessage("Cannot connect to server");
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>💳 Make a Donation</Text>
        <Text style={styles.headerSubtitle}>
          Your contribution makes a difference
        </Text>
      </View>

      <View style={styles.body}>
        {/* Success Message */}
        {paymentSuccess && (
          <View style={styles.successBox}>
            <Text style={styles.successIcon}>🎉</Text>
            <Text style={styles.successTitle}>
              {donationType === "online"
                ? "Payment Initiated!"
                : "Bank Slip Submitted!"}
            </Text>
            <Text style={styles.successText}>
              {donationType === "online"
                ? "Your donation has been submitted successfully via Stripe. Thank you for your generosity!"
                : "Your offline donation has been submitted and is awaiting admin approval within 24 hours."}
            </Text>
            <TouchableOpacity
              style={styles.successButton}
              onPress={() => setPaymentSuccess(false)}
            >
              <Text style={styles.successButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Error Message */}
        {errorMessage ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>⚠️ {errorMessage}</Text>
          </View>
        ) : null}

        {/* Select Charity */}
        <Text style={styles.sectionTitle}>Select Charity</Text>
        {charities.map((charity) => (
          <TouchableOpacity
            key={charity.id}
            style={[
              styles.charityOption,
              selectedCharity?.id === charity.id &&
                styles.charityOptionSelected,
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
              <View>
                <Text
                  style={[
                    styles.charityOptionText,
                    selectedCharity?.id === charity.id &&
                      styles.charityOptionTextSelected,
                  ]}
                >
                  {charity.name}
                </Text>
                <Text style={styles.charityTarget}>
                  Target: LKR {charity.target.toLocaleString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Payment Method */}
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              donationType === "online" && styles.typeButtonSelected,
            ]}
            onPress={() => setDonationType("online")}
          >
            <Text style={styles.typeIcon}>💳</Text>
            <Text
              style={[
                styles.typeButtonText,
                donationType === "online" && styles.typeButtonTextSelected,
              ]}
            >
              Online
            </Text>
            <Text style={styles.typeButtonSub}>Card Payment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              donationType === "offline" && styles.typeButtonSelected,
            ]}
            onPress={() => setDonationType("offline")}
          >
            <Text style={styles.typeIcon}>🏦</Text>
            <Text
              style={[
                styles.typeButtonText,
                donationType === "offline" && styles.typeButtonTextSelected,
              ]}
            >
              Bank Slip
            </Text>
            <Text style={styles.typeButtonSub}>Manual Transfer</Text>
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
            <Text style={styles.summaryTitle}>💰 Donation Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Charity</Text>
              <Text style={styles.summaryValue}>{selectedCharity.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Amount</Text>
              <Text
                style={[
                  styles.summaryValue,
                  { color: "#2ecc71", fontWeight: "700" },
                ]}
              >
                LKR {parseFloat(amount).toLocaleString()}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Method</Text>
              <Text style={styles.summaryValue}>
                {donationType === "online" ? "💳 Card Payment" : "🏦 Bank Slip"}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Donate Button */}
        <TouchableOpacity
          style={[styles.donateButton, loading && styles.donateButtonDisabled]}
          onPress={
            donationType === "online" ? handleOnlineDonate : handleOfflineDonate
          }
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.donateButtonText}>
              {donationType === "online"
                ? "💳 Pay with Stripe"
                : "🏦 Submit Bank Slip"}
            </Text>
          )}
        </TouchableOpacity>

        {donationType === "online" && (
          <View style={styles.stripeBadge}>
            <Text style={styles.stripeBadgeText}>🔒 Secured by Stripe</Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
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
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 13, color: "#d5f5e3", marginTop: 4 },
  body: { padding: 16 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 10,
    marginTop: 16,
  },
  successBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#2ecc71",
  },
  successIcon: { fontSize: 48, marginBottom: 12 },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  successButton: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
  },
  successButtonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  errorBox: {
    backgroundColor: "#fdf0ee",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#e74c3c",
  },
  errorText: { color: "#e74c3c", fontSize: 13 },
  charityOption: {
    backgroundColor: "#fff",
    borderRadius: 12,
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
    marginRight: 12,
  },
  radioSelected: { borderColor: "#2ecc71", backgroundColor: "#2ecc71" },
  charityOptionText: { fontSize: 15, color: "#444", fontWeight: "600" },
  charityOptionTextSelected: { color: "#2ecc71" },
  charityTarget: { fontSize: 12, color: "#999", marginTop: 2 },
  typeRow: { flexDirection: "row", gap: 10 },
  typeButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#eee",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  typeButtonSelected: { borderColor: "#2ecc71", backgroundColor: "#f0fdf4" },
  typeIcon: { fontSize: 24, marginBottom: 4 },
  typeButtonText: { fontSize: 14, color: "#666", fontWeight: "600" },
  typeButtonTextSelected: { color: "#2ecc71" },
  typeButtonSub: { fontSize: 11, color: "#999", marginTop: 2 },
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
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1a1a1a",
  },
  summary: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
  },
  summaryTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  summaryLabel: { fontSize: 13, color: "#888" },
  summaryValue: { fontSize: 13, color: "#1a1a1a" },
  donateButton: {
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
  },
  donateButtonDisabled: { opacity: 0.7 },
  donateButtonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  stripeBadge: { alignItems: "center", marginTop: 10 },
  stripeBadgeText: { fontSize: 12, color: "#999" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 12, color: "#666" },
});

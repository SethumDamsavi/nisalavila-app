import React, { useState } from "react";
import {
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get("window");

type Video = {
  id: number;
  title: string;
  charity: string;
  description: string;
  likes: number;
  comments: number;
  shares: number;
  duration: string;
  thumbnail: string;
  category: string;
};

const VIDEOS: Video[] = [
  {
    id: 1,
    title: "School Supplies Distribution Day",
    charity: "Children Education Fund",
    description:
      "Watch how we distributed school supplies to 200 children in Colombo. Your donations made this possible! 🙏",
    likes: 1240,
    comments: 89,
    shares: 45,
    duration: "2:34",
    thumbnail: "📚",
    category: "Education",
  },
  {
    id: 2,
    title: "New Classroom Construction Update",
    charity: "Children Education Fund",
    description:
      "Our new classroom is 60% complete! Thanks to your generous donations we are building a brighter future.",
    likes: 892,
    comments: 56,
    shares: 34,
    duration: "1:45",
    thumbnail: "🏫",
    category: "Infrastructure",
  },
  {
    id: 3,
    title: "Student Success Stories",
    charity: "Children Education Fund",
    description:
      "Meet the students whose lives you have changed through your donations. Their smiles say it all! 😊",
    likes: 2100,
    comments: 134,
    shares: 78,
    duration: "3:12",
    thumbnail: "🎓",
    category: "Stories",
  },
  {
    id: 4,
    title: "Monthly Fundraising Event Highlights",
    charity: "Children Education Fund",
    description:
      "Highlights from our monthly fundraising event. We raised LKR 150,000 in just one day!",
    likes: 567,
    comments: 43,
    shares: 21,
    duration: "4:05",
    thumbnail: "🎉",
    category: "Events",
  },
  {
    id: 5,
    title: "Teacher Training Program",
    charity: "Children Education Fund",
    description:
      "We trained 15 new teachers this month. Quality education starts with quality teachers!",
    likes: 445,
    comments: 28,
    shares: 15,
    duration: "2:58",
    thumbnail: "👩‍🏫",
    category: "Education",
  },
];

const COLORS = ["#1a472a", "#2d6a4f", "#1b4332", "#2c5f2e", "#1e3a2f"];

export default function VideosScreen() {
  const [likedVideos, setLikedVideos] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState<{ [key: number]: boolean }>({});

  const toggleLike = (id: number) => {
    setLikedVideos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const togglePlay = (id: number) => {
    setPlaying((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const renderVideo = ({ item, index }: { item: Video; index: number }) => {
    const bgColor = COLORS[index % COLORS.length];
    const isLiked = likedVideos[item.id];
    const isPlaying = playing[item.id];

    return (
      <View style={[styles.videoContainer, { backgroundColor: bgColor }]}>
        {/* Video Placeholder */}
        <TouchableOpacity
          style={styles.videoArea}
          onPress={() => togglePlay(item.id)}
          activeOpacity={0.9}
        >
          <Text style={styles.thumbnail}>{item.thumbnail}</Text>
          <View style={styles.playOverlay}>
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>{isPlaying ? "⏸" : "▶"}</Text>
            </View>
          </View>
          <View style={styles.durationBadge}>
            <Text style={styles.durationText}>{item.duration}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </TouchableOpacity>

        {/* Video Info */}
        <View style={styles.videoInfo}>
          <View style={styles.charityRow}>
            <View style={styles.charityAvatar}>
              <Text style={styles.charityAvatarText}>N</Text>
            </View>
            <View style={styles.charityDetails}>
              <Text style={styles.charityName}>{item.charity}</Text>
              <Text style={styles.charityVerified}>✓ Verified Charity</Text>
            </View>
            <TouchableOpacity style={styles.followBtn}>
              <Text style={styles.followBtnText}>Follow</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Donate Bar */}
          <TouchableOpacity style={styles.donateBar}>
            <Text style={styles.donateBarText}>💳 Donate to this charity</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => toggleLike(item.id)}
          >
            <Text style={styles.actionIcon}>{isLiked ? "❤️" : "🤍"}</Text>
            <Text style={styles.actionCount}>
              {formatNumber(item.likes + (isLiked ? 1 : 0))}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionCount}>
              {formatNumber(item.comments)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>🔗</Text>
            <Text style={styles.actionCount}>{formatNumber(item.shares)}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn}>
            <Text style={styles.actionIcon}>⬆️</Text>
            <Text style={styles.actionCount}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Videos</Text>
        <Text style={styles.headerSubtitle}>
          Swipe to explore charity stories
        </Text>
      </View>

      <FlatList
        data={VIDEOS}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderVideo}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
        onViewableItemsChanged={({ viewableItems }) => {
          if (viewableItems.length > 0) {
            setCurrentIndex(viewableItems[0].index ?? 0);
          }
        }}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0a0a" },
  header: {
    backgroundColor: "#0a0a0a",
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 12, color: "#666" },
  list: { paddingBottom: 20 },
  videoContainer: {
    margin: 12,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  videoArea: {
    height: 280,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  thumbnail: { fontSize: 80 },
  playOverlay: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
  playButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  playIcon: { fontSize: 18 },
  durationBadge: {
    position: "absolute",
    bottom: 16,
    left: 16,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  durationText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  categoryBadge: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#2ecc71",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  categoryText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  videoInfo: { padding: 16 },
  charityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  charityAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  charityAvatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  charityDetails: { flex: 1 },
  charityName: { color: "#fff", fontWeight: "700", fontSize: 14 },
  charityVerified: { color: "#2ecc71", fontSize: 11, marginTop: 1 },
  followBtn: {
    borderWidth: 1,
    borderColor: "#2ecc71",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  followBtnText: { color: "#2ecc71", fontSize: 12, fontWeight: "600" },
  videoTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  videoDescription: {
    color: "#aaa",
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  donateBar: {
    backgroundColor: "#2ecc71",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  donateBarText: { color: "#fff", fontWeight: "700", fontSize: 13 },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
  },
  actionBtn: { alignItems: "center" },
  actionIcon: { fontSize: 22, marginBottom: 4 },
  actionCount: { color: "#fff", fontSize: 11, fontWeight: "600" },
});

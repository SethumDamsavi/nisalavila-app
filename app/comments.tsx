import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useTheme } from "../utils/theme";

type Comment = {
  id: number;
  content: string;
  postId: number;
  userId: number;
  userName: string;
  createdAt: string;
};

const API = "https://nisalavila-api-production.up.railway.app";

export default function CommentsScreen() {
  const { theme } = useTheme();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const postId = 1;

  const fetchComments = async () => {
    try {
      const response = await fetch(`${API}/api/comments/post/${postId}`);
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      const response = await fetch(`${API}/api/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          postId,
          userId: 1,
          userName: "Sethum",
        }),
      });
      if (response.ok) {
        setNewComment("");
        fetchComments();
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setPosting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View
      style={[
        styles.commentCard,
        {
          backgroundColor: theme.colors.card,
          borderBottomColor: theme.colors.border,
        },
      ]}
    >
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {item.userName.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={[styles.commentUserName, { color: theme.colors.text }]}>
            {item.userName}
          </Text>
          <Text style={[styles.commentTime, { color: theme.colors.subtext }]}>
            {formatDate(item.createdAt)}
          </Text>
        </View>
        <Text style={[styles.commentText, { color: theme.colors.text }]}>
          {item.content}
        </Text>
        <View style={styles.commentActions}>
          <TouchableOpacity style={styles.commentAction}>
            <Text
              style={[
                styles.commentActionText,
                { color: theme.colors.subtext },
              ]}
            >
              👍 Like
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentAction}>
            <Text
              style={[
                styles.commentActionText,
                { color: theme.colors.subtext },
              ]}
            >
              💬 Reply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.colors.header }]}>
        <Text style={styles.headerTitle}>💬 Comments</Text>
        <Text style={styles.headerSubtitle}>{comments.length} comments</Text>
      </View>

      {/* Comments List */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2ecc71" />
          <Text style={[styles.loadingText, { color: theme.colors.subtext }]}>
            Loading comments...
          </Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderComment}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={[styles.emptyText, { color: theme.colors.subtext }]}>
                No comments yet
              </Text>
              <Text
                style={[styles.emptySubtext, { color: theme.colors.subtext }]}
              >
                Be the first to comment!
              </Text>
            </View>
          }
        />
      )}

      {/* Comment Input */}
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.card,
            borderTopColor: theme.colors.border,
          },
        ]}
      >
        <View style={styles.inputAvatar}>
          <Text style={styles.inputAvatarText}>S</Text>
        </View>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.input,
              color: theme.colors.text,
            },
          ]}
          placeholder="Write a comment..."
          placeholderTextColor={theme.colors.placeholder}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !newComment.trim() && styles.sendBtnDisabled]}
          onPress={handlePostComment}
          disabled={posting || !newComment.trim()}
        >
          {posting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendBtnText}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    padding: 20,
    paddingTop: 50,
    paddingBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 12, color: "#d5f5e3", marginTop: 2 },
  list: { padding: 16, paddingBottom: 20 },
  commentCard: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
    borderRadius: 12,
  },
  commentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  commentAvatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  commentContent: { flex: 1 },
  commentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  commentUserName: { fontSize: 14, fontWeight: "700" },
  commentTime: { fontSize: 11 },
  commentText: { fontSize: 14, lineHeight: 20, marginBottom: 8 },
  commentActions: { flexDirection: "row", gap: 16 },
  commentAction: { padding: 2 },
  commentActionText: { fontSize: 12, fontWeight: "500" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    gap: 10,
  },
  inputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2ecc71",
    alignItems: "center",
    justifyContent: "center",
  },
  inputAvatarText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#2ecc71",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: { marginTop: 12, fontSize: 14 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, fontWeight: "600" },
  emptySubtext: { fontSize: 13, marginTop: 4 },
});

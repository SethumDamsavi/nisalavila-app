import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { useTheme } from "../utils/theme";

type SkeletonProps = {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
};

export const SkeletonBox = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme.dark ? "#333" : "#e0e0e0",
          opacity,
        },
        style,
      ]}
    />
  );
};

export const PostSkeleton = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <View style={styles.cardTop}>
        <SkeletonBox width={44} height={44} borderRadius={22} />
        <View style={styles.cardMeta}>
          <SkeletonBox width={120} height={14} />
          <SkeletonBox width={80} height={11} style={{ marginTop: 6 }} />
        </View>
      </View>
      <SkeletonBox height={1} style={{ marginVertical: 12 }} />
      <SkeletonBox height={18} style={{ marginBottom: 8 }} />
      <SkeletonBox height={14} style={{ marginBottom: 6 }} />
      <SkeletonBox width="70%" height={14} style={{ marginBottom: 12 }} />
      <SkeletonBox height={1} style={{ marginVertical: 8 }} />
      <View style={styles.actions}>
        <SkeletonBox width={60} height={14} />
        <SkeletonBox width={60} height={14} />
        <SkeletonBox width={60} height={14} />
      </View>
    </View>
  );
};

export const CharitySkeleton = () => {
  const { theme } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
      <SkeletonBox width="60%" height={18} style={{ marginBottom: 8 }} />
      <SkeletonBox height={14} style={{ marginBottom: 6 }} />
      <SkeletonBox width="80%" height={14} style={{ marginBottom: 12 }} />
      <SkeletonBox height={8} borderRadius={4} style={{ marginBottom: 6 }} />
      <SkeletonBox width="40%" height={12} style={{ marginBottom: 12 }} />
      <SkeletonBox height={40} borderRadius={8} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  cardMeta: { flex: 1, gap: 6 },
  actions: { flexDirection: "row", justifyContent: "space-around" },
});

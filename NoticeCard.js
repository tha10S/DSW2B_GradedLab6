import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function NoticeCard({ notice }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{notice.title}</Text>
      <Text style={styles.body}>{notice.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    borderLeftWidth: 4,
    borderLeftColor: "#F5811F",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  body: {
    fontSize: 14,
    color: "#4a4a4a",
    lineHeight: 20,
  },
});
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import NoticeCard from "./NoticeCard";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

export default function NoticesScreen() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.json();
      const first10 = data.slice(0, 10);
      setNotices(first10);
    } catch (e) {
      console.log("Fetch failed:", e);
      setError("Unable to load notices. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>UJ Campus Notices</Text>

      {loading && notices.length === 0 && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#F5811F" />
          <Text style={styles.loadingText}>Loading notices...</Text>
        </View>
      )}

      {!loading && error && notices.length === 0 && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.button} onPress={fetchNotices}>
            <Text style={styles.buttonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {notices.length > 0 && (
        <FlatList
          data={notices}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <NoticeCard notice={item} />}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={fetchNotices}>
          <Text style={styles.secondaryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  header: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1a1a1a",
    padding: 16,
    paddingBottom: 8,
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { marginTop: 10, color: "#555" },
  errorText: { color: "#b00020", textAlign: "center", marginBottom: 12 },
  button: {
    backgroundColor: "#F5811F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  footer: {
    padding: 16,
  },
  secondaryButton: {
    backgroundColor: "#1a1a1a",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
});
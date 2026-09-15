import React, {useState, useEffect, useCallback} from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NoticeCard from "./NoticeCard";

const API_URL = "https://jsonplaceholder.typicode.com/posts";
const CACHE_KEY = "@uj/notices/cache";
const LAST_UPDATED_KEY = "@uj/notices/lastUpdated";

export default function NoticesScreen() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isShowingCache, setIsShowingCache] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadCache = useCallback(async () => {
    try {
      const cachedJson = await AsyncStorage.getItem(CACHE_KEY);
      const cachedTime = await AsyncStorage.getItem(LAST_UPDATED_KEY);
      if (cachedJson !== null) {
        setNotices(JSON.parse(cachedJson));
        setIsShowingCache(true);
        setLastUpdated(cachedTime);
      }
    } catch (e) {
      console.log("Cache read failed:", e);
    }
  }, []);

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
      setIsShowingCache(false);

      const nowLabel = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      setLastUpdated(nowLabel);

      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(first10));
      await AsyncStorage.setItem(LAST_UPDATED_KEY, nowLabel);
    } catch (e) {
      console.log("Fetch failed:", e);
      const cachedJson = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedJson !== null) {
        setNotices(JSON.parse(cachedJson));
        setIsShowingCache(true);
        const cachedTime = await AsyncStorage.getItem(LAST_UPDATED_KEY);
        setLastUpdated(cachedTime);
        setError(null);
      } else {
        setError("Unable to load notices. Check your connection and try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await loadCache();
      await fetchNotices();
    })();
  }, [loadCache, fetchNotices]);

  const handleClearCache = async () => {
    try {
      await AsyncStorage.removeItem(CACHE_KEY);
      await AsyncStorage.removeItem(LAST_UPDATED_KEY);
      setIsShowingCache(false);
      setLastUpdated(null);
    } catch (e) {
      console.log("Clear cache failed:", e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>UJ Campus Notices</Text>

      {isShowingCache && (
        <Text style={styles.statusBanner}>
          Saved copy • Last updated {lastUpdated || "unknown"}
        </Text>
      )}

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
        <TouchableOpacity style={styles.secondaryButton} onPress={handleClearCache}>
          <Text style={styles.secondaryButtonText}>Clear Saved Notices</Text>
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
  statusBanner: {
    backgroundColor: "#FFF3E0",
    color: "#8a4b00",
    paddingVertical: 6,
    paddingHorizontal: 16,
    fontSize: 13,
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#1a1a1a",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: { color: "#fff", fontWeight: "600", fontSize: 13 },
});
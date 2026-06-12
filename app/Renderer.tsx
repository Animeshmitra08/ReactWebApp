import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";

type RendererProps = {
  url?: string;
  onReset?: () => void;
};

export default function Renderer({ url: urlProp, onReset }: RendererProps) {
  const { url: urlParam } = useLocalSearchParams();
  const url = urlProp ?? (urlParam as string);
  const webViewRef = useRef<WebView>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const backAction = () => {
      if (canGoBack && webViewRef.current) {
        webViewRef.current.goBack();
        return true; // prevent app exit
      }
      return false; // allow default behavior (exit app)
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [canGoBack]);

  const handleRetry = () => {
    setError(null);
    setRetryKey((k) => k + 1);
  };
  
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorBadge}>
          <Ionicons name="cloud-offline-outline" size={36} color="#ef4444" />
        </View>

        <Text style={styles.errorTitle}>Couldn&apos;t load page</Text>
        <Text style={styles.errorUrl} numberOfLines={1}>
          {url}
        </Text>
        <Text style={styles.errorDescription}>{error}</Text>

        <Pressable
          onPress={handleRetry}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.primaryButtonText}>Try Again</Text>
        </Pressable>

        <Pressable
          onPress={onReset}
          style={({ pressed }) => [
            styles.secondaryButton,
            pressed && styles.secondaryButtonPressed,
          ]}
        >
          <Ionicons name="swap-horizontal" size={18} color="#6366f1" />
          <Text style={styles.secondaryButtonText}>Change Website</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        key={retryKey}
        ref={webViewRef}
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        )}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          setError(nativeEvent.description || "Something went wrong.");
        }}
        onNavigationStateChange={(navState) => {
          setCanGoBack(navState.canGoBack);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webview: { flex: 1 },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },

  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 32,
  },

  errorBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#fee2e2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },

  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 6,
  },

  errorUrl: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366f1",
    marginBottom: 10,
    maxWidth: "100%",
  },

  errorDescription: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 28,
  },

  primaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 15,
    alignSelf: "stretch",
    marginBottom: 12,
  },

  primaryButtonPressed: {
    backgroundColor: "#4f46e5",
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  secondaryButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingVertical: 15,
    alignSelf: "stretch",
  },

  secondaryButtonPressed: {
    backgroundColor: "#eef2ff",
    borderColor: "#6366f1",
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6366f1",
  },
});

import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function App() {
  const [url, setUrl] = useState("https://example.com");
  const [input, setInput] = useState("");

  const loadUrl = () => {
    let formatted = input.trim();

    // ensure http/https exists
    if (!formatted.startsWith("http")) {
      formatted = "https://" + formatted;
    }

    setUrl(formatted);
  };

  return (
    <View style={styles.container}>
      {/* URL Input */}
      <View style={styles.topBar}>
        <TextInput
          style={styles.input}
          placeholder="Enter URL..."
          value={input}
          onChangeText={setInput}
        />
        <Button title="Go" onPress={loadUrl} />
      </View>

      {/* WebView */}
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    marginRight: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  webview: {
    flex: 1,
  },
});
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";

export const SAVED_URL_KEY = "savedUrl";

type HomePageProps = {
  onUrlSaved: (url: string) => void;
};

export default function HomePage({ onUrlSaved }: HomePageProps) {
  const [url, setUrl] = useState("");
  const [focused, setFocused] = useState(false);

  const canSubmit = url.trim().length > 0;

  const handleGo = async () => {
    let finalUrl = url.trim();

    if (!finalUrl) {
      return;
    }

    if (!finalUrl.startsWith("http")) {
      finalUrl = "https://" + finalUrl;
    }

    await AsyncStorage.setItem(SAVED_URL_KEY, finalUrl);
    onUrlSaved(finalUrl);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.content}>
        <View style={styles.hero}>
          <View style={styles.logoBadge}>
            <Ionicons name="globe-outline" size={36} color="#fff" />
          </View>
          <Text style={styles.title}>Web Launcher</Text>
          <Text style={styles.subtitle}>
            Enter a website address once — the app will open it automatically
            every time you launch.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Website URL</Text>

          <View
            style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}
          >
            <Ionicons
              name="link-outline"
              size={20}
              color={focused ? "#6366f1" : "#94a3b8"}
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="e.g. google.com"
              placeholderTextColor="#94a3b8"
              value={url}
              onChangeText={setUrl}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              style={styles.input}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              returnKeyType="go"
              onSubmitEditing={handleGo}
            />
          </View>

          <Pressable
            onPress={handleGo}
            disabled={!canSubmit}
            style={({ pressed }) => [
              styles.button,
              !canSubmit && styles.buttonDisabled,
              pressed && canSubmit && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Open Website</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </Pressable>
        </View>

        <Text style={styles.footerNote}>
          Your choice is saved on this device until app data is cleared.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  hero: {
    alignItems: "center",
    marginBottom: 32,
  },

  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: "#6366f1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,

    shadowColor: "#6366f1",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#64748b",
    textAlign: "center",
    maxWidth: 300,
  },

  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",

    shadowColor: "#0f172a",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  inputWrapperFocused: {
    borderColor: "#6366f1",
  },

  inputIcon: {
    marginRight: 8,
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: "#0f172a",
  },

  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingVertical: 15,
  },

  buttonPressed: {
    backgroundColor: "#4f46e5",
  },

  buttonDisabled: {
    backgroundColor: "#cbd5e1",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },

  footerNote: {
    fontSize: 12,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 24,
  },
});

/**
 * Example usage of expo-captions-settings.
 * Place this in your Expo project (e.g. app/index.tsx or App.tsx).
 */

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  getAllCaptionSettings,
  isCaptionsEnabled,
  getCaptionStyle,
  getCaptionLocale,
  type CaptionStyle,
} from "expo-captions-settings";

type AllSettings = CaptionStyle & { locale: string | null };

export default function CaptionsExample() {
  const [loading, setLoading]   = useState(false);
  const [settings, setSettings] = useState<AllSettings | null>(null);
  const [error, setError]       = useState<string | null>(null);

  const load = async () => {
    if (Platform.OS !== "android") {
      setError("expo-captions-settings is Android only.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getAllCaptionSettings();
      setSettings(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const Row = ({ label, value }: { label: string; value: any }) => (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{String(value ?? "null")}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📺 Caption Settings</Text>

      {loading && <ActivityIndicator />}
      {error   && <Text style={styles.error}>{error}</Text>}

      {settings && (
        <View style={styles.card}>
          <Row label="Enabled"        value={settings.isEnabled ? "✅ Yes" : "❌ No"} />
          <Row label="Font Scale"     value={settings.fontScale} />
          <Row label="Font Scale Raw" value={settings.fontScaleRaw} />
          <Row label="Font Family"    value={settings.fontFamily} />
          <Row label="Edge Type"      value={settings.edgeType} />
          <Row label="Locale"         value={settings.locale} />

          {/* Color swatches */}
          {settings.foregroundColor && (
            <View style={styles.row}>
              <Text style={styles.label}>Text Color</Text>
              <View style={[styles.swatch, { backgroundColor: settings.foregroundColor?.slice(0, 1) + settings.foregroundColor?.slice(3) }]} />
              <Text style={styles.value}>{settings.foregroundColor}</Text>
            </View>
          )}
          {settings.backgroundColor && (
            <View style={styles.row}>
              <Text style={styles.label}>BG Color</Text>
              <View style={[styles.swatch, { backgroundColor: settings.backgroundColor?.slice(0, 1) + settings.backgroundColor?.slice(3) }]} />
              <Text style={styles.value}>{settings.backgroundColor}</Text>
            </View>
          )}
        </View>
      )}

      <Button title="Refresh" onPress={load} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  title:     { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  card:      { backgroundColor: "#f4f4f4", borderRadius: 12, padding: 16, gap: 8 },
  row:       { flexDirection: "row", alignItems: "center", gap: 8 },
  label:     { width: 130, fontWeight: "600", fontSize: 13 },
  value:     { flex: 1, fontSize: 13, color: "#333" },
  swatch:    { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: "#ccc" },
  error:     { color: "red", marginBottom: 8 },
});

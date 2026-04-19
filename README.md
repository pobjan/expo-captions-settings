# expo-captions-settings

Expo module for reading Android system caption/subtitle accessibility settings via the native `CaptioningManager` API.

> ⚠️ **Android only.** iOS does not expose subtitle preferences in the same way.

---

## Installation

```bash
npm install pobjan/expo-captions-settings
```

That's it — Expo's autolinking handles everything automatically. No manual linking, no `MainApplication.java` edits needed.

> Requires Expo SDK 50+ and a **development build** (does not work in Expo Go).

---

## Quick Start

```tsx
import { getCaptionStyle, isCaptionsEnabled } from 'expo-captions-settings';

export default function App() {
  const checkCaptions = async () => {
    const enabled = await isCaptionsEnabled();
    const style   = await getCaptionStyle();

    console.log('Captions enabled:', enabled);
    console.log('Font scale:',       style.fontScale);       // "LARGE"
    console.log('Text color:',       style.foregroundColor); // "#FFFFFFFF"
    console.log('Background color:', style.backgroundColor); // "#FF000000"
  };

  return (
    <Button title="Check Captions" onPress={checkCaptions} />
  );
}
```

---

## API

### `isCaptionsEnabled(): Promise<boolean>`

Returns `true` if the user enabled captions in Android Accessibility settings.

```ts
const enabled = await isCaptionsEnabled();
```

---

### `getCaptionStyle(): Promise<CaptionStyle>`

Returns the full caption style object configured by the user.

```ts
const style = await getCaptionStyle();
```

#### `CaptionStyle` object

| Property          | Type                    | Description                                           |
|-------------------|-------------------------|-------------------------------------------------------|
| `isEnabled`       | `boolean`               | Whether captions are enabled                          |
| `foregroundColor` | `string \| null`        | Text color as `#AARRGGBB` hex, or `null` if default   |
| `backgroundColor` | `string \| null`        | Background color as `#AARRGGBB`, or `null` if default |
| `windowColor`     | `string \| null`        | Container color as `#AARRGGBB`, or `null` if default  |
| `edgeColor`       | `string \| null`        | Edge/shadow color as `#AARRGGBB`                      |
| `edgeType`        | `CaptionEdgeType`       | Edge style (`"NONE"`, `"OUTLINE"`, `"DROP_SHADOW"`, `"RAISED"`, `"DEPRESSED"`, `"UNKNOWN"`) |
| `fontScale`       | `CaptionFontScale`      | Font size (`"VERY_SMALL"`, `"SMALL"`, `"NORMAL"`, `"LARGE"`, `"VERY_LARGE"`, `"UNKNOWN"`) |
| `fontScaleRaw`    | `number`                | Raw float value from Android (e.g. `1.0`, `1.5`)     |
| `fontFamily`      | `CaptionFontFamily`     | Font family (see below)                               |

#### `CaptionFontFamily` values

`"DEFAULT"` · `"MONOSPACED_SERIF"` · `"PROPORTIONAL_SERIF"` · `"MONOSPACED_SANS_SERIF"` · `"PROPORTIONAL_SANS_SERIF"` · `"CASUAL"` · `"CURSIVE"` · `"SMALL_CAPITALS"` · `"UNKNOWN"`

---

### `getCaptionLocale(): Promise<string | null>`

Returns the user-preferred captions locale as a BCP 47 language tag (e.g. `"pl-PL"`, `"en-US"`), or `null` if not set.

```ts
const locale = await getCaptionLocale();
```

---

### `getAllCaptionSettings(): Promise<CaptionStyle & { locale: string | null }>`

Returns everything in one call — all `CaptionStyle` fields plus `locale`.

```ts
const settings = await getAllCaptionSettings();
console.log(settings.isEnabled);
console.log(settings.locale);   // "pl-PL"
```

---

## Full Example

```tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAllCaptionSettings } from 'expo-captions-settings';

export default function CaptionsDemo() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    getAllCaptionSettings().then(setSettings);
  }, []);

  if (!settings) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text>Enabled: {settings.isEnabled ? '✅' : '❌'}</Text>
      <Text>Font scale: {settings.fontScale}</Text>
      <Text>Font family: {settings.fontFamily}</Text>
      <Text>Text color: {settings.foregroundColor ?? 'default'}</Text>
      <Text>BG color: {settings.backgroundColor ?? 'default'}</Text>
      <Text>Edge type: {settings.edgeType}</Text>
      <Text>Locale: {settings.locale ?? 'not set'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, gap: 8 }
});
```

---

## Requirements

- Expo SDK **50+**
- React Native **0.73+**
- Android **API 19+** (KitKat — `CaptioningManager` was introduced here)
- **Development build** — not compatible with Expo Go

---

## How to Test Caption Settings

1. On your Android device: **Settings → Accessibility → Caption preferences**
2. Enable captions and change font size, color, background
3. Run the app and call `getCaptionStyle()` — you'll see the changes reflected

---

## License

MIT

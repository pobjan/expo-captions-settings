import { requireNativeModule } from "expo-modules-core";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Font scale / size for captions.
 * Maps to Android CaptioningManager.CaptionStyle font scale values.
 */
export type CaptionFontScale =
  | "VERY_SMALL"
  | "SMALL"
  | "NORMAL"
  | "LARGE"
  | "VERY_LARGE"
  | "UNKNOWN";

/**
 * Edge type applied to caption text.
 */
export type CaptionEdgeType =
  | "NONE"
  | "OUTLINE"
  | "DROP_SHADOW"
  | "RAISED"
  | "DEPRESSED"
  | "UNKNOWN";

/**
 * Font family / typeface used for captions.
 */
export type CaptionFontFamily =
  | "DEFAULT"
  | "MONOSPACED_SERIF"
  | "PROPORTIONAL_SERIF"
  | "MONOSPACED_SANS_SERIF"
  | "PROPORTIONAL_SANS_SERIF"
  | "CASUAL"
  | "CURSIVE"
  | "SMALL_CAPITALS"
  | "UNKNOWN";

/**
 * Full caption style object returned by getCaptionStyle().
 */
export interface CaptionStyle {
  /** Whether the user has enabled captions in accessibility settings */
  isEnabled: boolean;

  /** Foreground (text) color as #AARRGGBB hex string, or null if not set */
  foregroundColor: string | null;

  /** Background color as #AARRGGBB hex string, or null if not set */
  backgroundColor: string | null;

  /** Window (container) color as #AARRGGBB hex string, or null if not set */
  windowColor: string | null;

  /** Edge (shadow/outline) color as #AARRGGBB hex string, or null if not set */
  edgeColor: string | null;

  /** Edge type applied to text */
  edgeType: CaptionEdgeType;

  /** Caption font scale */
  fontScale: CaptionFontScale;

  /** Caption font family */
  fontFamily: CaptionFontFamily;

  /**
   * Raw font scale number as reported by Android (e.g. 0.25, 0.5, 1.0, 1.5, 2.0).
   * -1 if not available.
   */
  fontScaleRaw: number;
}

// ─── Native Module ─────────────────────────────────────────────────────────────

const NativeModule = requireNativeModule("ExpoCaptionsSettings");

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns whether the user has enabled closed captions / subtitles
 * in Android Accessibility settings.
 *
 * @example
 * ```ts
 * import { isCaptionsEnabled } from 'expo-captions-settings';
 *
 * const enabled = await isCaptionsEnabled();
 * console.log('Captions enabled:', enabled);
 * ```
 */
export async function isCaptionsEnabled(): Promise<boolean> {
  return NativeModule.isCaptionsEnabled();
}

/**
 * Returns the full caption style preferences configured by the user
 * in Android Accessibility → Caption preferences.
 *
 * @example
 * ```ts
 * import { getCaptionStyle } from 'expo-captions-settings';
 *
 * const style = await getCaptionStyle();
 * console.log(style.foregroundColor); // e.g. "#FFFFFFFF"
 * console.log(style.fontScale);       // e.g. "LARGE"
 * ```
 */
export async function getCaptionStyle(): Promise<CaptionStyle> {
  return NativeModule.getCaptionStyle();
}

/**
 * Convenience: Returns the raw CaptioningManager locale/language tag
 * (e.g. "pl-PL", "en-US") or null if not set.
 *
 * @example
 * ```ts
 * import { getCaptionLocale } from 'expo-captions-settings';
 *
 * const locale = await getCaptionLocale();
 * console.log('Caption locale:', locale); // "pl-PL"
 * ```
 */
export async function getCaptionLocale(): Promise<string | null> {
  return NativeModule.getCaptionLocale();
}

/**
 * Returns all caption settings at once as a single object.
 * Combines isCaptionsEnabled(), getCaptionStyle(), and getCaptionLocale().
 *
 * @example
 * ```ts
 * import { getAllCaptionSettings } from 'expo-captions-settings';
 *
 * const settings = await getAllCaptionSettings();
 * console.log(settings);
 * ```
 */
export async function getAllCaptionSettings(): Promise<
  CaptionStyle & { locale: string | null }
> {
  return NativeModule.getAllCaptionSettings();
}

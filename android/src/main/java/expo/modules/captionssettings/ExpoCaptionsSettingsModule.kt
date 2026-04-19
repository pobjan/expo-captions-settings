
package expo.modules.captionssettings

import android.content.Context
import android.view.accessibility.CaptioningManager
import android.view.accessibility.CaptioningManager.CaptionStyle
import android.graphics.Color
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import java.util.Locale

class ExpoCaptionsSettingsModule : Module() {

    private val context: Context
        get() = requireNotNull(appContext.reactContext) { "React Application Context is null" }

    private val captioningManager: CaptioningManager
        get() = context.getSystemService(Context.CAPTIONING_SERVICE) as CaptioningManager

    override fun definition() = ModuleDefinition {

        Name("ExpoCaptionsSettings")

        // ── isCaptionsEnabled ──────────────────────────────────────────────────
        AsyncFunction("isCaptionsEnabled") { promise: Promise ->
            try {
                val enabled = captioningManager.isEnabled
                promise.resolve(enabled)
            } catch (e: Exception) {
                promise.reject("ERR_CAPTIONS_ENABLED", "Failed to read captions enabled state: ${e.message}", e)
            }
        }

        // ── getCaptionStyle ────────────────────────────────────────────────────
        AsyncFunction("getCaptionStyle") { promise: Promise ->
            try {
                val cm = captioningManager
                val style = cm.userStyle
                promise.resolve(buildStyleMap(cm.isEnabled, style, cm.fontScale))
            } catch (e: Exception) {
                promise.reject("ERR_CAPTION_STYLE", "Failed to read caption style: ${e.message}", e)
            }
        }

        // ── getCaptionLocale ───────────────────────────────────────────────────
        AsyncFunction("getCaptionLocale") { promise: Promise ->
            try {
                val locale: Locale? = captioningManager.locale
                promise.resolve(locale?.toLanguageTag())
            } catch (e: Exception) {
                promise.reject("ERR_CAPTION_LOCALE", "Failed to read caption locale: ${e.message}", e)
            }
        }

        // ── getAllCaptionSettings ──────────────────────────────────────────────
        AsyncFunction("getAllCaptionSettings") { promise: Promise ->
            try {
                val cm = captioningManager
                val style = cm.userStyle
                val map = buildStyleMap(cm.isEnabled, style, cm.fontScale).toMutableMap()
                map["locale"] = cm.locale?.toLanguageTag()
                promise.resolve(map)
            } catch (e: Exception) {
                promise.reject("ERR_ALL_CAPTIONS", "Failed to read caption settings: ${e.message}", e)
            }
        }
    }

    // ── Helpers ────────────────────────────────────────────────────────────────

    private fun buildStyleMap(
        isEnabled: Boolean,
        style: CaptionStyle,
        fontScaleFloat: Float
    ): Map<String, Any?> {
        return mapOf(
            "isEnabled"       to isEnabled,
            "foregroundColor" to colorToHex(style.foregroundColor, style.hasForegroundColor()),
            "backgroundColor" to colorToHex(style.backgroundColor, style.hasBackgroundColor()),
            "windowColor"     to colorToHex(style.windowColor, style.hasWindowColor()),
            "edgeColor"       to colorToHex(style.edgeColor, true),
            "edgeType"        to edgeTypeToString(style.edgeType),
            "fontScale"       to fontScaleToString(fontScaleFloat),
            "fontScaleRaw"    to fontScaleFloat.toDouble(),
            "fontFamily"      to fontFamilyToString(style.typeface)
        )
    }

    private fun colorToHex(color: Int, hasColor: Boolean): String? {
        if (!hasColor) return null
        return String.format("#%08X", color)
    }

    private fun edgeTypeToString(edgeType: Int): String {
        return when (edgeType) {
            CaptionStyle.EDGE_TYPE_NONE        -> "NONE"
            CaptionStyle.EDGE_TYPE_OUTLINE     -> "OUTLINE"
            CaptionStyle.EDGE_TYPE_DROP_SHADOW -> "DROP_SHADOW"
            CaptionStyle.EDGE_TYPE_RAISED      -> "RAISED"
            CaptionStyle.EDGE_TYPE_DEPRESSED   -> "DEPRESSED"
            else                               -> "UNKNOWN"
        }
    }

    private fun fontScaleToString(scale: Float): String {
        return when {
            scale <= 0.25f -> "VERY_SMALL"
            scale <= 0.5f  -> "SMALL"
            scale <= 1.0f  -> "NORMAL"
            scale <= 1.5f  -> "LARGE"
            scale <= 2.0f  -> "VERY_LARGE"
            else           -> "UNKNOWN"
        }
    }

    private fun fontFamilyToString(typeface: android.graphics.Typeface?): String {
        if (typeface == null) return "DEFAULT"
        // CaptioningManager exposes typeface names via reflection or known patterns.
        // We map based on the toString() representation of the CaptionStyle typeface.
        val name = typeface.toString().lowercase()
        return when {
            name.contains("mono") && name.contains("serif")      -> "MONOSPACED_SERIF"
            name.contains("serif")                               -> "PROPORTIONAL_SERIF"
            name.contains("mono") && !name.contains("serif")     -> "MONOSPACED_SANS_SERIF"
            name.contains("casual")                              -> "CASUAL"
            name.contains("cursive")                             -> "CURSIVE"
            name.contains("smallcap") || name.contains("small_cap") -> "SMALL_CAPITALS"
            name.contains("sans")                                -> "PROPORTIONAL_SANS_SERIF"
            else                                                 -> "DEFAULT"
        }
    }
}

// apps/web/src/shared/config/theme.ts
// Design tokens from docs/DESIGN.md — "Orden Production System"
import { LightTheme, DarkTheme } from "baseui";

const INTER =
  "var(--font-inter), Inter, -apple-system, BlinkMacSystemFont, sans-serif";
const MONO = "var(--font-mono), 'JetBrains Mono', 'Fira Code', monospace";

// ─── Colors ──────────────────────────────────────────────────────────────────
const customSemanticColors = {
  // Primary action (Action Blue)
  buttonPrimaryFill: "#0052ff", // primary-container
  buttonPrimaryHover: "#003ec7", // primary
  buttonPrimaryActive: "#0038b6", // on-primary-fixed-variant

  // App shell & surfaces
  backgroundPrimary: "#f7f9fb", // background / surface — page shell
  backgroundSecondary: "#f2f4f6", // surface-container-low — hover rows, panels
  backgroundTertiary: "#eceef0", // surface-container — chips, inner sections

  // Text
  contentPrimary: "#191c1e", // on-surface
  contentSecondary: "#434656", // on-surface-variant
  contentTertiary: "#737688", // outline

  // Dark inverse surfaces (sidebar, drawer headers)
  backgroundInversePrimary: "#2d3133", // inverse-surface
  contentInversePrimary: "#eff1f3", // inverse-on-surface

  // Borders
  borderOpaque: "#c3c5d9", // outline-variant
  borderSelected: "#003ec7", // primary — focus rings, selected state

  // Semantic states
  backgroundPositive: "#d1fae5",
  backgroundNegative: "#ffdad6", // error-container
  backgroundWarning: "#fef3c7",
  contentPositive: "#065f46",
  contentNegative: "#93000a", // on-error-container
  contentWarning: "#92400e",
  borderPositive: "#00a344",
  borderNegative: "#ba1a1a", // error
  borderWarning: "#d97706",
};

// ─── Typography ──────────────────────────────────────────────────────────────
const customTypography = {
  // display-lg
  HeadingLarge: {
    fontFamily: INTER,
    fontWeight: 700,
    fontSize: "36px",
    lineHeight: "44px",
    letterSpacing: "-0.02em",
  },
  // headline-md
  HeadingMedium: {
    fontFamily: INTER,
    fontWeight: 600,
    fontSize: "24px",
    lineHeight: "32px",
    letterSpacing: "-0.01em",
  },
  // headline-sm
  HeadingSmall: {
    fontFamily: INTER,
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "28px",
  },
  // body-lg
  ParagraphLarge: {
    fontFamily: INTER,
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
  },
  // body-md
  ParagraphMedium: {
    fontFamily: INTER,
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "20px",
  },
  // body-sm
  ParagraphSmall: {
    fontFamily: INTER,
    fontWeight: 400,
    fontSize: "13px",
    lineHeight: "18px",
  },
  // label-md — used for table headers, form labels
  LabelLarge: {
    fontFamily: INTER,
    fontWeight: 600,
    fontSize: "16px",
    lineHeight: "24px",
  },
  LabelMedium: {
    fontFamily: INTER,
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "16px",
    letterSpacing: "0.05em",
  },
  LabelSmall: {
    fontFamily: INTER,
    fontWeight: 400,
    fontSize: "13px",
    lineHeight: "18px",
  },
  // data-mono — order numbers, IDs, measurements
  MonoParagraphMedium: {
    fontFamily: MONO,
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "20px",
  },
};

// ─── Theme export ─────────────────────────────────────────────────────────────
export const CustomLightTheme = {
  ...LightTheme,
  colors: {
    ...LightTheme.colors,
    ...customSemanticColors,
  },
  typography: {
    ...LightTheme.typography,
    ...customTypography,
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    ...customSemanticColors,
  },
  typography: {
    ...DarkTheme.typography,
    ...customTypography,
  },
};

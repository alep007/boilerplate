// apps/web/src/shared/config/theme.ts
import { LightTheme, DarkTheme } from "baseui";

// 1. COLORES SEMÁNTICOS (Lo que realmente leen los componentes)
const customSemanticColors = {
  // Tu color corporativo para botones y acciones principales
  buttonPrimaryFill: "#276EF1",
  buttonPrimaryHover: "#1d52b8",
  buttonPrimaryActive: "#164094",

  // Colores para estados (Verificados, Rechazados, etc.)
  backgroundPositive: "#00A344",
  backgroundNegative: "#E11900",
  backgroundWarning: "#FFC043",

  // Mapeamos los colores de tu Sidebar para que vivan en el tema
  backgroundInversePrimary: "#2192e3", // El fondo oscuro de tu panel
  contentInversePrimary: "#ffffff", // El texto blanco de tu panel
};

// 2. LINEAMIENTOS DE TIPOGRAFÍA
const customTypography = {
  HeadingLarge: {
    fontFamily: "var(--font-neuton), serif",
    fontWeight: 600,
    fontSize: "36px",
    lineHeight: "44px",
  },
  HeadingMedium: {
    fontFamily: "var(--font-neuton), serif",
    fontWeight: 400,
    fontSize: "24px",
    lineHeight: "32px",
  },
  HeadingSmall: {
    fontFamily: "var(--font-neuton), serif",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "28px",
  },
  ParagraphMedium: {
    fontFamily: "var(--font-neuton), serif",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
  },
  LabelLarge: {
    fontFamily: "var(--font-neuton), serif",
    fontWeight: 600,
    fontSize: "16px",
    letterSpacing: "0.5px",
  },
};

// 3. FUSIÓN DIRECTA (Evita errores de firmas de funciones)
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

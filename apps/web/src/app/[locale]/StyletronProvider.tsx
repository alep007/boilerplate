// apps/web/src/app/[locale]/StyletronProvider.tsx
"use client";

import { useState, createContext, useMemo } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { Provider as StyletronReactProvider } from "styletron-react";
import { Client, Server } from "styletron-engine-atomic";
import { BaseProvider, Theme } from "baseui";
import { CustomLightTheme, CustomDarkTheme } from "@/shared/config/theme";
import { useUserStore } from "@/entities/user/model/store"; // 1. Importamos tu store de Zustand

export const ThemeContext = createContext({
  themeMode: "light",
  toggleTheme: () => {},
});

export default function StyletronProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");

  // 2. Escuchamos el color principal del usuario desde Zustand
  const mainColor = useUserStore((state) => state.user?.mainColor);

  const [engine] = useState(() => {
    if (typeof window === "undefined") return new Server();
    return new Client();
  });

  useServerInsertedHTML(() => {
    if (typeof window === "undefined") {
      const stylesheets = (engine as Server).getStylesheets() || [];
      return (
        <>
          {stylesheets.map((sheet, i) => (
            <style
              key={i}
              className="_styletron_hydrate_"
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs["data-hydrate"]}
            />
          ))}
        </>
      );
    }
  });

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // 3. Generamos el tema base (Claro u Oscuro)
  const baseTheme = themeMode === "light" ? CustomLightTheme : CustomDarkTheme;

  // 4. Inyectamos dinámicamente el color del usuario si existe
  const dynamicTheme = useMemo(() => {
    if (!mainColor) return baseTheme;

    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        // Sobrescribimos el color de la marca y los estados de los botones principales
        buttonPrimaryFill: mainColor,
        buttonPrimaryHover: mainColor, // Podrías aplicar una función de oscurecimiento aquí si lo deseas
        buttonPrimaryActive: mainColor,
      },
    } as Theme;
  }, [baseTheme, mainColor]);

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <StyletronReactProvider value={engine}>
        {/* 5. Pasamos el tema dinámico al proveedor de Base Web */}
        <BaseProvider theme={dynamicTheme}>
          <div
            style={{
              backgroundColor: dynamicTheme.colors.backgroundPrimary,
              color: dynamicTheme.colors.contentPrimary,
              minHeight: "100vh",
            }}
          >
            {children}
          </div>
        </BaseProvider>
      </StyletronReactProvider>
    </ThemeContext.Provider>
  );
}

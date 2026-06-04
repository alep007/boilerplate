// apps/web/src/app/[locale]/StyletronProvider.tsx
"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { Provider as StyletronReactProvider } from "styletron-react";
import { Client, Server } from "styletron-engine-atomic";
import { LightTheme, BaseProvider } from "baseui";

export default function StyletronProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Aseguramos que el motor sea una instancia única por sesión de usuario
  const [engine] = useState(() => {
    if (typeof window === "undefined") {
      return new Server();
    }
    return new Client();
  });

  // Inyectamos los estilos en el HTML del servidor antes de enviarlo al cliente
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

  return (
    <StyletronReactProvider value={engine}>
      {/* BaseProvider es OBLIGATORIO para que los inputs y botones tengan estilo */}
      <BaseProvider theme={LightTheme}>{children}</BaseProvider>
    </StyletronReactProvider>
  );
}

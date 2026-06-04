// apps/web/app/StyletronProvider.tsx
"use client";

import { useState } from "react";
import { useServerInsertedHTML } from "next/navigation";
import { Server, Client } from "styletron-engine-atomic";
import { Provider as StyletronReactProvider } from "styletron-react";
import { LightTheme, BaseProvider } from "baseui";

export default function StyletronProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [engine] = useState(() =>
    typeof window === "undefined" ? new Server() : new Client(),
  );

  useServerInsertedHTML(() => {
    if (typeof window === "undefined") {
      const serverEngine = engine as Server;
      const stylesheets = serverEngine.getStylesheets();
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
      <BaseProvider theme={LightTheme}>{children}</BaseProvider>
    </StyletronReactProvider>
  );
}

"use client";

import { useStyletron } from "baseui";
import { HeadingLarge, ParagraphMedium } from "baseui/typography";

export default function UsersPage() {
  const [css, theme] = useStyletron();

  return (
    <div>
      <HeadingLarge color={theme.colors.contentPrimary}>
        Bienvenido a usuariosssss
      </HeadingLarge>
      <ParagraphMedium color={theme.colors.contentSecondary}>
        Si colapsas el panel lateral, verás cómo este contenido se ajusta
        suavemente ocupando todo el espacio disponible en la pantalla.
      </ParagraphMedium>
    </div>
  );
}

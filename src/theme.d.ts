import "@mui/material/styles";

// Extiende la paleta del tema para incluir 'customColors'
declare module "@mui/material/styles" {
  // Extiende Theme para incluir la paleta extendida
  interface Theme {
    palette: Palette;
  }

  interface ThemeOptions {
    palette?: PaletteOptions;
  }
  interface Palette {
    customColors: {
      yellow: string;
      blue: string;
      red: string;
      orange: string;
      green: string;
    };
  }

  interface PaletteOptions {
    customColors?: {
      yellow?: string;
      blue?: string;
      red?: string;
      orange?: string;
      green?: string;
    };
  }

}


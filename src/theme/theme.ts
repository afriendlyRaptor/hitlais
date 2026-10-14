import { createTheme, type PaletteOptions } from '@mui/material/styles';

// created with: https://theme-genie.com/mui-theme-generator/?preset=slate

const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: { main: '#3742F5', contrastText: '#f3f5fd' },
  secondary: { main: '#979C98', contrastText: '#f5f4fb' },
  success: { main: '#009843', contrastText: '#ecf9ee' },
  warning: { main: '#da9600', contrastText: '#211300' },
  error: { main: '#df2225', contrastText: '#fff0ee' },
  info: { main: '#0081d0', contrastText: '#eaf7ff' },
  background: {
    // Page background the app actually rendered before the Tailwind layer was
    // removed (theme-genie value was '#f9fafc').
    default: '#ffffff',
    paper: '#f0f2f5',
  },
  text: { primary: '#0a0f1a', secondary: '#545861' },
  divider: '#e0e3e8',
};

const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: { main: '#3742F5', contrastText: '#0c0d12' },
  secondary: { main: '#979C98', contrastText: '#0d0c11' },
  success: { main: '#009843', contrastText: '#071009' },
  warning: { main: '#da9600', contrastText: '#1c0f00' },
  error: { main: '#df2225', contrastText: '#150a09' },
  info: { main: '#0081d0', contrastText: '#060e15' },
  background: {
    // Same as above (theme-genie value was '#0d0d0f').
    default: '#020817',
    paper: '#050607',
  },
  text: { primary: '#d6deef', secondary: '#bfc4ce' },
  divider: '#010203',
};

function buildTheme(palette: PaletteOptions) {
  return createTheme({
    palette,
    spacing: 8,
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { fontFeatureSettings: "'rlig' 1, 'calt' 1" },
        },
      },
    },
  });
}

export const lightTheme = buildTheme(lightPalette);
export const darkTheme = buildTheme(darkPalette);

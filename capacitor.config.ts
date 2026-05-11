import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.mydrivingdiary",
  appName: "My Driving Diary",
  // Capacitor copies the contents of this folder into the native app.
  // For a production native build, run a static export of the web app
  // (see CAPACITOR.md) so this folder contains an index.html.
  webDir: "dist",
  bundledWebRuntime: false,
  server: {
    // Hot-reload from the Lovable preview during development.
    // Comment out the `url` line before producing a release build so the
    // app loads the bundled offline assets instead of the remote preview.
    url: "https://c04fc87f-a964-4502-991e-bfc964851fdc.lovableproject.com?forceHideBadge=true",
    cleartext: true,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: true,
  },
  ios: {
    contentInset: "always",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: "#0F172A",
      androidSplashResourceName: "splash",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#0F172A",
    },
  },
};

export default config;

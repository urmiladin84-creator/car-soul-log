import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.mydrivingdiary",
  appName: "My Driving Diary",
  webDir: "www",
  bundledWebRuntime: false,
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

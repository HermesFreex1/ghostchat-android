import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ghostchat.app',
  appName: 'GhostChat',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;

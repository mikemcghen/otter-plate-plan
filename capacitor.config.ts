import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.371437c4ad3d4c079282c3fa966708a4',
  appName: 'otter-plate-plan',
  webDir: 'dist',
  server: {
    url: 'https://371437c4-ad3d-4c07-9282-c3fa966708a4.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B5CF6',
      showSpinner: false,
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#8B5CF6',
    },
  },
};

export default config;

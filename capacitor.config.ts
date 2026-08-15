import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.titan.app',
  appName: 'Titan',
  webDir: 'dist',
  // Routes fetch/XHR through native code instead of the WebView's fetch,
  // so calls to provider APIs aren't subject to browser CORS restrictions.
  // See docs/ARCHITECTURE.md ("Why no backend...").
  plugins: {
    CapacitorHttp: {
      enabled: true
    }
  }
};

export default config;

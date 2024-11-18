import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecdasistencia.davidgdev',
  appName: 'ECDAsistencia',
  webDir: 'www',
  plugins: { //desde aquí hacia abajo se agrega para el splash
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: true,
      backgroundColor: "#343434",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#999999",
      splashFullScreen: false,
      splashImmersive: false,
      layoutName: "launch_screen",
      useDialog: false,
    },
  },
};

export default config;

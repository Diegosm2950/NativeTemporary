import "dotenv/config";

export default {
  expo: {
    name: "FMRU App",
    slug: "tu-app",
    version: "1.0.0",
    extra: {
      EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
    },
  },
};

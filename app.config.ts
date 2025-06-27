import "dotenv/config";

export default {
  expo: {
    name: "FMRU App",
    slug: "tu-app",
    version: "1.0.0",
    android: {
      package: "com.darkvenom.fmruapp"
    },
    extra: {
      EXPO_PUBLIC_API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL,
      eas: {
        projectId: "d256492f-2efe-4e7f-9d8c-493a8df249d2"
      }
    },
  },
};

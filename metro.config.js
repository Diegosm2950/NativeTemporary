const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Habilitar require.context para Expo Router
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true
};

// Deshabilitar Fabric completamente
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

module.exports = config;

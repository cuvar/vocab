// Learn more: https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const path = require("path");

module.exports = withNativeWind(getDefaultConfig(__dirname), {
  input: "./src/styles.css",
  configPath: "./tailwind.config.ts",
});


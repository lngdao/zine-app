const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withMonicon } = require('@monicon/metro');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */

const config = {
  // ISSUES: https://github.com/goatandsheep/react-native-dotenv/issues/422
  cacheVersion: process.env.APP_ENV,
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
  },
};

const newConfig = mergeConfig(defaultConfig, config);

const configWithMonicon = withMonicon(newConfig, {
  collections: ['lucide', 'fe', 'iconamoon', 'ri', 'ph', 'nrk', 'ic'],
});

module.exports = configWithMonicon;

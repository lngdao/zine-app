module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          '@': './src',
          'moti/skeleton': 'moti/skeleton/react-native-linear-gradient',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        safe: false,
        allowUndefined: true,
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

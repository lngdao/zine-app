import Reactotron from 'reactotron-react-native';

Reactotron.configure()
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate|generate_204|HEAD/,
    },
  })
  .connect();

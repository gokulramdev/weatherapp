import React from 'react';
import { Provider } from 'react-redux';
import store from './src/redux/store.ts';
import WeatherScreen from './src/screens/WeatherScreen';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <WeatherScreen />
    </Provider>
  );
};

export default App;

import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Renderer from './Renderer';
import HomePage, { SAVED_URL_KEY } from './HomePage';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SAVED_URL_KEY)
      .then(setSavedUrl)
      .finally(() => setLoading(false));
  }, []);

  const handleReset = async () => {
    await AsyncStorage.removeItem(SAVED_URL_KEY);
    setSavedUrl(null);
  };

  return (
    <ThemeProvider value={DefaultTheme}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }} edges={['top', 'left', 'right']}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#6366f1" />
          </View>
        ) : savedUrl ? (
          <Renderer url={savedUrl} onReset={handleReset} />
        ) : (
          <HomePage onUrlSaved={setSavedUrl} />
        )}
        <StatusBar style="dark" />
      </SafeAreaView>
    </ThemeProvider>
  );
}

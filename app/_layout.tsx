import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Renderer from './Renderer';

export default function RootLayout() {

  return (
    <>
        <ThemeProvider value={DefaultTheme}>
          {/* <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack> */}
          <SafeAreaView style={{ flex: 1 }}>
            <Renderer/>
          </SafeAreaView>
        </ThemeProvider>
    </>
  );
}
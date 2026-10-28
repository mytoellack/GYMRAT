import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/navigation';
import { cerrarSesion } from '../services/Backend';

export function useManejarError() {
  const navigation = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  return useCallback(async (e: any) => {
    if (e.status === 401) {
      await cerrarSesion();
      return navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }
    Alert.alert('Error', e.message);
  }, [navigation]);
}
import { useEffect, useState } from 'react';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

const useSecureStorage = (storageName: string) => {
  const [secureStorage, setSecureStorage] = useState<SecureStorageObject | null>(null);

  useEffect(() => {
    const initializeSecureStorage = async () => {
      try {
        const storage = await SecureStorage.create(storageName);
        setSecureStorage(storage);
      } catch (error) {
        console.error('Error initializing secure storage:', error);
      }
    };

    initializeSecureStorage();
  }, [storageName]);

  const setItem = async (key: string, value: string): Promise<void> => {
    if (!secureStorage) return;
    try {
      await secureStorage.set(key, value);
    } catch (error) {
      console.error('Error setting item:', error);
    }
  };

  const getItem = async (key: string): Promise<string | null> => {
    if (!secureStorage) return null;
    try {
      const value = await secureStorage.get(key);
      return value;
    } catch (error) {
      console.error('Error getting item:', error);
      return null;
    }
  };

  const removeItem = async (key: string): Promise<void> => {
    if (!secureStorage) return;
    try {
      await secureStorage.remove(key);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return { setItem, getItem, removeItem };
};

export default useSecureStorage;

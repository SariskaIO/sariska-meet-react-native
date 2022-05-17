import React, {useEffect, useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useOnlineStatus() {
  const [online, setOnline] = useState(window.navigator.onLine);
  useEffect(() => {
    function handleOnline() {
      setOnline(true);
    }
    function handleOffline() {
      setOnline(false);
    }
    const updateNetwork = NetInfo.addEventListener(state => {
      state.isConnected ? handleOnline() : handleOffline();
    });
    updateNetwork();
    const destroy = NetInfo.addEventListener(state => {
      state.isConnected ? updateNetwork() : updateNetwork();
    });
    return () => {
      destroy();
    };
  }, []);
  return online;
}

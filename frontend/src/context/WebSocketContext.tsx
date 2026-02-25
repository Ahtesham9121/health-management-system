import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { webSocketService } from '../services/websocket';

interface WebSocketContextType {
  isConnected: boolean;
  subscribe: (topic: string, callback: (data: any) => void) => any;
  unsubscribe: (topic: string) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    webSocketService.connect(
      () => setIsConnected(true),
      (error) => console.error('WebSocket error:', error)
    );

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  const subscribe = (topic: string, callback: (data: any) => void) => {
    if (isConnected) {
      return webSocketService.subscribe(topic, callback);
    }
    return null;
  };

  const unsubscribe = (topic: string) => {
    webSocketService.unsubscribe(topic);
  };

  return (
    <WebSocketContext.Provider value={{ isConnected, subscribe, unsubscribe }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

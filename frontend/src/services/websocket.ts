import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
  private client: Client | null = null;
  private connected: boolean = false;
  private subscriptions: Map<string, any> = new Map();

  connect(onConnect: () => void, onError: (error: any) => void) {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => {
        console.log(str);
      },
      onConnect: () => {
        this.connected = true;
        onConnect();
        console.log('Connected to WebSocket');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
        onError(frame);
      },
    });

    this.client.activate();
  }

  disconnect() {
    if (this.client) {
      this.client.deactivate();
      this.connected = false;
    }
  }

  subscribe(topic: string, callback: (message: any) => void) {
    if (this.client && this.connected) {
      const subscription = this.client.subscribe(topic, (message) => {
        callback(JSON.parse(message.body));
      });
      this.subscriptions.set(topic, subscription);
      return subscription;
    } else {
      console.warn('WebSocket not connected. Cannot subscribe to', topic);
      return null;
    }
  }

  unsubscribe(topic: string) {
    const subscription = this.subscriptions.get(topic);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(topic);
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const webSocketService = new WebSocketService();

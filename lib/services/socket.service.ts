import { io, Socket } from 'socket.io-client';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL;

// Mirror of the Angular SocketService API (initSocket, connect, joinConversation, etc.)
class SocketService {
  socket: Socket | null = null;
  private messageCallbacks: Array<(payload: any) => void> = [];
  private activeUsersCallbacks: Array<(u: any) => void> = [];

  initSocket(accessToken?: string) {
    try {
      const token = accessToken ?? (() => {
        try { return localStorage.getItem('access-token') ?? localStorage.getItem('accessToken') ?? undefined; } catch (e) { return undefined; }
      })();

      // In browser environments prefer a URL from env but fall back to the current origin.
      const url = (WS_URL as string) || (typeof window !== 'undefined' ? window.location.origin : '');
      if (!url) {
        console.warn('SocketService.initSocket: no WS URL available (NEXT_PUBLIC_WS_URL not set and window.location not available)');
        return;
      }

      // Use polling + websocket so the client can connect even when the websocket upgrade fails.
      // Do not set extraHeaders in browser (not supported).
      this.socket = io(url, {
        auth: token ? { 'access-token': token } : undefined,
        transports: ['polling', 'websocket'],
        reconnection: true,
        reconnectionAttempts: Infinity,
        reconnectionDelay: 1000,
        path: '/socket.io'
      });

      this.socket.on('connect', () => { /* no-op to match Angular connect() behavior */ });
    } catch (e) {
      console.error('initSocket error', e);
    }
  }

  connect() {
    if (!this.socket) this.initSocket();
    this.socket?.on('connect', () => {});
  }

  // Join a conversation room
  joinConversation(conversationId: string) {
    if (!this.socket) return;
    this.socket.emit('joinConversation', conversationId);
  }

  leaveConversation(conversationId: string) {
    if (!this.socket) return;
    this.socket.emit('leaveConversation', conversationId);
  }

  sendMessage(message: any) {
    if (!this.socket) return;
    this.socket.emit('message', message);
  }

  onMessage(callback: (payload: any) => void) {
    this.messageCallbacks.push(callback);
    if (this.socket) this.initListenerChat();
  }

  initListenerChat() {
    if (!this.socket) return;
    this.socket.on('message', (payload: any) => {
      this.messageCallbacks.forEach((cb) => {
        try { cb(payload); } catch (e) { console.error('message callback error', e); }
      });
    });
  }

  requestStatuses(titleSearchId: number): void {
    if (!this.socket) return;
    this.socket.emit('smartSearchStatus', { titleSearchId });
  }

  onStatuses(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('smartSearchStatus', callback);
  }

  onGenerateComparisonReport(callback: (data: any) => void) {
    if (!this.socket) return;
    this.socket.on('generateComparisonReport', callback);
  }

  onNotifications(callback: (message: any) => void) {
    if (!this.socket) return;
    this.socket.on('notification', callback);
  }

  onUnSeenCount(callback: (res: any) => void) {
    if (!this.socket) return;
    this.socket.on('unSeenCount', callback);
  }

  getActiveUsers() {
    if (!this.socket) return;
    this.socket.on('getActiveUsers', (user: any) => {
      this.activeUsersCallbacks.forEach((cb) => {
        try { cb(user); } catch (e) { console.error('activeUsers callback error', e); }
      });
    });
  }

  onActiveUsers(callback: (user: any) => void) {
    this.activeUsersCallbacks.push(callback);
    if (this.socket) this.getActiveUsers();
  }

  disconnect() {
    try { this.socket?.disconnect(); } catch (e) { console.error('disconnect error', e); }
  }

  emitGenerateComparisonReport(payload: any) {
    if (!this.socket) return;
    this.socket.emit('generateComparisonReport', payload);
  }

  offGenerateComparisonReport(listener: (data: any) => void) {
    this.socket?.off('generateComparisonReport', listener);
  }
}

const socketService = new SocketService();

export default socketService;
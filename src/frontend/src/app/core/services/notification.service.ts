import { Injectable, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, forkJoin, retry, timer } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  relatedEntityId?: string;
  createdAt: Date | string;
}

export type NotificationConnectionState = 'disconnected' | 'loading' | 'connecting' | 'connected' | 'reconnecting';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection?: signalR.HubConnection;
  private session = 0;

  private readonly notificationsSubject = new BehaviorSubject<Notification[]>([]);
  readonly notifications$ = this.notificationsSubject.asObservable();

  private readonly unreadCountSubject = new BehaviorSubject<number>(0);
  readonly unreadCount$ = this.unreadCountSubject.asObservable();

  private readonly connectionStateSubject = new BehaviorSubject<NotificationConnectionState>('disconnected');
  readonly connectionState$ = this.connectionStateSubject.asObservable();

  private readonly errorSubject = new BehaviorSubject<string | null>(null);
  readonly error$ = this.errorSubject.asObservable();

  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient, private authService: AuthService) {
    effect(() => {
      const user = this.authService.user();
      const session = ++this.session;
      if (user) {
        void this.initialize(session);
      } else {
        void this.stopConnection();
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
        this.errorSubject.next(null);
      }
    });
  }

  private async initialize(session: number): Promise<void> {
    await this.stopConnection();
    this.connectionStateSubject.next('loading');
    await this.backfill(session);
    if (session !== this.session || !this.authService.user()) return;
    await this.startConnection(session);
  }

  private async backfill(session = this.session): Promise<void> {
    try {
      const result = await firstValueFrom(forkJoin({
        notifications: this.http.get<Notification[]>(`${this.apiUrl}?limit=20`),
        unread: this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`)
      }).pipe(retry({ count: 2, delay: (_, attempt) => timer(attempt * 500) })));

      if (session !== this.session) return;
      this.mergeNotifications(result.notifications);
      const locallyUnread = this.notificationsSubject.value.filter(item => !item.isRead).length;
      this.unreadCountSubject.next(Math.max(0, result.unread.count, locallyUnread));
      this.errorSubject.next(null);
    } catch {
      if (session === this.session) {
        this.errorSubject.next('Notifications could not be refreshed after 3 attempts.');
      }
    }
  }

  private async startConnection(session: number): Promise<void> {
    const token = this.authService.getToken();
    if (!token) {
      this.connectionStateSubject.next('disconnected');
      return;
    }

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/notifications`, {
        accessTokenFactory: () => this.authService.getToken() ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .build();
    this.hubConnection = connection;

    connection.on('ReceiveNotification', (notification: Notification) => {
      const isNew = !this.notificationsSubject.value.some(item => item.id === notification.id);
      this.mergeNotifications([notification]);
      if (isNew && !notification.isRead) {
        this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
      }
    });
    connection.onreconnecting(() => {
      this.connectionStateSubject.next('reconnecting');
      this.errorSubject.next('Notification connection interrupted; reconnecting.');
    });
    connection.onreconnected(() => {
      this.connectionStateSubject.next('connected');
      void this.backfill(session);
    });
    connection.onclose(() => {
      if (session === this.session) {
        this.connectionStateSubject.next('disconnected');
        this.errorSubject.next('Live notifications are unavailable after 5 reconnect attempts.');
      }
    });

    this.connectionStateSubject.next('connecting');
    try {
      await connection.start();
      if (session !== this.session) {
        await connection.stop();
        return;
      }
      this.connectionStateSubject.next('connected');
      this.errorSubject.next(null);
      await this.backfill(session);
    } catch {
      this.connectionStateSubject.next('disconnected');
      this.errorSubject.next('Live notifications could not connect. Refresh to retry.');
    }
  }

  private mergeNotifications(incoming: Notification[]): void {
    const byId = new Map(this.notificationsSubject.value.map(item => [item.id, item]));
    for (const notification of incoming) {
      byId.set(notification.id, { ...byId.get(notification.id), ...notification });
    }

    const merged = [...byId.values()]
      .sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime())
      .slice(0, 100);
    this.notificationsSubject.next(merged);
  }

  private async stopConnection(): Promise<void> {
    const connection = this.hubConnection;
    this.hubConnection = undefined;
    this.connectionStateSubject.next('disconnected');
    if (connection) await connection.stop();
  }

  markAsRead(id: string): void {
    this.http.put(`${this.apiUrl}/${id}/read`, {}).pipe(
      retry({ count: 2, delay: (_, attempt) => timer(attempt * 500) })
    ).subscribe({
      next: () => {
        let changed = false;
        const updated = this.notificationsSubject.value.map(notification => {
          if (notification.id !== id || notification.isRead) return notification;
          changed = true;
          return { ...notification, isRead: true };
        });
        if (changed) {
          this.notificationsSubject.next(updated);
          this.unreadCountSubject.next(Math.max(0, this.unreadCountSubject.value - 1));
        }
        this.errorSubject.next(null);
      },
      error: () => this.errorSubject.next('Notification could not be marked as read after 3 attempts.')
    });
  }
}

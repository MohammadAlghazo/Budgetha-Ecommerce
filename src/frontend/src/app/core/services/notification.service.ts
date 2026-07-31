import { Injectable, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
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
  createdAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection | undefined;
  
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  
  private unreadCountSubject = new BehaviorSubject<number>(0);
  public unreadCount$ = this.unreadCountSubject.asObservable();

  private readonly apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient, private authService: AuthService) {
    effect(() => {
      const user = this.authService.user();
      if (user) {
        this.loadInitialData();
        this.startConnection();
      } else {
        this.stopConnection();
        this.notificationsSubject.next([]);
        this.unreadCountSubject.next(0);
      }
    });
  }

  private loadInitialData() {
    this.http.get<Notification[]>(`${this.apiUrl}?limit=20`).subscribe(notifications => {
      this.notificationsSubject.next(notifications);
    });

    this.http.get<{ count: number }>(`${this.apiUrl}/unread-count`).subscribe(res => {
      this.unreadCountSubject.next(res.count);
    });
  }

  private startConnection() {
    const token = this.authService.getToken();
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.hubUrl}/notifications`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('Notification Hub Connection started'))
      .catch(err => console.error('Error while starting connection: ' + err));

    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      // Add new notification to the top of the list
      const current = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...current]);
      
      // Increment unread count
      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
      
      // You can also add Toastr or Snack-bar notification here
    });
  }

  private stopConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop();
      this.hubConnection = undefined;
    }
  }

  public markAsRead(id: string) {
    return this.http.put(`${this.apiUrl}/${id}/read`, {}).subscribe(() => {
      const current = this.notificationsSubject.value;
      const updated = current.map(n => {
        if (n.id === id && !n.isRead) {
          n.isRead = true;
          this.unreadCountSubject.next(Math.max(0, this.unreadCountSubject.value - 1));
        }
        return n;
      });
      this.notificationsSubject.next(updated);
    });
  }
}

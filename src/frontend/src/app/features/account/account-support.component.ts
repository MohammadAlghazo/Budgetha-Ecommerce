import { Component, inject, signal, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-account-support',
  imports: [DatePipe, FormsModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-lg font-bold text-slate-900">Support Tickets</h2>
          <p class="text-sm text-slate-400 mt-0.5">Need help? Open a ticket to reach our support team.</p>
        </div>
        <button (click)="isCreating.set(true)" class="btn-primary py-2 px-4 text-sm">New Ticket</button>
      </div>

      @if (isCreating()) {
        <div class="card p-6 border-indigo-100">
          <h3 class="text-base font-bold text-slate-900 mb-4">Create a New Ticket</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Subject</label>
              <input type="text" [(ngModel)]="newSubject" placeholder="Brief description of the issue"
                     class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 text-sm">
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
              <textarea [(ngModel)]="newMessage" rows="4" placeholder="Provide details..."
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none text-sm"></textarea>
            </div>
            <div class="flex gap-3">
              <button (click)="createTicket()" [disabled]="!newSubject || !newMessage" class="btn-primary py-2 px-5 text-sm disabled:opacity-50">Submit</button>
              <button (click)="isCreating.set(false)" class="text-sm font-medium text-slate-500 hover:text-slate-700">Cancel</button>
            </div>
          </div>
        </div>
      }

      <div class="grid gap-4 mt-6">
        @if (tickets().length === 0 && !isCreating()) {
          <div class="card p-12 text-center text-slate-500">
            You don't have any open support tickets.
          </div>
        }
        @for (ticket of tickets(); track ticket.id) {
          <div class="card p-5 cursor-pointer hover:border-indigo-200 transition-colors" (click)="viewTicket(ticket.id)">
            <div class="flex items-center justify-between">
              <h3 class="font-bold text-slate-900">{{ ticket.subject }}</h3>
              <span class="px-2 py-1 rounded text-xs font-semibold"
                    [class.bg-emerald-100]="ticket.status === 'Open'"
                    [class.text-emerald-700]="ticket.status === 'Open'"
                    [class.bg-slate-100]="ticket.status !== 'Open'"
                    [class.text-slate-700]="ticket.status !== 'Open'">
                {{ ticket.status }}
              </span>
            </div>
            <p class="text-xs text-slate-400 mt-2">Opened on {{ ticket.createdAt | date:'MMM d, y' }}</p>
          </div>
        }
      </div>

      <!-- Ticket Details Modal -->
      @if (selectedTicket()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeTicket()"></div>
          
          <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden animate-[toastIn_0.2s_ease-out]">
            <div class="p-5 flex items-center justify-between border-b border-slate-100">
              <h3 class="text-lg font-bold text-slate-900">{{ selectedTicket().subject }}</h3>
              <button (click)="closeTicket()" class="text-slate-400 hover:text-slate-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div class="p-5 overflow-y-auto flex-1 space-y-4 bg-slate-50">
              @for (msg of selectedTicket().messages; track msg.id) {
                <div class="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
                  <div class="flex items-center justify-between mb-2">
                    <span class="font-semibold text-sm text-slate-900">{{ msg.senderName }}</span>
                    <span class="text-xs text-slate-400">{{ msg.sentAt | date:'MMM d, h:mm a' }}</span>
                  </div>
                  <p class="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{{ msg.body }}</p>
                </div>
              }
            </div>
            
            @if (selectedTicket().status !== 'Closed') {
              <div class="p-5 bg-white border-t border-slate-100">
                <textarea [(ngModel)]="replyMessage" rows="3" placeholder="Type your reply..."
                          class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none text-sm mb-3"></textarea>
                <div class="flex justify-end">
                  <button (click)="replyToTicket()" [disabled]="!replyMessage" class="btn-primary py-2 px-6 text-sm disabled:opacity-50">Reply</button>
                </div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  `
})
export class AccountSupportComponent implements OnInit {
  private http = inject(HttpClient);
  private toast = inject(ToastService);

  tickets = signal<any[]>([]);
  isCreating = signal(false);
  newSubject = '';
  newMessage = '';
  
  selectedTicket = signal<any>(null);
  replyMessage = '';

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    this.http.get<any[]>(`${environment.apiUrl}/supporttickets`).subscribe({
      next: (res) => this.tickets.set(res),
      error: () => this.toast.error('Failed to load tickets.')
    });
  }

  createTicket() {
    if (!this.newSubject || !this.newMessage) return;
    
    this.http.post(`${environment.apiUrl}/supporttickets`, {
      subject: this.newSubject,
      message: this.newMessage
    }).subscribe({
      next: () => {
        this.toast.success('Ticket created.');
        this.isCreating.set(false);
        this.newSubject = '';
        this.newMessage = '';
        this.loadTickets();
      },
      error: () => this.toast.error('Failed to create ticket.')
    });
  }

  viewTicket(id: string) {
    this.http.get<any>(`${environment.apiUrl}/supporttickets/${id}`).subscribe({
      next: (res) => {
        this.selectedTicket.set(res);
        this.replyMessage = '';
      },
      error: () => this.toast.error('Failed to load ticket details.')
    });
  }

  closeTicket() {
    this.selectedTicket.set(null);
  }

  replyToTicket() {
    if (!this.replyMessage) return;
    const ticketId = this.selectedTicket().id;
    
    this.http.post(`${environment.apiUrl}/supporttickets/${ticketId}/reply`, {
      message: this.replyMessage
    }).subscribe({
      next: () => {
        this.toast.success('Reply sent.');
        this.viewTicket(ticketId); // Reload to show new message
      },
      error: () => this.toast.error('Failed to send reply.')
    });
  }
}

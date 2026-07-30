import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnnouncementService, Announcement } from '../../core/services/announcement.service';
import { DatePipe } from '@angular/common';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-admin-announcements',
  imports: [ReactiveFormsModule, DatePipe],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-slate-900">Announcements</h1>
        <button type="button" class="btn-primary" (click)="openForm()">Create New</button>
      </div>

      <!-- Form -->
      @if (showForm()) {
        <div class="card p-6 border-violet-200 shadow-md">
          <h2 class="text-lg font-bold mb-4">{{ editingId() ? 'Edit Announcement' : 'New Announcement' }}</h2>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Message *</label>
              <textarea formControlName="message" rows="2" class="input-field" placeholder="E.g. Free shipping on orders over $75..."></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-1">Link URL (Optional)</label>
              <input type="text" formControlName="linkUrl" class="input-field" placeholder="/shop?deals=1" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Start Date (UTC, Optional)</label>
                <input type="datetime-local" formControlName="startDate" class="input-field" />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">End Date (UTC, Optional)</label>
                <input type="datetime-local" formControlName="endDate" class="input-field" />
              </div>
            </div>

            <label class="flex items-center gap-2 mt-2">
              <input type="checkbox" formControlName="isActive" class="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              <span class="text-sm text-slate-700">Is Active</span>
            </label>

            <div class="flex gap-3 justify-end pt-4 border-t border-slate-100">
              <button type="button" class="btn-secondary" (click)="cancelForm()">Cancel</button>
              <button type="submit" class="btn-primary" [disabled]="form.invalid || isSubmitting()">
                {{ isSubmitting() ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      }

      <!-- List -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-slate-600">
            <thead class="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th class="px-6 py-4 font-semibold">Message</th>
                <th class="px-6 py-4 font-semibold">Status</th>
                <th class="px-6 py-4 font-semibold">Start</th>
                <th class="px-6 py-4 font-semibold">End</th>
                <th class="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              @if (isLoading()) {
                <tr>
                  <td colspan="5" class="px-6 py-10 text-center">
                    <div class="flex flex-col items-center justify-center gap-3">
                      <div class="w-8 h-8 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin mx-auto"></div>
                      <p class="text-sm text-slate-500 font-medium">Loading announcements...</p>
                    </div>
                  </td>
                </tr>
              } @else {
              @for (item of announcements(); track item.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <td class="px-6 py-4 font-medium text-slate-900 max-w-[300px] truncate" [title]="item.message">
                    {{ item.message }}
                  </td>
                  <td class="px-6 py-4">
                    @if (item.isActive) {
                      <span class="badge bg-green-100 text-green-700">Active</span>
                    } @else {
                      <span class="badge bg-slate-100 text-slate-600">Inactive</span>
                    }
                  </td>
                  <td class="px-6 py-4">{{ item.startDate ? (item.startDate | date:'short') : '-' }}</td>
                  <td class="px-6 py-4">{{ item.endDate ? (item.endDate | date:'short') : '-' }}</td>
                  <td class="px-6 py-4 text-right">
                    <button type="button" class="text-violet-600 hover:text-violet-900 font-medium mr-4" (click)="edit(item)">Edit</button>
                    <button type="button" class="text-red-600 hover:text-red-900 font-medium" (click)="delete(item.id)">Delete</button>
                  </td>
                </tr>
              }
              @if (announcements().length === 0) {
                <tr>
                  <td colspan="5" class="px-6 py-10 text-center text-slate-500">
                    No announcements found.
                  </td>
                </tr>
              }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>

    @if (confirmAction()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="closeConfirmModal()"></div>
        
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-[toastIn_0.2s_ease-out]">
          <div class="p-6 text-center">
            <div class="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-rose-100 text-rose-600">
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </div>
            
            <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Announcement</h3>
            <p class="text-sm text-slate-500 mb-6">
              Are you sure you want to delete this announcement?<br>This action cannot be undone.
            </p>
            
            <div class="flex items-center gap-3 w-full">
              <button (click)="closeConfirmModal()" class="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors">
                Cancel
              </button>
              <button (click)="executeDelete()" 
                      class="flex-1 px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-xl font-semibold transition-colors shadow-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class AdminAnnouncementsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private announcementService = inject(AnnouncementService);
  private toastService = inject(ToastService);

  announcements = signal<Announcement[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  isSubmitting = signal(false);
  isLoading = signal(true);
  confirmAction = signal<string | null>(null);

  form = this.fb.group({
    message: ['', Validators.required],
    linkUrl: [''],
    isActive: [true],
    startDate: [''],
    endDate: ['']
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.isLoading.set(true);
    this.announcementService.getAll().subscribe({
      next: (data) => {
        this.announcements.set(data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load announcements:', err);
        this.isLoading.set(false);
        this.announcements.set([]);
      }
    });
  }

  openForm() {
    this.form.reset({ isActive: true });
    this.editingId.set(null);
    this.showForm.set(true);
  }

  cancelForm() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  edit(item: Announcement) {
    this.editingId.set(item.id);
    this.form.patchValue({
      message: item.message,
      linkUrl: item.linkUrl,
      isActive: item.isActive,
      startDate: item.startDate ? item.startDate.substring(0, 16) : '', 
      endDate: item.endDate ? item.endDate.substring(0, 16) : ''
    });
    this.showForm.set(true);
  }

  delete(id: string) {
    this.confirmAction.set(id);
  }

  closeConfirmModal() {
    this.confirmAction.set(null);
  }

  executeDelete() {
    const id = this.confirmAction();
    if (!id) return;
    this.closeConfirmModal();

    this.announcementService.delete(id).subscribe({
      next: () => {
        this.toastService.success('Announcement deleted successfully.');
        this.load();
      },
      error: () => this.toastService.error('Failed to delete announcement.')
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    const val = this.form.value;
    const dto = {
      message: val.message!,
      linkUrl: val.linkUrl || undefined,
      isActive: val.isActive!,
      startDate: val.startDate ? new Date(val.startDate).toISOString() : undefined,
      endDate: val.endDate ? new Date(val.endDate).toISOString() : undefined,
    };

    const id = this.editingId();
    if (id) {
      this.announcementService.update(id, { ...dto, id }).subscribe({
        next: () => {
          this.toastService.success('Announcement updated successfully.');
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.toastService.error('Failed to update announcement.');
          this.isSubmitting.set(false);
        }
      });
    } else {
      this.announcementService.create(dto).subscribe({
        next: () => {
          this.toastService.success('Announcement created successfully.');
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => {
          this.toastService.error('Failed to create announcement.');
          this.isSubmitting.set(false);
        }
      });
    }
  }
}

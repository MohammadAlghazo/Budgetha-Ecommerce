import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AnnouncementService, Announcement } from '../../core/services/announcement.service';
import { DatePipe } from '@angular/common';

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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class AdminAnnouncementsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private announcementService = inject(AnnouncementService);

  announcements = signal<Announcement[]>([]);
  showForm = signal(false);
  editingId = signal<string | null>(null);
  isSubmitting = signal(false);

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
    this.announcementService.getAll().subscribe(data => {
      this.announcements.set(data);
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
      startDate: item.startDate ? item.startDate.substring(0, 16) : '', // for datetime-local
      endDate: item.endDate ? item.endDate.substring(0, 16) : ''
    });
    this.showForm.set(true);
  }

  delete(id: string) {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcementService.delete(id).subscribe(() => this.load());
    }
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
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    } else {
      this.announcementService.create(dto).subscribe({
        next: () => {
          this.load();
          this.cancelForm();
          this.isSubmitting.set(false);
        },
        error: () => this.isSubmitting.set(false)
      });
    }
  }
}

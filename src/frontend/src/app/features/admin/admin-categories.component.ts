import { Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/shop.models';
import { ToastService } from '../../core/services/toast.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { DatePipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-admin-categories',
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div class="max-w-7xl mx-auto space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-900 tracking-tight">Categories Management</h2>
          <p class="mt-1 text-sm text-slate-500">
            {{ categories().length }} total categories.
          </p>
        </div>
        <button (click)="openAdd()" *ngIf="!isAdding()"
                class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          Add New Category
        </button>
      </div>

      <!-- Add Category Form -->
      @if (isAdding()) {
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 animate-[slideDown_0.3s_ease-out]">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-slate-900">{{ editId() ? 'Edit Category' : 'Create New Category' }}</h3>
            <button (click)="isAdding.set(false)" class="text-slate-400 hover:text-slate-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Name *</label>
                <input type="text" formControlName="name" placeholder="e.g. Smartphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-medium text-slate-700">Slug *</label>
                <input type="text" formControlName="slug" placeholder="e.g. smartphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>

            <div class="space-y-2">
              <label class="block text-sm font-medium text-slate-700">Image</label>
              
              <div class="flex items-start gap-4">
                @if (imageUrl()) {
                  <div class="w-24 h-24 rounded-xl border border-slate-200 overflow-hidden relative group shrink-0 bg-slate-50">
                    <img [src]="imageUrl()" class="w-full h-full object-cover">
                    <button type="button" (click)="imageUrl.set(null)"
                            class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                } @else {
                  <div class="flex-1 w-full border-2 border-dashed border-slate-200 rounded-xl px-6 py-6 text-center hover:bg-slate-50 transition-colors">
                    <input type="file" id="categoryImage" class="hidden" accept="image/*" (change)="onFileSelected($event)">
                    <label for="categoryImage" class="cursor-pointer flex flex-col items-center">
                      <div class="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      </div>
                      <span class="text-sm font-semibold text-indigo-600">Click to upload</span>
                      <span class="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</span>
                    </label>
                  </div>
                }
              </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button type="button" (click)="isAdding.set(false)"
                      class="px-5 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                Cancel
              </button>
              <button type="submit" [disabled]="form.invalid || isSubmitting()"
                      class="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2">
                @if (isSubmitting()) {
                  <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                } @else {
                  Save Category
                }
              </button>
            </div>
          </form>
        </div>
      }

      <!-- Categories List -->
      @if (isLoading()) {
        <div class="py-12 text-center">
          <div class="flex flex-col items-center justify-center gap-3">
            <div class="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
            <p class="text-sm text-slate-500 font-medium">Loading categories...</p>
          </div>
        </div>
      } @else {
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @for (category of categories(); track category.id) {
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center text-center hover:shadow-md transition-shadow relative group">
            <button (click)="editCategory(category)" class="absolute top-2 right-2 p-2 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            @if (category.image) {
              <img [src]="category.image" class="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-slate-50">
            } @else {
              <div class="w-20 h-20 rounded-full mb-4 ring-4 ring-slate-50 flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600">
                <span class="text-3xl font-bold">{{ category.name[0] }}</span>
              </div>
            }
            <h3 class="text-lg font-bold text-slate-900">{{ category.name }}</h3>
            <p class="text-xs text-slate-400 mt-1 font-mono bg-slate-100 px-2 py-0.5 rounded">{{ category.slug }}</p>
            <p class="text-sm text-slate-500 mt-3">{{ category.productCount }} Products</p>
          </div>
        }
      </div>
      }

    </div>
  `
})
export class AdminCategoriesComponent implements OnInit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);
  private cloudinaryService = inject(CloudinaryService);
  private fb = inject(FormBuilder);

  categories = signal<Category[]>([]);
  isAdding = signal(false);
  isSubmitting = signal(false);
  isLoading = signal(true);
  imageUrl = signal<string | null>(null);
  editId = signal<string | null>(null);

  form = this.fb.group({
    name: ['', Validators.required],
    slug: ['', Validators.required],
  });

  ngOnInit() {
    this.loadCategories();
    
    
    this.form.get('name')?.valueChanges.subscribe(name => {
      if (name && !this.form.get('slug')?.dirty) {
        const slug = name.toLowerCase()
                         .replace(/[^a-z0-9\s-]/g, '')
                         .replace(/\s+/g, '-')
                         .replace(/-+/g, '-');
        this.form.get('slug')?.setValue(slug, { emitEvent: false });
      }
    });
  }

  loadCategories() {
    this.isLoading.set(true);
    this.productService.getCategories().subscribe({
      next: (res) => {
        this.categories.set(res || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load categories:', err);
        this.isLoading.set(false);
        this.categories.set([]);
      }
    });
  }

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.toastService.error('Please upload an image file');
      return;
    }
    
    this.isSubmitting.set(true);
    try {
      const res = await firstValueFrom(this.cloudinaryService.uploadImage(file));
      this.imageUrl.set(res.url);
      this.toastService.success('Image uploaded successfully');
    } catch (err) {
      console.error(err);
      this.toastService.error('Failed to upload image');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  openAdd() {
    this.editId.set(null);
    this.form.reset();
    this.imageUrl.set(null);
    this.isAdding.set(true);
  }

  editCategory(category: Category) {
    this.editId.set(category.id);
    this.form.patchValue({
      name: category.name,
      slug: category.slug
    });
    this.imageUrl.set(category.image || null);
    this.isAdding.set(true);
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isSubmitting.set(true);
    
    if (this.editId()) {
      const data = {
        id: this.editId()!,
        name: this.form.value.name!,
        slug: this.form.value.slug!,
        imageUrl: this.imageUrl() || undefined
      };
      this.productService.updateCategory(this.editId()!, data).subscribe({
        next: () => {
          this.toastService.success('Category updated successfully');
          this.isAdding.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to update category');
        },
        complete: () => this.isSubmitting.set(false)
      });
    } else {
      const data = {
        name: this.form.value.name!,
        slug: this.form.value.slug!,
        imageUrl: this.imageUrl() || undefined
      };
      this.productService.createCategory(data).subscribe({
        next: () => {
          this.toastService.success('Category created successfully');
          this.isAdding.set(false);
          this.loadCategories();
        },
        error: (err) => {
          console.error(err);
          this.toastService.error('Failed to create category');
        },
        complete: () => this.isSubmitting.set(false)
      });
    }
  }
}

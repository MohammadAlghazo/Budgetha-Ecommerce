import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastService } from '../../core/services/toast.service';
import { ProductService } from '../../core/services/product.service';
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { Category } from '../../core/models/shop.models';
import { environment } from '../../../environments/environment';

interface ProductImageState {
  url: string;
  publicId: string | null;
}

@Component({
  selector: 'app-admin-add-product',
  imports: [ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto space-y-6 pb-20">
      <div>
        <h2 class="text-2xl font-bold text-slate-900 tracking-tight">{{ isEditMode() ? 'Edit Product' : 'Add New Product' }}</h2>
        <p class="mt-1 text-sm text-slate-500">
          {{ isEditMode() ? 'Update your product listing details.' : 'Create a new product listing. It will be immediately published to the catalog.' }}
        </p>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 md:p-8 space-y-8">
          
          <!-- Basic Info -->
          <div class="space-y-6">
            <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Basic Information</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="name" class="block text-sm font-semibold text-slate-700">Product Name <span class="text-rose-500">*</span></label>
                <input type="text" id="name" formControlName="name" placeholder="e.g. Wireless Noise-Cancelling Headphones"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400">
              </div>

              <div class="space-y-2">
                <label for="categoryIds" class="block text-sm font-semibold text-slate-700">Categories <span class="text-rose-500">*</span></label>
                <select id="categoryIds" formControlName="categoryIds" multiple
                        class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all h-32">
                  @for (cat of categories(); track cat.id) {
                    <option [value]="cat.id">{{ cat.name }}</option>
                  }
                </select>
                <p class="text-xs text-slate-500 mt-1">Hold Ctrl (or Cmd) to select multiple categories.</p>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="brand" class="block text-sm font-semibold text-slate-700">Brand <span class="text-rose-500">*</span></label>
                <input type="text" id="brand" formControlName="brand" placeholder="e.g. Sony, Samsung, Nike"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400">
              </div>
            </div>

            <div class="space-y-2">
              <label for="description" class="block text-sm font-semibold text-slate-700">Description <span class="text-rose-500">*</span></label>
              <textarea id="description" formControlName="description" rows="4" placeholder="Describe your product in detail..."
                        class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-400 resize-none"></textarea>
            </div>
          </div>

          <!-- Pricing & Inventory -->
          <div class="space-y-6">
            <h3 class="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">Pricing & Inventory</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <label for="price" class="block text-sm font-semibold text-slate-700">Price ($) <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <span class="absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="price" formControlName="price" min="0" step="0.01" placeholder="0.00"
                         class="w-full ps-8 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>

              <div class="space-y-2">
                <label for="originalPrice" class="block text-sm font-semibold text-slate-700">Original Price ($) <span class="text-xs text-slate-500 font-normal">(Optional - for discounts)</span></label>
                <div class="relative">
                  <span class="absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="originalPrice" formControlName="originalPrice" min="0" step="0.01" placeholder="0.00"
                         class="w-full ps-8 pe-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>

              <div class="space-y-2 md:col-span-2">
                <label for="stockQuantity" class="block text-sm font-semibold text-slate-700">Stock Quantity <span class="text-rose-500">*</span></label>
                <input type="number" id="stockQuantity" formControlName="stockQuantity" min="0" placeholder="0"
                       class="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
              </div>
            </div>
          </div>

          <!-- Rentals -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="text-base font-semibold text-slate-900">Rental Options</h3>
            </div>
            
            <div class="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p class="font-semibold text-slate-800 text-sm">Available for Rent?</p>
                <p class="text-xs text-slate-500 mt-0.5">Allow users to rent this item instead of buying.</p>
              </div>
              <button type="button" (click)="toggleRentable()"
                      [class.bg-indigo-600]="form.get('isAvailableForRent')?.value"
                      [class.bg-slate-300]="!form.get('isAvailableForRent')?.value"
                      class="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none">
                <span [class.translate-x-7]="form.get('isAvailableForRent')?.value"
                      [class.translate-x-1]="!form.get('isAvailableForRent')?.value"
                      class="theme-preserve-light absolute top-0.5 w-5 h-5 bg-white rounded-full shadow inline-block transition-transform duration-200"></span>
              </button>
            </div>

            @if (form.get('isAvailableForRent')?.value) {
              <div class="w-full md:w-1/2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <label for="rentalPricePerDay" class="block text-sm font-semibold text-slate-700">Rental Price Per Day ($) <span class="text-rose-500">*</span></label>
                <div class="relative">
                  <span class="absolute start-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" id="rentalPricePerDay" formControlName="rentalPricePerDay" min="0" step="0.01" placeholder="0.00"
                         class="w-full ps-8 pe-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all">
                </div>
              </div>
            }
          </div>

          <!-- Product Images -->
          <div class="space-y-6">
            <div class="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 class="text-base font-semibold text-slate-900">Product Images <span class="text-rose-500">*</span></h3>
              <p class="text-xs font-medium text-slate-500">{{ uploadedImages().length }} uploaded</p>
            </div>
            
            <!-- Upload Area -->
            <div class="relative group">
              <input type="file" multiple (change)="onFileSelected($event)" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" [disabled]="isUploadingImage()">
              <div class="w-full border-2 border-dashed rounded-2xl p-8 text-center transition-all"
                   [class.border-indigo-300]="!isUploadingImage()"
                   [class.bg-indigo-50]="!isUploadingImage()"
                   [class.border-slate-200]="isUploadingImage()"
                   [class.bg-slate-50]="isUploadingImage()"
                   [class.group-hover:border-indigo-400]="!isUploadingImage()"
                   [class.group-hover:bg-indigo-100]="!isUploadingImage()">
                
                @if (isUploadingImage()) {
                  <div class="flex flex-col items-center gap-3">
                    <svg class="animate-spin w-8 h-8 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <p class="text-sm font-semibold text-slate-600">Uploading to Cloudinary...</p>
                  </div>
                } @else {
                  <div class="flex flex-col items-center gap-2">
                    <div class="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mb-2">
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                    </div>
                    <p class="text-sm font-semibold text-indigo-900">Click or drag images here to upload</p>
                    <p class="text-xs text-indigo-500/80">Supports JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                }
              </div>
            </div>

            <!-- Image Gallery -->
            @if (uploadedImages().length > 0) {
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
                @for (img of uploadedImages(); track img; let i = $index) {
                  <div class="group relative aspect-square rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm p-1">
                    <img [src]="img.url" alt="Product Image" class="w-full h-full object-contain rounded-xl">
                    <!-- Delete Button -->
                    <button type="button" (click)="removeImage(i)" 
                            class="absolute top-2 end-2 w-8 h-8 rounded-full bg-white/90 text-rose-500 shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-50 hover:text-rose-600 focus:outline-none">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                    <!-- Main Thumbnail Badge -->
                    @if (i === 0) {
                      <div class="absolute bottom-2 start-2 px-2 py-1 bg-indigo-600/90 text-white text-[10px] font-bold uppercase rounded-md shadow-sm backdrop-blur-sm">
                        Main Image
                      </div>
                    }
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-6 text-sm text-slate-500">
                <span class="text-rose-500 font-medium">Warning:</span> Please add at least one image to list this product.
              </div>
            }
          </div>

          <!-- Submit -->
          <div class="pt-6 border-t border-slate-100 flex items-center justify-end gap-4">
            <button type="button" (click)="cancel()" class="px-6 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
            <button type="submit" [disabled]="form.invalid || isSubmitting || uploadedImages().length === 0"
                    class="px-8 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm shadow-indigo-200">
              @if (isSubmitting) {
                <span class="flex items-center gap-2">
                  <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  Saving...
                </span>
              } @else {
                {{ isEditMode() ? 'Save Changes' : 'Publish Product' }}
              }
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Image Editor Modal -->
    @if (editingFile()) {
      <div class="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="relative w-full h-[85vh] max-w-5xl bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <h3 class="text-lg font-bold text-slate-900">Advanced Image Editor</h3>
            <button type="button" (click)="closeEditor()" class="px-5 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
              Cancel
            </button>
          </div>
          <div id="filerobot-editor-container" class="w-full flex-1 relative"></div>
        </div>
      </div>
    }
  `
})
export class AdminAddProductComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private router = inject(Router);
  private toast = inject(ToastService);
  private cloudinary = inject(CloudinaryService);
  private productService = inject(ProductService);

  isSubmitting = false;
  isUploadingImage = signal(false);
  isEditMode = signal(false);
  editProductId = signal<string | null>(null);

  uploadedImages = signal<ProductImageState[]>([]);
  private readonly pendingImageIds = new Set<string>();
  categories = signal<Category[]>([]);
  editingFile = signal<File | null>(null);
  editorInstance: any = null;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    brand: ['', [Validators.required, Validators.maxLength(100)]],
    description: ['', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    originalPrice: [null as number | null, [Validators.min(0.01)]],
    stockQuantity: [null as number | null, [Validators.required, Validators.min(0)]],
    categoryIds: [[] as string[], [Validators.required]],
    isAvailableForRent: [false],
    rentalPricePerDay: [null as number | null]
  });

  ngOnInit() {
    this.productService.getCategories().subscribe(res => {
      this.categories.set(res);
    });
    
    // Check if in edit mode
    const urlParts = this.router.url.split('/');
    if (urlParts.includes('edit-product')) {
      const slug = urlParts[urlParts.length - 1];
      this.isEditMode.set(true);
      this.loadProductForEdit(slug);
    }
  }

  loadProductForEdit(slug: string) {
    this.productService.getBySlug(slug).subscribe({
      next: (product) => {
        this.editProductId.set(product.id);
        this.form.patchValue({
          name: product.name,
          brand: product.brand || '',
          description: product.description,
          price: product.price,
          originalPrice: product.originalPrice,
          stockQuantity: product.stock,
          categoryIds: product.categories?.map(c => c.id) || [],
          isAvailableForRent: product.isAvailableForRent,
          rentalPricePerDay: product.rentalPricePerDay
        });
        if (product.imageDetails?.length) {
          this.uploadedImages.set(product.imageDetails.map(image => ({
            url: image.url,
            publicId: image.publicId ?? null
          })));
        } else if (product.images) {
          this.uploadedImages.set(product.images.map(url => ({ url, publicId: null })));
        }
        if (product.isAvailableForRent) {
          this.form.get('rentalPricePerDay')?.setValidators([Validators.required, Validators.min(0.01)]);
          this.form.get('rentalPricePerDay')?.updateValueAndValidity();
        }
      },
      error: (err) => {
        this.toast.error('Failed to load product details.');
        this.router.navigate(['/admin/products']);
      }
    });
  }

  toggleRentable(): void {
    const control = this.form.get('isAvailableForRent');
    const rentPriceControl = this.form.get('rentalPricePerDay');

    if (control) {
      control.setValue(!control.value);
      if (control.value) {
        rentPriceControl?.setValidators([Validators.required, Validators.min(0.01)]);
      } else {
        rentPriceControl?.clearValidators();
        rentPriceControl?.setValue(null);
      }
      rentPriceControl?.updateValueAndValidity();
    }
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editingFile.set(file);
      
      // Delay to let Angular render the container
      setTimeout(() => {
        this.initEditor(file);
      }, 100);
    }
    
    event.target.value = '';
  }

  initEditor(file: File) {
    const container = document.getElementById('filerobot-editor-container');
    if (!container) return;
    
    const imageUrl = URL.createObjectURL(file);
    
    // @ts-ignore
    const { TABS, TOOLS } = window.FilerobotImageEditor;
    
    const config = {
      source: imageUrl,
      onSave: (imageInfo: any, designState: any) => {
        if (imageInfo && imageInfo.imageBase64) {
          this.uploadEditedImage(imageInfo.imageBase64, file.name);
          this.closeEditor();
        } else if (imageInfo && imageInfo.imageCanvas) {
           const base64 = imageInfo.imageCanvas.toDataURL('image/jpeg');
           this.uploadEditedImage(base64, file.name);
           this.closeEditor();
        } else {
           this.toast.error("Could not capture edited image.");
        }
      },
      onClose: () => {
        this.closeEditor();
      },
      annotationsCommon: { fill: '#0f766e' },
      Text: { text: 'Budgetha' },
      theme: {
        colors: {
          primaryBg: '#ffffff',
          primaryBgHover: '#f8fafc',
          secondaryBg: '#f1f5f9',
          secondaryBgHover: '#e2e8f0',
          text: '#0f172a',
          textHover: '#000000',
          textMuted: '#64748b',
          textWarn: '#f87171',
          textError: '#ef4444',
          border: '#e2e8f0',
          borderLight: '#f1f5f9',
          borderActive: '#0f766e',
        },
      }
    };
    
    // @ts-ignore
    this.editorInstance = new window.FilerobotImageEditor(container, config);
    this.editorInstance.render({
      onClose: () => this.closeEditor()
    });
  }

  closeEditor() {
    if (this.editorInstance) {
      this.editorInstance.terminate();
      this.editorInstance = null;
    }
    this.editingFile.set(null);
  }

  // saveAndUpload() method removed because we now use onSave hook in the Filerobot config

  uploadEditedImage(base64: string, originalName: string) {
    fetch(base64)
      .then(res => res.blob())
      .then(blob => {
        const newFile = new File([blob], 'edited_' + originalName, { type: 'image/jpeg' });
        
        this.isUploadingImage.set(true);
        this.cloudinary.uploadImage(newFile).subscribe({
          next: (response) => {
            this.uploadedImages.update(images => [...images, {
              url: response.url,
              publicId: response.publicId
            }]);
            this.pendingImageIds.add(response.publicId);
            this.isUploadingImage.set(false);
            this.toast.success('Image edited and uploaded successfully!');
          },
          error: (err) => {
            console.error('Cloudinary upload error:', err);
            this.toast.error('Failed to upload edited image.');
            this.isUploadingImage.set(false);
          }
        });
      });
  }

  removeImage(index: number): void {
    const image = this.uploadedImages()[index];
    this.uploadedImages.update(images => images.filter((_, i) => i !== index));
    if (image?.publicId && this.pendingImageIds.has(image.publicId)) {
      this.deletePendingImage(image.publicId);
    }
  }

  cancel(): void {
    this.cleanupPendingImages();
    this.router.navigate(['/admin/products']);
  }

  ngOnDestroy(): void {
    this.cleanupPendingImages();
  }

  private deletePendingImage(publicId: string): void {
    this.pendingImageIds.delete(publicId);
    this.cloudinary.deleteImage(publicId).subscribe({
      error: error => console.warn('Failed to remove abandoned product image', error)
    });
  }

  private cleanupPendingImages(): void {
    for (const publicId of [...this.pendingImageIds]) this.deletePendingImage(publicId);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please fill in all required fields correctly.');
      return;
    }

    if (this.uploadedImages().length === 0) {
      this.toast.error('Please add at least one product image.');
      return;
    }

    this.isSubmitting = true;
    const val = this.form.value;

    const payload = {
      name: val.name,
      brand: val.brand,
      description: val.description,
      price: val.price,
      originalPrice: val.originalPrice,
      stockQuantity: val.stockQuantity,
      categoryIds: val.categoryIds && val.categoryIds.length > 0 ? val.categoryIds : ['00000000-0000-0000-0000-000000000001'],
      images: this.uploadedImages(),
      isAvailableForRent: val.isAvailableForRent,
      rentalPricePerDay: val.rentalPricePerDay,
      colors: [],
      sizes: [],
      features: [],
      specs: {},
      variants: []
    };

    if (this.isEditMode() && this.editProductId()) {
      this.http.put<void>(`${environment.apiUrl}/products/${this.editProductId()}`, payload).subscribe({
        next: () => {
          this.pendingImageIds.clear();
          this.toast.success('Product updated successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Failed to update product.');
          console.error(err);
        }
      });
    } else {
      this.http.post<string>(`${environment.apiUrl}/products`, payload).subscribe({
        next: () => {
          this.pendingImageIds.clear();
          this.toast.success('Product added successfully!');
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.isSubmitting = false;
          this.toast.error('Failed to add product.');
          console.error(err);
        }
      });
    }
  }
}

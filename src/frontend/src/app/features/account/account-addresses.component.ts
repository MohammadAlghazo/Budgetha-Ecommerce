import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { ToastService } from '../../core/services/toast.service';
import { Address } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-addresses',
  imports: [ReactiveFormsModule, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="card overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Saved Addresses</h2>
            <p class="text-sm text-slate-400 mt-0.5">Manage your delivery destinations</p>
          </div>
          <button type="button" (click)="startAdd()" class="btn-primary px-4 py-2.5 text-sm gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
            Add Address
          </button>
        </div>

        @if (account.addresses().length === 0 && !formVisible()) {
          <app-empty-state
            icon="address"
            title="No saved addresses"
            message="Save an address to breeze through checkout — your default will be pre-filled automatically." />
        } @else {
          <div class="grid sm:grid-cols-2 gap-4 p-6">
            @for (address of account.addresses(); track address.id) {
              <div class="rounded-2xl border p-5 transition-all duration-300"
                   [class]="address.isDefault ? 'border-violet-300 bg-violet-50/40 ring-1 ring-violet-100' : 'border-slate-200 hover:border-slate-300'">
                <div class="flex items-start justify-between">
                  <span class="badge" [class]="address.isDefault ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600'">
                    {{ address.label }}
                  </span>
                  @if (address.isDefault) {
                    <span class="text-[11px] font-bold text-violet-600 uppercase tracking-wider">Default</span>
                  }
                </div>
                <p class="mt-3 font-bold text-slate-900 text-sm">{{ address.fullName }}</p>
                <p class="mt-1 text-sm text-slate-500 leading-relaxed">
                  {{ address.line1 }}@if (address.line2) {<br />{{ address.line2 }}}<br />
                  {{ address.city }}, {{ address.state }} {{ address.zip }}<br />
                  {{ address.country }}
                </p>
                <p class="mt-1.5 text-xs text-slate-400">{{ address.phone }}</p>
                <div class="mt-4 flex items-center gap-3 text-xs font-semibold">
                  <button type="button" (click)="startEdit(address)" class="text-violet-600 hover:text-violet-500 transition-colors duration-300">Edit</button>
                  @if (!address.isDefault) {
                    <button type="button" (click)="account.setDefaultAddress(address.id)" class="text-slate-500 hover:text-slate-700 transition-colors duration-300">Set default</button>
                  }
                  <button type="button" (click)="remove(address)" class="text-rose-500 hover:text-rose-400 transition-colors duration-300 ms-auto">Delete</button>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Add / edit form -->
      @if (formVisible()) {
        <form [formGroup]="form" (ngSubmit)="save()" class="card p-6">
          <h3 class="text-base font-bold text-slate-900 mb-5">{{ editingId() ? 'Edit address' : 'New address' }}</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label for="addr-label" class="block text-sm font-medium text-slate-700 mb-1.5">Label</label>
              <input id="addr-label" type="text" formControlName="label" placeholder="Home, Office…" class="input-field" [class.input-error]="invalid('label')" />
              @if (invalid('label')) { <p class="mt-1.5 text-xs text-red-500">Label is required.</p> }
            </div>
            <div>
              <label for="addr-name" class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
              <input id="addr-name" type="text" formControlName="fullName" autocomplete="name" class="input-field" [class.input-error]="invalid('fullName')" />
              @if (invalid('fullName')) { <p class="mt-1.5 text-xs text-red-500">Full name is required.</p> }
            </div>
            <div class="sm:col-span-2">
              <label for="addr-line1" class="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
              <input id="addr-line1" type="text" formControlName="line1" autocomplete="address-line1" class="input-field" [class.input-error]="invalid('line1')" />
              @if (invalid('line1')) { <p class="mt-1.5 text-xs text-red-500">Street address is required.</p> }
            </div>
            <div class="sm:col-span-2">
              <label for="addr-line2" class="block text-sm font-medium text-slate-700 mb-1.5">Apartment, suite, etc. <span class="text-slate-400 font-normal">(optional)</span></label>
              <input id="addr-line2" type="text" formControlName="line2" autocomplete="address-line2" class="input-field" />
            </div>
            <div>
              <label for="addr-city" class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
              <input id="addr-city" type="text" formControlName="city" autocomplete="address-level2" class="input-field" [class.input-error]="invalid('city')" />
              @if (invalid('city')) { <p class="mt-1.5 text-xs text-red-500">City is required.</p> }
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="addr-state" class="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                <input id="addr-state" type="text" formControlName="state" autocomplete="address-level1" class="input-field" [class.input-error]="invalid('state')" />
                @if (invalid('state')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
              </div>
              <div>
                <label for="addr-zip" class="block text-sm font-medium text-slate-700 mb-1.5">ZIP</label>
                <input id="addr-zip" type="text" formControlName="zip" autocomplete="postal-code" class="input-field" [class.input-error]="invalid('zip')" />
                @if (invalid('zip')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
              </div>
            </div>
            <div>
              <label for="addr-country" class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
              <select id="addr-country" formControlName="country" class="input-field">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
                <option>Germany</option>
                <option>Australia</option>
                <option>United Arab Emirates</option>
                <option>Saudi Arabia</option>
                <option>Jordan</option>
              </select>
            </div>
            <div>
              <label for="addr-phone" class="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input id="addr-phone" type="tel" formControlName="phone" autocomplete="tel" class="input-field" [class.input-error]="invalid('phone')" />
              @if (invalid('phone')) { <p class="mt-1.5 text-xs text-red-500">Phone is required.</p> }
            </div>
            <label class="sm:col-span-2 flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="isDefault" class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30" />
              <span class="text-sm text-slate-600">Set as my default address</span>
            </label>
          </div>
          <div class="mt-6 flex gap-3">
            <button type="submit" class="btn-primary">{{ editingId() ? 'Save changes' : 'Add address' }}</button>
            <button type="button" (click)="cancel()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AccountAddressesComponent {
  readonly account = inject(AccountService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly formVisible = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly submitted = signal(false);

  readonly form = this.fb.group({
    label: ['', Validators.required],
    fullName: ['', Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', Validators.required],
    country: ['United States', Validators.required],
    phone: ['', Validators.required],
    isDefault: [false],
  });

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  startAdd(): void {
    this.editingId.set(null);
    this.submitted.set(false);
    this.form.reset({ country: 'United States', isDefault: this.account.addresses().length === 0 });
    this.formVisible.set(true);
  }

  startEdit(address: Address): void {
    this.editingId.set(address.id as any);
    this.submitted.set(false);
    this.form.patchValue({ ...address, line2: address.line2 ?? '' });
    this.formVisible.set(true);
  }

  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    this.account.saveAddress({
      id: this.editingId() ?? undefined,
      label: v.label!,
      fullName: v.fullName!,
      line1: v.line1!,
      line2: v.line2 || undefined,
      city: v.city!,
      state: v.state!,
      zip: v.zip!,
      country: v.country!,
      phone: v.phone!,
      isDefault: !!v.isDefault,
    });
    this.toast.success(this.editingId() ? 'Address updated' : 'Address added');
    this.cancel();
  }

  remove(address: Address): void {
    this.account.deleteAddress(address.id);
    this.toast.info(`Address “${address.label}” deleted`);
  }

  cancel(): void {
    this.formVisible.set(false);
    this.editingId.set(null);
    this.submitted.set(false);
  }
}

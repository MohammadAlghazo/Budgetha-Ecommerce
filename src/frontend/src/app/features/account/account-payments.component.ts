import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AccountService } from '../../core/services/account.service';
import { ToastService } from '../../core/services/toast.service';
import { PaymentCard } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-account-payments',
  imports: [ReactiveFormsModule, EmptyStateComponent],
  template: `
    <div class="space-y-6">
      <div class="card overflow-hidden">
        <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-900">Payment Methods</h2>
            <p class="text-sm text-slate-400 mt-0.5">Cards are stored securely and never shared</p>
          </div>
          <button type="button" (click)="startAdd()" class="btn-primary px-4 py-2.5 text-sm gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M12 5v14M5 12h14" /></svg>
            Add Card
          </button>
        </div>

        @if (account.cards().length === 0 && !formVisible()) {
          <app-empty-state
            icon="card"
            title="No payment methods"
            message="Add a card to check out faster. Your details are encrypted with bank-level security." />
        } @else {
          <div class="grid sm:grid-cols-2 gap-4 p-6">
            @for (card of account.cards(); track card.id) {
              <div class="relative rounded-2xl p-5 text-white overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1"
                   [class]="cardGradient(card.brand)">
                <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
                <div class="relative">
                  <div class="flex items-start justify-between">
                    <svg class="w-9 h-9 text-white/80" fill="none" stroke="currentColor" stroke-width="1.2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                    </svg>
                    <span class="text-sm font-black italic tracking-wider uppercase">{{ brandLabel(card.brand) }}</span>
                  </div>
                  <p class="mt-6 text-lg font-bold tracking-[0.2em]">•••• •••• •••• {{ card.last4 }}</p>
                  <div class="mt-4 flex items-end justify-between">
                    <div>
                      <p class="text-[10px] uppercase tracking-wider text-white/60">Card holder</p>
                      <p class="text-sm font-semibold">{{ card.holder }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] uppercase tracking-wider text-white/60">Expires</p>
                      <p class="text-sm font-semibold">{{ pad(card.expMonth) }}/{{ card.expYear % 100 }}</p>
                    </div>
                  </div>
                  <div class="mt-5 pt-4 border-t border-white/15 flex items-center gap-4 text-xs font-semibold">
                    @if (card.isDefault) {
                      <span class="badge bg-white/20 text-white">Default</span>
                    } @else {
                      <button type="button" (click)="account.setDefaultCard(card.id)" class="text-white/80 hover:text-white transition-colors duration-300">Set default</button>
                    }
                    <button type="button" (click)="remove(card)" class="text-white/70 hover:text-rose-200 transition-colors duration-300 ml-auto">Remove</button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Add card form -->
      @if (formVisible()) {
        <form [formGroup]="form" (ngSubmit)="save()" class="card p-6">
          <h3 class="text-base font-bold text-slate-900 mb-5">Add a new card</h3>
          <div class="grid sm:grid-cols-2 gap-4">
            <div class="sm:col-span-2">
              <label for="card-number" class="block text-sm font-medium text-slate-700 mb-1.5">Card number</label>
              <input id="card-number" type="text" formControlName="number" inputmode="numeric" placeholder="1234 5678 9012 3456"
                     maxlength="19" (input)="formatNumber($event)" class="input-field tracking-widest" [class.input-error]="invalid('number')" />
              @if (invalid('number')) { <p class="mt-1.5 text-xs text-red-500">Enter a valid 16-digit card number.</p> }
            </div>
            <div>
              <label for="card-holder" class="block text-sm font-medium text-slate-700 mb-1.5">Name on card</label>
              <input id="card-holder" type="text" formControlName="holder" autocomplete="cc-name" class="input-field" [class.input-error]="invalid('holder')" />
              @if (invalid('holder')) { <p class="mt-1.5 text-xs text-red-500">Required.</p> }
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="card-expiry" class="block text-sm font-medium text-slate-700 mb-1.5">Expiry (MM/YY)</label>
                <input id="card-expiry" type="text" formControlName="expiry" inputmode="numeric" placeholder="MM/YY"
                       maxlength="5" (input)="formatExpiry($event)" class="input-field" [class.input-error]="invalid('expiry')" />
                @if (invalid('expiry')) { <p class="mt-1.5 text-xs text-red-500">MM/YY</p> }
              </div>
              <div>
                <label for="card-cvc" class="block text-sm font-medium text-slate-700 mb-1.5">CVC</label>
                <input id="card-cvc" type="password" formControlName="cvc" inputmode="numeric" placeholder="•••" maxlength="4"
                       class="input-field" [class.input-error]="invalid('cvc')" />
                @if (invalid('cvc')) { <p class="mt-1.5 text-xs text-red-500">3–4 digits</p> }
              </div>
            </div>
            <label class="sm:col-span-2 flex items-center gap-3 cursor-pointer">
              <input type="checkbox" formControlName="isDefault" class="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500/30" />
              <span class="text-sm text-slate-600">Use as my default payment method</span>
            </label>
          </div>
          <div class="mt-6 flex gap-3">
            <button type="submit" class="btn-primary">Add card</button>
            <button type="button" (click)="cancel()" class="btn-secondary">Cancel</button>
          </div>
        </form>
      }
    </div>
  `,
})
export class AccountPaymentsComponent {
  readonly account = inject(AccountService);
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);

  readonly formVisible = signal(false);
  readonly submitted = signal(false);

  readonly form = this.fb.group({
    number: ['', [Validators.required, Validators.pattern(/^(\d{4} ){3}\d{4}$/)]],
    holder: ['', Validators.required],
    expiry: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/)]],
    cvc: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
    isDefault: [false],
  });

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  cardGradient(brand: PaymentCard['brand']): string {
    switch (brand) {
      case 'visa':
        return 'bg-gradient-to-br from-violet-700 via-violet-800 to-indigo-900';
      case 'mastercard':
        return 'bg-gradient-to-br from-slate-800 via-slate-900 to-black';
      case 'amex':
        return 'bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900';
    }
  }

  brandLabel(brand: PaymentCard['brand']): string {
    return brand === 'mastercard' ? 'Mastercard' : brand === 'amex' ? 'Amex' : 'Visa';
  }

  pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  startAdd(): void {
    this.submitted.set(false);
    this.form.reset({ isDefault: this.account.cards().length === 0 });
    this.formVisible.set(true);
  }

  formatNumber(event: Event): void {
    const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16);
    this.form.get('number')!.setValue(digits.replace(/(\d{4})(?=\d)/g, '$1 '), { emitEvent: false });
  }

  formatExpiry(event: Event): void {
    const digits = (event.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.form.get('expiry')!.setValue(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits, { emitEvent: false });
  }

  save(): void {
    this.submitted.set(true);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const digits = v.number!.replace(/\s/g, '');
    const [expMonth, expYear] = v.expiry!.split('/').map(Number);
    const brand: PaymentCard['brand'] = digits.startsWith('4') ? 'visa' : digits.startsWith('3') ? 'amex' : 'mastercard';
    this.account.saveCard({
      brand,
      last4: digits.slice(-4),
      expMonth,
      expYear: 2000 + expYear,
      holder: v.holder!,
      isDefault: !!v.isDefault,
    });
    this.toast.success('Card added');
    this.cancel();
  }

  remove(card: PaymentCard): void {
    this.account.deleteCard(card.id);
    this.toast.info(`Card ending ${card.last4} removed`);
  }

  cancel(): void {
    this.formVisible.set(false);
    this.submitted.set(false);
  }
}

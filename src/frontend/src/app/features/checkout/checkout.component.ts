import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AccountService } from '../../core/services/account.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { Address } from '../../core/models/shop.models';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { NgxPayPalModule, IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { Observable, switchMap } from 'rxjs';

type PaymentMethod = 'paypal' | 'cod';

@Component({
  selector: 'app-checkout',
  imports: [CurrencyPipe, RouterLink, ReactiveFormsModule, EmptyStateComponent, NgxPayPalModule],
  template: `
    @if (cart.items().length === 0) {
      <div class="max-w-2xl mx-auto px-4 py-16">
        <div class="card">
          <app-empty-state
            icon="cart"
            title="Nothing to check out"
            message="Your cart is empty. Add a few items first, then come back to complete your order."
            ctaLabel="Start Shopping"
            ctaLink="/shop" />
        </div>
      </div>
    } @else {
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <!-- Progress -->
        <nav class="flex items-center justify-center gap-3 sm:gap-5 text-xs sm:text-sm" aria-label="Checkout progress">
          <a routerLink="/cart" class="flex items-center gap-2 text-violet-600 font-semibold">
            <span class="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
            </span>
            Cart
          </a>
          <span class="w-8 sm:w-14 h-px bg-violet-300"></span>
          <span class="flex items-center gap-2 text-violet-700 font-bold">
            <span class="h-6 w-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-bold">2</span>
            Checkout
          </span>
          <span class="w-8 sm:w-14 h-px bg-slate-200"></span>
          <span class="flex items-center gap-2 text-slate-400 font-medium">
            <span class="h-6 w-6 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold">3</span>
            Confirmation
          </span>
        </nav>

        <h1 class="mt-8 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Checkout</h1>

        <form [formGroup]="form" (ngSubmit)="placeOrder()" class="mt-8 grid lg:grid-cols-5 gap-8 items-start">
          <!-- ══ Left column ══ -->
          <div class="lg:col-span-3 space-y-6">
            <!-- Contact -->
            <section class="card p-6">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">1</span>
                Contact Information
              </h2>
              <div class="mt-5 grid sm:grid-cols-2 gap-4">
                <div>
                  <label for="email" class="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                  <input id="email" type="email" formControlName="email" autocomplete="email" placeholder="you@example.com"
                         class="input-field" [class.input-error]="invalid('email')" />
                  @if (invalid('email')) {
                    <p class="mt-1.5 text-xs text-red-500">A valid email is required for your receipt.</p>
                  }
                </div>
                <div>
                  <label for="phone" class="block text-sm font-medium text-slate-700 mb-1.5">Phone number</label>
                  <input id="phone" type="tel" formControlName="phone" autocomplete="tel" placeholder="+1 (555) 000-0000"
                         class="input-field" [class.input-error]="invalid('phone')" />
                  @if (invalid('phone')) {
                    <p class="mt-1.5 text-xs text-red-500">Phone number is required for delivery updates.</p>
                  }
                </div>
              </div>
            </section>

            <!-- Shipping -->
            <section class="card p-6">
              <div class="flex items-center justify-between flex-wrap gap-3">
                <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                  <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">2</span>
                  Delivery Address
                </h2>
                @if (savedAddresses().length) {
                  <div class="flex gap-2">
                    @for (address of savedAddresses(); track address.id) {
                      <button type="button" (click)="useAddress(address)"
                              class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all duration-300"
                              [class]="selectedAddressId() === address.id ? 'border-violet-500 bg-violet-50 text-violet-700' : 'border-slate-200 text-slate-600 hover:border-violet-300 hover:text-violet-700'">
                        Use “{{ address.label }}”
                      </button>
                    }
                  </div>
                }
                @if (account.addressesLoading()) {
                  <span class="text-xs text-slate-400">Loading saved addresses...</span>
                } @else if (account.addressesError()) {
                  <button type="button" (click)="account.syncAddresses()" class="text-xs font-semibold text-rose-600 hover:text-rose-500">Saved addresses unavailable. Retry</button>
                }
              </div>

              <div class="mt-5 grid sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label for="fullName" class="block text-sm font-medium text-slate-700 mb-1.5">Full name</label>
                  <input id="fullName" type="text" formControlName="fullName" autocomplete="name" placeholder="Jane Doe"
                         class="input-field" [class.input-error]="invalid('fullName')" />
                  @if (invalid('fullName')) {
                    <p class="mt-1.5 text-xs text-red-500">Full name is required.</p>
                  }
                </div>
                <div class="sm:col-span-2">
                  <label for="line1" class="block text-sm font-medium text-slate-700 mb-1.5">Street address</label>
                  <input id="line1" type="text" formControlName="line1" autocomplete="address-line1" placeholder="123 Main Street"
                         class="input-field" [class.input-error]="invalid('line1')" />
                  @if (invalid('line1')) {
                    <p class="mt-1.5 text-xs text-red-500">Street address is required.</p>
                  }
                </div>
                <div class="sm:col-span-2">
                  <label for="line2" class="block text-sm font-medium text-slate-700 mb-1.5">Apartment, suite, etc. <span class="text-slate-400 font-normal">(optional)</span></label>
                  <input id="line2" type="text" formControlName="line2" autocomplete="address-line2" placeholder="Apt 4B" class="input-field" />
                </div>
                <div>
                  <label for="city" class="block text-sm font-medium text-slate-700 mb-1.5">City</label>
                  <input id="city" type="text" formControlName="city" autocomplete="address-level2" placeholder="Springfield"
                         class="input-field" [class.input-error]="invalid('city')" />
                  @if (invalid('city')) {
                    <p class="mt-1.5 text-xs text-red-500">City is required.</p>
                  }
                </div>
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label for="state" class="block text-sm font-medium text-slate-700 mb-1.5">State</label>
                    <input id="state" type="text" formControlName="state" autocomplete="address-level1" placeholder="IL"
                           class="input-field" [class.input-error]="invalid('state')" />
                    @if (invalid('state')) {
                      <p class="mt-1.5 text-xs text-red-500">Required.</p>
                    }
                  </div>
                  <div>
                    <label for="zip" class="block text-sm font-medium text-slate-700 mb-1.5">ZIP code</label>
                    <input id="zip" type="text" formControlName="zip" autocomplete="postal-code" placeholder="62704"
                           class="input-field" [class.input-error]="invalid('zip')" />
                    @if (invalid('zip')) {
                      <p class="mt-1.5 text-xs text-red-500">Valid ZIP required.</p>
                    }
                  </div>
                </div>
                <div class="sm:col-span-2">
                  <label for="country" class="block text-sm font-medium text-slate-700 mb-1.5">Country</label>
                  <select id="country" formControlName="country" autocomplete="country-name" class="input-field">
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
              </div>
            </section>

            <!-- Payment -->
            <section class="card p-6">
              <h2 class="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span class="h-7 w-7 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-sm font-bold">3</span>
                Payment Method
              </h2>

              <div class="mt-5 grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Payment method">
                <!-- PayPal option -->
                <button type="button" role="radio" [attr.aria-checked]="paymentMethod() === 'paypal'" (click)="paymentMethod.set('paypal')"
                        class="rounded-2xl border-2 p-4 text-start transition-all duration-300"
                        [class]="paymentMethod() === 'paypal' ? 'border-violet-600 bg-violet-50/60 shadow-md shadow-violet-100' : 'border-slate-200 hover:border-slate-300'">
                  <svg class="w-7 h-7 mb-2" viewBox="0 0 24 24" fill="none">
                    <path d="M7.076 21.337H4.13a.64.64 0 01-.633-.74L6.222 3.384a.77.77 0 01.76-.65h6.673c2.217 0 3.916.472 4.933 1.404.95.87 1.322 2.083 1.106 3.72-.023.15-.048.302-.078.458-.71 3.65-3.14 4.913-6.24 4.913h-1.58a.77.77 0 00-.76.65l-.81 5.148-.15 1.31z" [attr.fill]="paymentMethod() === 'paypal' ? '#003087' : '#94a3b8'"/>
                    <path d="M19.62 7.858c-.023.15-.048.302-.078.458-.71 3.65-3.14 4.913-6.24 4.913h-1.58a.77.77 0 00-.76.65l-1.04 6.6a.54.54 0 00.534.625h2.79a.673.673 0 00.665-.568l.027-.142.526-3.336.034-.183a.673.673 0 01.665-.569h.418c2.712 0 4.835-1.101 5.455-4.288.26-1.33.126-2.442-.56-3.223a2.68 2.68 0 00-.856-.637z" [attr.fill]="paymentMethod() === 'paypal' ? '#0070E0' : '#cbd5e1'"/>
                  </svg>
                  <p class="text-sm font-bold text-slate-900">PayPal</p>
                  <p class="text-xs text-slate-400 mt-0.5">Fast &amp; buyer protected</p>
                </button>

                <!-- COD option -->
                <button type="button" role="radio" [attr.aria-checked]="paymentMethod() === 'cod'" (click)="paymentMethod.set('cod')"
                        class="rounded-2xl border-2 p-4 text-start transition-all duration-300"
                        [class]="paymentMethod() === 'cod' ? 'border-violet-600 bg-violet-50/60 shadow-md shadow-violet-100' : 'border-slate-200 hover:border-slate-300'">
                  <svg class="w-7 h-7 mb-2" [class]="paymentMethod() === 'cod' ? 'text-violet-600' : 'text-slate-400'" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <p class="text-sm font-bold text-slate-900">Cash on Delivery</p>
                  <p class="text-xs text-slate-400 mt-0.5">Pay when it arrives</p>
                </button>
              </div>

              @if (paymentMethod() === 'paypal') {
                <div class="mt-6">
                  <p class="text-sm text-slate-600 mb-4">Click the button below to log in to PayPal and complete your purchase securely.</p>
                  
                  @if (form.valid) {
                    <!-- Render PayPal Button -->
                    <ngx-paypal [config]="payPalConfig"></ngx-paypal>
                  } @else {
                    <div class="rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-amber-700">
                      Please fill in your Contact Information and Delivery Address above to unlock the PayPal checkout.
                    </div>
                  }
                </div>
              } @else {
                <div class="mt-6 rounded-2xl bg-emerald-50 ring-1 ring-emerald-100 p-5 flex items-center gap-4">
                  <svg class="w-8 h-8 text-emerald-600 shrink-0" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <p class="text-sm text-slate-700 leading-relaxed">
                    Pay <span class="font-bold">{{ cart.total() | currency }}</span> in cash when your order arrives.
                    Please have the exact amount ready for the courier.
                  </p>
                </div>
                
                @if (form.invalid) {
                  <div class="mt-4 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-4 py-3 text-sm text-amber-700">
                    Please fill in your Contact Information and Delivery Address above to place your order.
                  </div>
                }
              }
            </section>
          </div>

          <!-- ══ Right column: sticky summary ══ -->
          <aside class="lg:col-span-2 card p-6 lg:sticky lg:top-24">
            <h2 class="text-lg font-bold text-slate-900">Order Summary</h2>

            <ul class="mt-5 space-y-4 max-h-72 overflow-y-auto pe-1">
              @for (item of cart.items(); track item.productId + (item.color ?? '') + (item.size ?? '')) {
                <li class="flex items-center gap-3.5">
                  <div class="relative shrink-0">
                    <img [src]="item.image" [alt]="item.name" class="h-16 w-16 rounded-xl object-contain mix-blend-multiply bg-slate-100 p-1" />
                    <span class="absolute -top-1.5 -end-1.5 h-5 min-w-5 px-1 rounded-full bg-slate-800 text-white text-[11px] font-bold flex items-center justify-center">
                      {{ item.quantity }}
                    </span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-semibold text-slate-900 truncate">{{ item.name }}</p>
                    <p class="text-xs text-slate-400">{{ item.type ?? 'Purchase' }}{{ item.color ? ' · ' + item.color : '' }}{{ item.size ? ' · ' + item.size : '' }}</p>
                    @if (item.type === 'Rental') {
                      <p class="text-xs text-slate-400">{{ item.rentalStartDate }} to {{ item.rentalEndDate }}</p>
                    }
                  </div>
                  <span class="text-sm font-bold text-slate-900 shrink-0">{{ item.price * item.quantity | currency }}</span>
                </li>
              }
            </ul>

            <dl class="mt-6 space-y-3 text-sm border-t border-slate-100 pt-5">
              <div class="flex justify-between">
                <dt class="text-slate-500">Subtotal</dt>
                <dd class="font-semibold text-slate-900">{{ cart.subtotal() | currency }}</dd>
              </div>
              @if (cart.discount() > 0) {
                <div class="flex justify-between">
                  <dt class="text-emerald-600">Discount ({{ cart.promo()?.code }})</dt>
                  <dd class="font-semibold text-emerald-600">-{{ cart.discount() | currency }}</dd>
                </div>
              }
              <div class="flex justify-between border-t border-slate-100 pt-4 text-lg">
                <dt class="font-bold text-slate-900">{{ cart.hasRental() ? 'Estimated total' : 'Total' }}</dt>
                <dd class="font-extrabold text-slate-900">{{ cart.total() | currency }}</dd>
              </div>
            </dl>
            @if (cart.hasRental()) {
              <p class="mt-3 text-xs leading-relaxed text-amber-700">Rental pricing is finalized by the server when the order is placed.</p>
            }

            @if (submitted() && form.invalid) {
              <div class="mt-5 rounded-xl bg-red-50 ring-1 ring-red-100 px-4 py-3 flex items-start gap-2.5">
                <svg class="w-4.5 h-4.5 w-[18px] h-[18px] text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
                <p class="text-xs text-red-600 leading-relaxed">Please fix the highlighted fields above.</p>
              </div>
            }

            @if (paymentMethod() === 'cod') {
              <button type="submit" [disabled]="placing() || form.invalid" class="btn-primary w-full mt-6 py-4 sm:py-5 text-base sm:text-lg shadow-lg shadow-violet-600/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none">
                @if (placing()) {
                  <svg class="animate-spin -ms-1 me-2.5 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Placing order…
                } @else {
                  Place Order — {{ cart.total() | currency }}
                }
              </button>
            }

            <div class="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              Protected by buyer guarantee · SSL encrypted
            </div>
          </aside>
        </form>
      </div>
    }
  `,
})
export class CheckoutComponent implements OnInit {
  readonly cart = inject(CartService);
  private readonly orders = inject(OrderService);
  readonly account = inject(AccountService);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  public payPalConfig?: IPayPalConfig;

  readonly paymentMethod = signal<PaymentMethod>('paypal');
  readonly placing = signal(false);
  readonly submitted = signal(false);
  readonly selectedAddressId = signal<number | string | null>(null);

  readonly savedAddresses = this.account.addresses;

  readonly form = this.fb.group({
    email: [this.auth.user()?.email ?? '', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    fullName: [this.defaultName(), Validators.required],
    line1: ['', Validators.required],
    line2: [''],
    city: ['', Validators.required],
    state: ['', Validators.required],
    zip: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z\- ]{3,10}$/)]],
    country: ['United States', Validators.required],
  });

  constructor() {
    effect(() => {
      const defaultAddress = this.account.defaultAddress();
      if (defaultAddress && !this.selectedAddressId() && !this.form.dirty) {
        this.useAddress(defaultAddress, false);
      }
    });
  }

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'USD',
      clientId: 'Adhr3wKyo-vITBWdrUb94-pNgeWVsSeVc9lsjlTP9nISPfq057uwt5ZACGZxot9nNbZzcpb7jxYNc2AQ', 
      createOrderOnServer: (data) => {
        // Place the Budgetha order first
        return new Promise<string>((resolve, reject) => {
          this.submitted.set(true);
          if (this.form.invalid) {
            this.form.markAllAsTouched();
            this.toast.error('Please complete your delivery address first.');
            reject('Invalid form');
            return;
          }

          const v = this.form.getRawValue();
          this.placeOrderRequest({
            items: this.cart.items(),
            subtotal: this.cart.subtotal(),
            discount: this.cart.discount(),
            total: this.cart.total(),
            address: {
              id: 0,
              label: 'Shipping',
              fullName: v.fullName!,
              line1: v.line1!,
              line2: v.line2 || undefined,
              city: v.city!,
              state: v.state!,
              zip: v.zip!,
              country: v.country!,
              phone: v.phone!,
              isDefault: false,
            },
            paymentSummary: 'PayPal',
            paymentMethod: 'CreditCard',
            promoCode: this.cart.promo()?.code
          }).subscribe({
            next: (orderId) => {
              // Now create the PayPal order on backend
              this.orders.createPayPalOrder(orderId).subscribe({
                next: (res) => {
                  (window as any)._currentBudgethaOrderId = orderId; // Store temporarily for capture
                  resolve(res.id);
                },
                error: (err) => reject(err)
              });
            },
            error: (err) => reject(err)
          });
        });
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },
      onApprove: (data, actions) => {
        this.placing.set(true);
        const orderId = (window as any)._currentBudgethaOrderId;
        if (orderId) {
          this.orders.capturePayPalOrder(orderId, data.orderID).subscribe({
            next: () => {
              this.cart.clear();
              this.placing.set(false);
              this.router.navigate(['/checkout/success', orderId.substring(0, 8).toUpperCase()]);
            },
            error: () => {
              this.placing.set(false);
              this.toast.error('Failed to capture PayPal payment.');
            }
          });
        }
      },
      onCancel: (data, actions) => {
        this.placing.set(false);
        this.toast.info('PayPal payment cancelled');
      },
      onError: err => {
        this.placing.set(false);
        this.toast.error('An error occurred during PayPal payment');
        console.log('PayPal Error', err);
      }
    };
  }

  invalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.touched || this.submitted());
  }

  useAddress(address: Address, notify = true): void {
    this.form.patchValue({
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 ?? '',
      city: address.city,
      state: address.state,
      zip: address.zip,
      country: address.country,
      // The current address DTO has no phone field; keep the checkout contact phone.
      phone: address.phone || this.form.controls.phone.value || '',
    });
    this.selectedAddressId.set(address.id);
    if (notify) this.toast.info(`Address “${address.label}” selected`);
  }

  placeOrder(): void {
    if (this.paymentMethod() !== 'cod') {
      return; 
    }

    this.submitted.set(true);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toast.error('Please complete the highlighted fields.');
      return;
    }

    this.placing.set(true);
    
    setTimeout(() => {
      this.completeOrder('Cash on Delivery');
    }, 900);
  }

  private completeOrder(paymentSummary: string): void {
    const v = this.form.getRawValue();
    this.placeOrderRequest({
      items: this.cart.items(),
      subtotal: this.cart.subtotal(),
      discount: this.cart.discount(),
      total: this.cart.total(),
      address: {
        id: 0,
        label: 'Shipping',
        fullName: v.fullName!,
        line1: v.line1!,
        line2: v.line2 || undefined,
        city: v.city!,
        state: v.state!,
        zip: v.zip!,
        country: v.country!,
        phone: v.phone!,
        isDefault: false,
      },
      paymentSummary,
      paymentMethod: paymentSummary.includes('PayPal') ? 'CreditCard' : 'CashOnDelivery',
      promoCode: this.cart.promo()?.code
    }).subscribe({
      next: (orderId) => {
        this.cart.clear();
        this.placing.set(false);
        // Navigate using the first 8 characters of orderId as order number
        this.router.navigate(['/checkout/success', orderId.substring(0, 8).toUpperCase()]);
      },
      error: () => {
        this.placing.set(false);
        this.toast.error('Failed to place order. Please try again.');
      }
    });
  }

  private placeOrderRequest(input: Parameters<OrderService['placeOrder']>[0]): Observable<string> {
    const selected = this.account.addresses().find(address =>
      address.id === this.selectedAddressId() && this.matchesForm(address)
    );
    if (selected && typeof selected.id === 'string') {
      return this.orders.placeOrder({ ...input, shippingAddressId: selected.id });
    }

    const v = this.form.getRawValue();
    return this.account.createCheckoutAddress({
      fullName: v.fullName!,
      line1: v.line1!,
      line2: v.line2 || undefined,
      city: v.city!,
      state: v.state!,
      zip: v.zip!,
      country: v.country!,
      isDefault: this.account.addresses().length === 0
    }).pipe(switchMap(shippingAddressId => this.orders.placeOrder({ ...input, shippingAddressId })));
  }

  private matchesForm(address: Address): boolean {
    const v = this.form.getRawValue();
    return address.fullName === v.fullName && address.line1 === v.line1 &&
      (address.line2 ?? '') === (v.line2 ?? '') && address.city === v.city &&
      address.state === v.state && address.zip === v.zip && address.country === v.country;
  }

  private defaultName(): string {
    const u = this.auth.user();
    return u ? `${u.firstName} ${u.lastName}`.trim() : '';
  }
}

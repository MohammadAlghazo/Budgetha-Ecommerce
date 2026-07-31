import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { DatePipe, DecimalPipe, CurrencyPipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AdminService, AdminStats, AdminUser, SellerStats } from '../../core/services/admin.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-dashboard',
  imports: [DatePipe, DecimalPipe, CurrencyPipe, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto space-y-8">

      <!-- Welcome Banner -->
      <div class="rounded-2xl bg-gradient-to-r from-teal-700 to-teal-900 p-6 text-white flex items-center justify-between shadow-lg overflow-hidden relative">
        <div class="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div class="absolute right-24 bottom-0 w-40 h-40 bg-white/5 rounded-full translate-y-1/2"></div>
        <div class="relative z-10">
          <p class="text-teal-200 text-sm font-medium mb-1">Welcome back,</p>
          <h1 class="text-2xl font-bold">{{ authService.user()?.firstName }} {{ authService.user()?.lastName }}</h1>
          <p class="text-teal-300 text-sm mt-1">
            @if (isSuperAdmin()) {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
                Super Administrator — Full system access
              </span>
            } @else if (isAdminOrSuperAdmin()) {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-teal-300 inline-block"></span>
                Administrator — Product & content management
              </span>
            } @else {
              <span class="inline-flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400 inline-block"></span>
                Store Seller — Manage your products
              </span>
            }
          </p>
        </div>
        <div class="relative z-10 hidden sm:flex gap-3">
          @if (isAdminOrSuperAdmin()) {
            <a routerLink="/admin/users" class="px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium rounded-xl transition-colors backdrop-blur-sm border border-white/10">
              Manage Users
            </a>
          }
          <a routerLink="/admin/products" class="px-4 py-2 bg-white text-teal-800 text-sm font-bold rounded-xl hover:bg-teal-50 transition-colors shadow-sm">
            View Products
          </a>
        </div>
      </div>

      <!-- Stats Grid -->
      @if (isAdminOrSuperAdmin()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <!-- Total Users -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <span class="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalUsers | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Users</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-teal-500 to-teal-300 rounded-full" style="width: 70%"></div>
          </div>
        </div>

        <!-- Total Products -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            </div>
            <span class="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Listed</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalProducts | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Products</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-indigo-500 to-indigo-300 rounded-full" style="width: 55%"></div>
          </div>
        </div>

        <!-- Padding space instead of Pending -->
        <!-- Total Orders -->
        <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-4">
            <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            </div>
            <span class="text-xs font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Orders</span>
          </div>
          <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ stats()?.totalOrders | number }}</h3>
          <p class="text-sm font-medium text-slate-500 mt-1">Total Orders</p>
          <div class="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-rose-400 to-rose-200 rounded-full" style="width: 40%"></div>
          </div>
        </div>
        </div>
      } @else {
        <!-- Seller Stats Grid -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <!-- Total Products -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalProducts | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Total Products</p>
          </div>

          <!-- Total Sales (Items Sold) -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-teal-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalSales | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Items Sold</p>
          </div>

          <!-- Total Revenue -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalRevenue | currency }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Total Revenue</p>
          </div>

          <!-- Total Orders -->
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between mb-4">
              <div class="h-11 w-11 rounded-xl bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-200">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
              </div>
            </div>
            <h3 class="text-3xl font-bold text-slate-900 tabular-nums">{{ sellerStats()?.totalOrders | number }}</h3>
            <p class="text-sm font-medium text-slate-500 mt-1">Unique Orders</p>
          </div>
        </div>
      }

      <!-- Charts Row -->
      @if (isAdminOrSuperAdmin()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <!-- Bar Chart — Registration Activity -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-base font-bold text-slate-900">Platform Activity</h3>
              <p class="text-sm text-slate-500 mt-0.5">Overview of key metrics</p>
            </div>
            <div class="flex items-center gap-4 text-xs font-medium text-slate-500">
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-teal-500 inline-block"></span>Users</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-indigo-500 inline-block"></span>Products</span>
              <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-sm bg-rose-400 inline-block"></span>Orders</span>
            </div>
          </div>

          <!-- SVG Bar Chart -->
          <div class="relative">
            <svg viewBox="0 0 600 200" class="w-full" style="overflow: visible;">
              <!-- Y-axis grid lines -->
              <line x1="40" y1="10" x2="40" y2="170" stroke="#e2e8f0" stroke-width="1"/>
              <line x1="40" y1="10" x2="590" y2="10" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="52.5" x2="590" y2="52.5" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="95" x2="590" y2="95" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="137.5" x2="590" y2="137.5" stroke="#f1f5f9" stroke-width="1" stroke-dasharray="4,4"/>
              <line x1="40" y1="170" x2="590" y2="170" stroke="#e2e8f0" stroke-width="1"/>

              <!-- Y axis labels -->
              <text x="32" y="13" text-anchor="end" font-size="9" fill="#94a3b8">100%</text>
              <text x="32" y="55.5" text-anchor="end" font-size="9" fill="#94a3b8">75%</text>
              <text x="32" y="98" text-anchor="end" font-size="9" fill="#94a3b8">50%</text>
              <text x="32" y="140.5" text-anchor="end" font-size="9" fill="#94a3b8">25%</text>
              <text x="32" y="173" text-anchor="end" font-size="9" fill="#94a3b8">0%</text>

              <!-- Users bar (teal) -->
              <rect x="52" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalUsers, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalUsers, maxStat())"
                    fill="url(#tealGrad)" class="transition-all duration-700"/>
              <!-- Products bar (indigo) -->
              <rect x="84" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalProducts, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalProducts, maxStat())"
                    fill="url(#indigoGrad)" class="transition-all duration-700"/>
              <!-- Orders bar (rose) -->
              <rect x="116" y="10" width="28" rx="4"
                    [attr.height]="barHeight(stats()?.totalOrders, maxStat())"
                    [attr.y]="170 - barHeight(stats()?.totalOrders, maxStat())"
                    fill="url(#roseGrad)" class="transition-all duration-700"/>

              <!-- X-axis label -->
              <text x="88" y="188" text-anchor="middle" font-size="10" fill="#64748b" font-weight="600">Current Stats</text>


              <!-- Gradients -->
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#0d9488"/>
                  <stop offset="100%" stop-color="#5eead4"/>
                </linearGradient>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#6366f1"/>
                  <stop offset="100%" stop-color="#a5b4fc"/>
                </linearGradient>
                <linearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f43f5e"/>
                  <stop offset="100%" stop-color="#fda4af"/>
                </linearGradient>
                <linearGradient id="amberGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#f59e0b"/>
                  <stop offset="100%" stop-color="#fde68a"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Legend numbers -->
          <div class="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
            <div class="text-center">
              <p class="text-lg font-bold text-teal-700">{{ stats()?.totalUsers ?? 0 }}</p>
              <p class="text-xs text-slate-400">Users</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-indigo-600">{{ stats()?.totalProducts ?? 0 }}</p>
              <p class="text-xs text-slate-400">Products</p>
            </div>

            <div class="text-center">
              <p class="text-lg font-bold text-rose-500">{{ stats()?.totalOrders ?? 0 }}</p>
              <p class="text-xs text-slate-400">Orders</p>
            </div>
          </div>
        </div>

        <!-- Donut Chart — System Status -->
        <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
          <div class="mb-4">
            <h3 class="text-base font-bold text-slate-900">System Health</h3>
            <p class="text-sm text-slate-500 mt-0.5">Platform distribution</p>
          </div>

          <!-- SVG Donut -->
          <div class="flex-1 flex items-center justify-center relative my-2">
            <svg viewBox="0 0 160 160" class="w-40 h-40">
              <!-- Background track -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f1f5f9" stroke-width="20"/>
              <!-- Users segment (teal) - 0 to products/total -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#0d9488" stroke-width="20"
                      stroke-dasharray="377" stroke-dashoffset="0"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalUsers ?? 1, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Products segment (indigo) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#6366f1" stroke-width="20"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalProducts ?? 0, totalPlatformItems())"
                      [attr.stroke-dashoffset]="donutOffset(stats()?.totalUsers ?? 0, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Orders segment (rose) -->
              <circle cx="80" cy="80" r="60" fill="none" stroke="#f43f5e" stroke-width="20"
                      [attr.stroke-dasharray]="donutSegment(stats()?.totalOrders ?? 0, totalPlatformItems())"
                      [attr.stroke-dashoffset]="donutOffset2(stats()?.totalUsers ?? 0, stats()?.totalProducts ?? 0, totalPlatformItems())"
                      stroke-linecap="round"
                      style="transform: rotate(-90deg); transform-origin: 80px 80px; transition: all 0.8s ease;"/>
              <!-- Center text -->
              <text x="80" y="75" text-anchor="middle" font-size="22" font-weight="700" fill="#0f172a">{{ totalPlatformItems() }}</text>
              <text x="80" y="90" text-anchor="middle" font-size="9" fill="#94a3b8">Total Records</text>
            </svg>
          </div>

          <!-- Legend -->
          <div class="space-y-2.5 mt-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-teal-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Users</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalUsers ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-indigo-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Products</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalProducts ?? 0 }}</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <div class="w-3 h-3 rounded-full bg-rose-500 flex-shrink-0"></div>
                <span class="text-sm text-slate-600">Orders</span>
              </div>
              <span class="text-sm font-bold text-slate-900">{{ stats()?.totalOrders ?? 0 }}</span>
            </div>
          </div>
        </div>
        </div>
      }

      <!-- Recent Users Table + Quick Actions -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

        @if (isAdminOrSuperAdmin()) {
          <!-- Recent Users -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div class="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-base font-bold text-slate-900">Recent Users</h3>
            <a routerLink="/admin/users" class="text-sm font-medium text-teal-600 hover:text-teal-700 transition-colors">View all →</a>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm whitespace-nowrap">
              <thead class="bg-slate-50/70 text-slate-500 border-b border-slate-100">
                <tr>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">User</th>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Roles</th>
                  <th class="px-6 py-3.5 font-semibold text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-slate-700">
                @for (user of recentUsers(); track user.id) {
                  <tr class="hover:bg-slate-50/60 transition-colors">
                    <td class="px-6 py-3.5">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                          {{ user.firstName[0] }}{{ user.lastName[0] }}
                        </div>
                        <div>
                          <p class="font-semibold text-slate-800 text-sm">{{ user.firstName }} {{ user.lastName }}</p>
                          <p class="text-xs text-slate-400">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-3.5">
                      <div class="flex gap-1 flex-wrap">
                        @for (role of user.roles; track role) {
                          <span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold"
                                [class.bg-purple-100]="role === 'SuperAdmin'" [class.text-purple-700]="role === 'SuperAdmin'"
                                [class.bg-teal-100]="role === 'Admin'" [class.text-teal-700]="role === 'Admin'"
                                [class.bg-amber-100]="role === 'Seller'" [class.text-amber-700]="role === 'Seller'"
                                [class.bg-slate-100]="role === 'User'" [class.text-slate-600]="role === 'User'">
                            {{ role }}
                          </span>
                        }
                      </div>
                    </td>
                    <td class="px-6 py-3.5 text-slate-400 text-xs">{{ user.createdAt | date:'MMM d, y' }}</td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="3" class="px-6 py-10 text-center text-slate-400 text-sm">No users yet</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
        }

        <!-- Quick Actions & System Info -->
        <div class="space-y-4" [class.lg:col-span-3]="!isAdminOrSuperAdmin()">

          <!-- Quick Actions -->
          <div class="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <h3 class="text-base font-bold text-slate-900 mb-4">Quick Actions</h3>
            <div class="space-y-2" [class.grid]="!isAdminOrSuperAdmin()" [class.grid-cols-2]="!isAdminOrSuperAdmin()" [class.gap-4]="!isAdminOrSuperAdmin()">
              
              @if (isAdminOrSuperAdmin()) {
                <a routerLink="/admin/users"
                   class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                  <div class="w-9 h-9 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center group-hover:bg-teal-100 transition-colors">
                    <svg class="w-4.5 h-4.5 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                  </div>
                  <div>
                    <p class="text-sm font-semibold">Manage Users</p>
                    <p class="text-xs text-slate-400">View & assign roles</p>
                  </div>
                  <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
                </a>
              }

              <a routerLink="/admin/products"
                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                <div class="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold">Review Products</p>
                  <p class="text-xs text-slate-400">
                    All products are active
                  </p>
                </div>
                <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>

              <a routerLink="/"
                 class="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 text-slate-700 transition-colors group">
                <div class="w-9 h-9 rounded-lg bg-rose-50 text-rose-500 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                </div>
                <div>
                  <p class="text-sm font-semibold">Visit Store</p>
                  <p class="text-xs text-slate-400">Go to customer view</p>
                </div>
                <svg class="w-4 h-4 ml-auto text-slate-300 group-hover:text-slate-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
              </a>
            </div>
          </div>

          <!-- Removed Role Permissions Summary per user request -->
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly stats = signal<AdminStats | null>(null);
  readonly sellerStats = signal<SellerStats | null>(null);
  readonly recentUsers = signal<AdminUser[]>([]);

  readonly isSuperAdmin = computed(() =>
    this.authService.user()?.roles?.includes('SuperAdmin') ?? false
  );

  readonly isAdminOrSuperAdmin = computed(() =>
    this.authService.user()?.roles?.some(r => r === 'Admin' || r === 'SuperAdmin') ?? false
  );

  readonly totalPlatformItems = computed(() => {
    const s = this.stats();
    if (!s) return 1;
    return (s.totalUsers + s.totalProducts + s.totalOrders) || 1;
  });

  readonly maxStat = computed(() => {
    const s = this.stats();
    if (!s) return 1;
    return Math.max(s.totalUsers, s.totalProducts, s.totalOrders, s.pendingProducts, 1);
  });

  readonly pendingPercent = computed(() => {
    const s = this.stats();
    if (!s || !s.totalProducts) return 0;
    return Math.round((s.pendingProducts / s.totalProducts) * 100);
  });

  
  barHeight(value: number | undefined, max: number): number {
    if (!value || !max) return 4;
    return Math.max(4, Math.round((value / max) * 160));
  }

  
  private readonly CIRC = 2 * Math.PI * 60;

  donutSegment(value: number, total: number): string {
    const frac = total > 0 ? value / total : 0;
    const seg = frac * this.CIRC;
    return `${seg} ${this.CIRC - seg}`;
  }

  donutOffset(prevValue: number, total: number): number {
    const frac = total > 0 ? prevValue / total : 0;
    return -(frac * this.CIRC);
  }

  donutOffset2(v1: number, v2: number, total: number): number {
    const frac = total > 0 ? (v1 + v2) / total : 0;
    return -(frac * this.CIRC);
  }

  ngOnInit(): void {
    if (this.isAdminOrSuperAdmin()) {
      this.adminService.getStats().subscribe({
        next: stats => this.stats.set(stats),
        error: () => this.stats.set(null)
      });
      this.adminService.getRecentUsers(5).subscribe({
        next: users => this.recentUsers.set(users || []),
        error: () => this.recentUsers.set([])
      });
    } else {
      this.adminService.getSellerStats().subscribe({
        next: stats => this.sellerStats.set(stats),
        error: () => this.sellerStats.set(null)
      });
    }
  }
}

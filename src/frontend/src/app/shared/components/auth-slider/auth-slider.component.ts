import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-auth-slider',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-[340px] relative mx-auto mt-8 mb-12 h-[170px]">
      
      <!-- The Slider Track -->
      <div class="w-full h-full relative">
        <div *ngFor="let card of cards; let i = index" 
             class="absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] origin-center" 
             [ngStyle]="getCardStyle(i)">
          
          <div class="relative backdrop-blur-2xl p-5 rounded-2xl shadow-2xl w-full h-full border flex flex-col justify-between"
               [ngClass]="card.bgClass">
            
            <div class="flex gap-4 items-start mb-2">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                   [ngClass]="card.iconBgClass">
                <i class="w-6 h-6 flex items-center justify-center" [ngClass]="card.iconColorClass" [innerHTML]="card.icon"></i>
              </div>
              <div>
                <div class="text-white font-bold text-lg leading-tight">{{ card.title }}</div>
                <div class="text-sm mt-1" [ngClass]="card.subtitleColorClass">{{ card.subtitle }}</div>
              </div>
            </div>
            
            <div class="flex justify-between items-end mt-auto">
              <div class="text-sm font-medium text-white/90 leading-snug" [innerHTML]="card.description"></div>
            </div>
            
          </div>
        </div>
      </div>

      <!-- Floating Buttons -->
      <button type="button" (click)="prevCard()" class="absolute -left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95" style="z-index: 40;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      </button>
      <button type="button" (click)="nextCard()" class="absolute -right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white backdrop-blur-md transition-all duration-300 border border-white/20 shadow-[0_4px_12px_rgba(0,0,0,0.2)] hover:scale-110 active:scale-95" style="z-index: 40;">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>

      <!-- Slider Dots -->
      <div class="absolute -bottom-8 left-0 right-0 flex justify-center gap-1.5 flex-wrap px-4">
        <button type="button" *ngFor="let dot of cards; let i = index" 
                (click)="currentCardIndex.set(i)"
                class="h-2 rounded-full transition-all duration-300 ease-out"
                [class.bg-teal-400]="currentCardIndex() === i"
                [class.w-4]="currentCardIndex() === i"
                [class.w-2]="currentCardIndex() !== i"
                [class.bg-white]="currentCardIndex() !== i"
                [class.opacity-40]="currentCardIndex() !== i"
                [class.hover:opacity-70]="currentCardIndex() !== i">
        </button>
      </div>
    </div>
  `
})
export class AuthSliderComponent {
  currentCardIndex = signal(0);

  cards = [
    {
      title: 'Premium Quality',
      subtitle: 'Verified Products',
      description: 'We ensure all products meet the highest quality standards before reaching you.',
      bgClass: 'bg-white/10 border-white/20',
      iconBgClass: 'bg-teal-500/20 border-teal-500/30',
      iconColorClass: 'text-teal-300',
      subtitleColorClass: 'text-teal-200/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>'
    },
    {
      title: 'Lightning Fast',
      subtitle: 'Express Delivery',
      description: 'Get your orders delivered to your doorstep in record time.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-amber-500/20 border-amber-500/30',
      iconColorClass: 'text-amber-300',
      subtitleColorClass: 'text-amber-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>'
    },
    {
      title: 'Endless Variety',
      subtitle: 'From Electronics to Home',
      description: 'Explore thousands of items across multiple categories all in one place.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-blue-500/20 border-blue-500/30',
      iconColorClass: 'text-blue-300',
      subtitleColorClass: 'text-blue-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>'
    },
    {
      title: 'Built by',
      subtitle: 'Mohammad Alghazo',
      description: 'Budgetha is passionately crafted to deliver a seamless shopping experience.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-rose-500/20 border-rose-500/30',
      iconColorClass: 'text-rose-300',
      subtitleColorClass: 'text-rose-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>'
    },
    {
      title: 'Secure Payments',
      subtitle: '100% Protected',
      description: 'Your transactions are guarded with industry-leading encryption.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-emerald-500/20 border-emerald-500/30',
      iconColorClass: 'text-emerald-300',
      subtitleColorClass: 'text-emerald-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>'
    },
    {
      title: 'Connect with Me',
      subtitle: 'LinkedIn',
      description: 'Visit my LinkedIn profile to connect and see my professional background.',
      bgClass: 'bg-[#0a66c2]/20 border-[#0a66c2]/30',
      iconBgClass: 'bg-white/10 border-white/20',
      iconColorClass: 'text-white',
      subtitleColorClass: 'text-white/70',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>'
    },
    {
      title: 'Open Source',
      subtitle: 'GitHub',
      description: 'Check out the source code and other projects on my GitHub.',
      bgClass: 'bg-slate-800 border-slate-600',
      iconBgClass: 'bg-white/10 border-white/20',
      iconColorClass: 'text-white',
      subtitleColorClass: 'text-slate-400',
      icon: '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>'
    },
    {
      title: 'My Portfolio',
      subtitle: 'See My Work',
      description: 'Discover more about my skills, projects, and contact information.',
      bgClass: 'bg-indigo-900/80 border-indigo-500/30',
      iconBgClass: 'bg-indigo-500/20 border-indigo-500/30',
      iconColorClass: 'text-indigo-300',
      subtitleColorClass: 'text-indigo-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>'
    },
    {
      title: 'Reliable Sellers',
      subtitle: 'Trusted Partners',
      description: 'We carefully vet all sellers to ensure a trustworthy shopping environment.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-purple-500/20 border-purple-500/30',
      iconColorClass: 'text-purple-300',
      subtitleColorClass: 'text-purple-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>'
    },
    {
      title: '24/7 Support',
      subtitle: 'Always Here',
      description: 'Got questions? Contact the creator or our support team anytime.',
      bgClass: 'bg-slate-800/80 border-white/10',
      iconBgClass: 'bg-cyan-500/20 border-cyan-500/30',
      iconColorClass: 'text-cyan-300',
      subtitleColorClass: 'text-cyan-300/70',
      icon: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>'
    }
  ];

  get totalCards() { return this.cards.length; }

  prevCard(): void {
    this.currentCardIndex.update(i => (i - 1 + this.totalCards) % this.totalCards);
  }

  nextCard(): void {
    this.currentCardIndex.update(i => (i + 1) % this.totalCards);
  }

  getCardStyle(index: number) {
    const diff = (index - this.currentCardIndex() + this.totalCards) % this.totalCards;
    
    if (diff === 0) {
      return { transform: 'translateX(0) scale(1)', zIndex: 30, opacity: 1, visibility: 'visible' };
    } else if (diff === 1) {
      return { transform: 'translateX(60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else if (diff === this.totalCards - 1) {
      return { transform: 'translateX(-60%) scale(0.85)', zIndex: 20, opacity: 0.5, visibility: 'visible' };
    } else {
      return { transform: 'translateX(0) scale(0.7)', zIndex: 10, opacity: 0, visibility: 'hidden' };
    }
  }
}

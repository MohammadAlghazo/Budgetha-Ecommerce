import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { PwaService } from './core/services/pwa.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Instantiated at the root so install prompts, service-worker update notices,
  // and online/offline tracking are active on every page — including the auth
  // pages, which render outside the main shell.
  private readonly pwa = inject(PwaService);
}

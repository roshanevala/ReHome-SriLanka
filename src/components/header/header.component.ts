
import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, CommonModule],
})
export class HeaderComponent implements OnInit {
  private authService = inject(AuthService);
  
  isMobileMenuOpen = signal(false);
  isAdmin = signal(false);

  async ngOnInit() {
    // Check if user is admin
    this.authService.user$.subscribe(async (user) => {
      if (user) {
        const adminStatus = await this.authService.isAdmin();
        this.isAdmin.set(adminStatus);
      } else {
        this.isAdmin.set(false);
      }
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }
}

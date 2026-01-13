
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthHelper } from '../../core/helpers/auth.helper';
import { PushNotificationService } from '../../core/services/push-notification.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input({ required: true }) appTitle!: string;
  @Input() isUserProfileDropdownOpen = false;
  @Input() currentUser = {
    name: 'Zubayer Ahamed',
    email: 'zubayer@example.com',
    avatar: '/assets/images/zubayer.jpg',
  };

  @Output() toggleUserProfileDropdown = new EventEmitter<void>();
  @Output() closeUserProfileDropdown = new EventEmitter<void>();
  @Output() userProfileDropdownBackdropClick = new EventEmitter<void>();
  @Output() openProfileSettings = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() toggleSidebar = new EventEmitter<void>();

  private pushService = inject(PushNotificationService);

  onToggleUserProfileDropdown() {
    this.toggleUserProfileDropdown.emit();
  }

  userProfileDropdownClose() {
    this.closeUserProfileDropdown.emit();
  }

  onUserProfileDropdownBackdropClick(event: Event) {
    if (event.target === event.currentTarget) {
      this.userProfileDropdownClose();
    }
  }

  onOpenProfileSettings() {
    this.openProfileSettings.emit();
  }

  onLogout() {
    this.logout.emit();
  }

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  private urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    const rawData = atob(base64);
    return new Uint8Array([...rawData].map((char) => char.charCodeAt(0)));
  }

  allowPushNotification() {
    const userId = AuthHelper.getJwtPayloads()?.sub;
    if(userId == null) return;

    console.log(userId);

    this.pushService.registerServiceWorker();

    // this.pushService.subscribeToPush(userId)
    //   .then(() => alert("✅ Subscribed"))
    //   .catch(err => console.error("❌ Subscription failed", err));
  }

}


import { Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthHelper } from '../../core/helpers/auth.helper';
import { PushNotificationService } from '../../core/services/push-notification.service';
import { UserDto } from '../../core/models/user.model';
import { UserService } from '../../core/services/user.service';

@Component({
    selector: 'app-header',
    imports: [RouterLink],
    templateUrl: './header.html',
    styleUrl: './header.css',
})
export class Header implements OnInit {
    @Input() isUserProfileDropdownOpen = false;

    @Output() toggleUserProfileDropdown = new EventEmitter<void>();
    @Output() closeUserProfileDropdown = new EventEmitter<void>();
    @Output() userProfileDropdownBackdropClick = new EventEmitter<void>();
    @Output() openProfileSettings = new EventEmitter<void>();
    @Output() logout = new EventEmitter<void>();
    @Output() toggleSidebar = new EventEmitter<void>();

    private destroyRef = inject(DestroyRef);
    private pushService = inject(PushNotificationService);
    private userService = inject(UserService);

    // Global variables
    appTitle: string = 'TASKNEST';
    currentUser: UserDto = {} as UserDto;

    ngOnInit() {
        this.loadUserDetails();
    }

    loadUserDetails() {
        const userDetails = AuthHelper.getJwtPayloads();

        const userSubs = this.userService.findUser(userDetails?.userId ?? -1).subscribe({
            next: (response) => {
                this.currentUser = response.data;
                this.currentUser.fullName = this.currentUser.firstName + ' ' + this.currentUser.lastName;
                this.currentUser.avatar = '/assets/images/dummy-user.png';
            },
            error: (error) => {
                console.error('Error fetching user data:', error);
            },
        });

        this.destroyRef.onDestroy(() => {
            userSubs.unsubscribe();
        });
    }



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
        if (userId == null) return;

        console.log(userId);

        this.pushService.registerServiceWorker();

        // this.pushService.subscribeToPush(userId)
        //   .then(() => alert("✅ Subscribed"))
        //   .catch(err => console.error("❌ Subscription failed", err));
    }

}

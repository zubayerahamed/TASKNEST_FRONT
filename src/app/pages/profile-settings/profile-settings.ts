import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { UserDto } from '../../core/models/user.model';
import { AuthHelper } from '../../core/helpers/auth.helper';
import { FormsModule } from '@angular/forms';
import { FlatpickrDirective, provideFlatpickrDefaults } from 'angularx-flatpickr';

@Component({
    selector: 'app-profile-settings',
    imports: [FormsModule, FlatpickrDirective],
    providers: [provideFlatpickrDefaults()],
    templateUrl: './profile-settings.html',
    styleUrl: './profile-settings.css',
    host: {
        class: 'content-area flex-grow-1 d-flex flex-column gap-4',
    },
})
export class ProfileSettings implements OnInit {

    private destroyRef = inject(DestroyRef);
    private userService = inject(UserService);

    // Global variables
    currentUser: UserDto = {} as UserDto;

    // Form variables
    enteredFirstName: string = '';
    enteredLastName: string = '';
    enteredCountry: string = '';
    enteredPhone: string = '';
    enteredLocation: string = '';
    enteredBirthday: Date | null = null;

    // Error variables 
    firstNameError: string = '';
    lastNameError: string = '';

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

                this.enteredFirstName = this.currentUser.firstName;
                this.enteredLastName = this.currentUser.lastName;
                this.enteredCountry = this.currentUser.country;
                this.enteredPhone = this.currentUser.phone;
                this.enteredLocation = this.currentUser.location;
                this.enteredBirthday = this.currentUser.dateOfBirth;
            },
            error: (error) => {
                console.error('Error fetching user data:', error);
            },
        });

        this.destroyRef.onDestroy(() => {
            userSubs.unsubscribe();
        });
    }

    onFileSelected(event: Event){

    }

}

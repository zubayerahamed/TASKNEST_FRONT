import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InvitationService } from '../../core/services/invitation.service';
import { AlertService } from '../../core/services/alert.service';
import { Inviation, UpdateInvitation } from '../../core/models/invitation.model';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MemberService } from '../../core/services/member.service';
import { Member } from '../../core/models/member.model';

@Component({
    selector: 'app-members',
    standalone: true,
    imports: [FormsModule, DatePipe],
    templateUrl: './members.html',
    styleUrl: './members.css',
    host: {
        class: 'content-area flex-grow-1 d-flex flex-column gap-4',
    },
})
export class Members implements OnInit {

    private destroyRef = inject(DestroyRef);
    private activatedRoute = inject(ActivatedRoute);
    private alertService = inject(AlertService);
    private invitationService = inject(InvitationService);
    private memberService = inject(MemberService);

    // Global variables
    invitations: Inviation[] = [];
    members: Member[] = [];

    // Form fields
    enteredMemberEmail: string = '';

    ngOnInit(): void {
        // Initialization logic if needed
        this.loadAllInvitations();
    }

    loadAllInvitations() {
        const invSubs = this.invitationService.getAllInvitations().subscribe({
            next: (response) => {
                this.invitations = response.data || [];
            },
            error: (error) => {
                console.error('Error fetching invitations:', error);
                this.alertService.error(
                    'Error!',
                    error?.error?.message || 'Failed to load invitations.'
                );
            }
        });

        this.destroyRef.onDestroy(() => {
            invSubs.unsubscribe();
        });


        // Load All Members as well
        const memSubs = this.memberService.getAllWorkspaceMembers().subscribe({
            next: (response) => {
                console.log('Workspace Members:', response.data);
                this.members = response.data || [];
            },
            error: (error) => {
                console.error('Error fetching workspace members:', error);
            }
        });

        this.destroyRef.onDestroy(() => {
            memSubs.unsubscribe();
        });

    }

    inviteGuest() {
        console.log('Inviting guest with email:', this.enteredMemberEmail);
        // Add invitation logic here

        const invCreateSubs = this.invitationService.createInvitation({ email: this.enteredMemberEmail }).subscribe({
            next: (response) => {
                console.log('Invitation sent successfully:', response);
                this.alertService.success('Success!', 'Invitation sent successfully!');

                // Load the table again or update the UI as needed
                this.loadAllInvitations();
                this.enteredMemberEmail = '';
            },
            error: (error) => {
                console.error('Error sending invitation:', error);
                this.alertService.error(
                    'Error!',
                    error?.error?.message || 'Failed to send invitation.'
                );
            }
        });

        this.destroyRef.onDestroy(() => {
            invCreateSubs.unsubscribe();
        });
    }

    resendInvitation(email: string) {
        console.log('Resending invitation to email:', email);
        // Add resend invitation logic here
        const updateData: UpdateInvitation = { 
            email: email
         };

        const invResendSubs = this.invitationService.updateInvitation(updateData).subscribe({
            next: (response) => {
                console.log('Invitation resent successfully:', response);
                this.alertService.success('Success!', 'Invitation resent successfully!');

                // Load the table again or update the UI as needed
                this.loadAllInvitations();
            },
            error: (error) => {
                console.error('Error resending invitation:', error);
                this.alertService.error(
                    'Error!',
                    error?.error?.message || 'Failed to resend invitation.'
                );
            }
        });

        this.destroyRef.onDestroy(() => {
            invResendSubs.unsubscribe();
        });
    }

    deleteInvitation(email: string) {
        console.log('Deleting invitation for email:', email);
        // Add delete invitation logic here
        const invDeleteSubs = this.invitationService.deleteInvitation(email).subscribe({
            next: (response) => {
                console.log('Invitation deleted successfully:', response);
                this.alertService.success('Success!', 'Invitation deleted successfully!');

                // Load the table again or update the UI as needed
                this.loadAllInvitations();
            },
            error: (error) => {
                console.error('Error deleting invitation:', error);
                this.alertService.error(
                    'Error!',
                    error?.error?.message || 'Failed to delete invitation.'
                );
            }
        });

        this.destroyRef.onDestroy(() => {
            invDeleteSubs.unsubscribe();
        });
    }
}
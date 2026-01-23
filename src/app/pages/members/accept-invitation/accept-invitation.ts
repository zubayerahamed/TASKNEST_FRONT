import { Component, DestroyRef, inject, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../../../core/services/alert.service';
import { InvitationService } from '../../../core/services/invitation.service';

@Component({
    selector: 'app-accept-invitation',
    imports: [],
    templateUrl: './accept-invitation.html',
    styleUrl: './accept-invitation.css',
})
export class AcceptInvitation implements OnInit, OnChanges {

    public token!: string;

    private destroyRef = inject(DestroyRef);
    private activatedRoute = inject(ActivatedRoute);
    private alertService = inject(AlertService);
    private invitationService = inject(InvitationService);

    constructor(private router: Router) {
       
    }

    ngOnInit(): void {
        // Initialization logic if needed
        // Subscribe to route parameter changes to handle navigation between different projects
        const routeParamsSub = this.activatedRoute.params.subscribe(params => {
            const invitationToken = params['token'];
            if (invitationToken) {
                this.token = invitationToken;

                const invitationAcceptSub = this.invitationService.acceptInvitation(this.token).subscribe({
                    next: (response) => {
                        this.alertService.success('Invitation Accepted', 'You have successfully joined the workspace.');
                        this.router.navigate(['/']);
                        location.reload();
                    },
                    error: (error) => {
                        console.error('Error accepting invitation:', error);
                        this.alertService.error(
                            'Error!',
                            error?.error?.message || 'Failed to accept the invitation.'
                        );
                    }
                });

                this.destroyRef.onDestroy(() => {
                    invitationAcceptSub.unsubscribe();
                });

            }
        });

        // Clean up subscription when component is destroyed
        this.destroyRef.onDestroy(() => {
            routeParamsSub.unsubscribe();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Handle any changes if necessary
        // if (changes['token'] && this.token && this.token != null) {
        //     console.log(this.token);

        //     this.alertService.info('Accepting Invitation', 'Processing your invitation acceptance...');

        // }
    }
}

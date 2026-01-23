import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateWorkflow, UpdateWorkflow } from '../models/workflow.model';
import { CreateInvitation, UpdateInvitation } from '../models/invitation.model';

@Injectable({
    providedIn: 'root',
})
export class InvitationService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    getAllInvitations(): Observable<any> {
        return this.http.get(`${this.baseUrl}/invitations`);
    }

    createInvitation(data: CreateInvitation): Observable<any> {
        return this.http.post(`${this.baseUrl}/invitations`, data);
    }

    updateInvitation(data: UpdateInvitation): Observable<any> {
        return this.http.put(`${this.baseUrl}/invitations`, data);
    }

    deleteInvitation(email: string): Observable<any> {
        return this.http.delete(`${this.baseUrl}/invitations/${email}`);
    }

    acceptInvitation(token: string): Observable<any> {
        return this.http.get(`${this.baseUrl}/invitations/${token}/accept`);
    }
}

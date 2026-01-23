import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateWorkflow, UpdateWorkflow } from '../models/workflow.model';
import { CreateInvitation, UpdateInvitation } from '../models/invitation.model';

@Injectable({
    providedIn: 'root',
})
export class MemberService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    getAllWorkspaceMembers(): Observable<any> {
        return this.http.get(`${this.baseUrl}/members`);
    }

}

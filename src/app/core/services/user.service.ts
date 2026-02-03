import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root',
})
export class UserService extends BaseService {
    constructor(private http: HttpClient) {
        super();
    }

    findUser(id: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/users/${id}`);
    }

}
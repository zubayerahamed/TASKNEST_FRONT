import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class DocumentService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  uploadDocument(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/documents/upload`, data);
  }

  deleteDocument(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/documents/${id}`);
  }
}
import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { HttpClient } from "@angular/common/http";
import { AddEventRepeater } from "../models/event-repeater.model";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root',
})
export class EventRepeaterService extends BaseService {

    constructor(private http: HttpClient) {
        super();
    }


    createEventRepeater(data: AddEventRepeater): Observable<any> {
        return this.http.post(`${this.baseUrl}/event-repeaters`, data);
    }
}
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class RepeaterStateService{
    private modalOpen = new BehaviorSubject<any>(null);
    isModalOpen$ = this.modalOpen.asObservable();

    updateModalStatus(data: any){
        this.modalOpen.next(data);
    }

}
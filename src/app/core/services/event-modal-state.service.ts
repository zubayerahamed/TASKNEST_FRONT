import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventDto } from '../models/event.model';

@Injectable({
    providedIn: 'root',
})
export class EventModalStateService {
    private isModalOpen = new BehaviorSubject<boolean>(false);
    private selectedEvent = new BehaviorSubject<EventDto | null>(null);
    isModalOpen$ = this.isModalOpen.asObservable();
    selectedEvent$ = this.selectedEvent.asObservable();

    openModal(event: EventDto | null = null) {
        this.isModalOpen.next(true);
        this.selectedEvent.next(event);
    }

    closeModal() {
        this.isModalOpen.next(false);
        this.selectedEvent.next(null);
    }
}

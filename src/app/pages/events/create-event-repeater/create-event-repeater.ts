import { Component, DestroyRef, inject, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { EventRepeaterModalStateService } from '../../../core/services/event-repeater-modal-state.service';
import { AsyncPipe } from '@angular/common';
import {
  FlatpickrDirective,
  provideFlatpickrDefaults,
} from 'angularx-flatpickr';

@Component({
  selector: 'app-create-event-repeater',
  imports: [FormsModule, FlatpickrDirective, AsyncPipe],
  providers: [provideFlatpickrDefaults()],
  templateUrl: './create-event-repeater.html',
  styleUrl: './create-event-repeater.css'
})
export class CreateEventRepeater {

  private destroyRef = inject(DestroyRef);
  private repeaterStateService = inject(EventRepeaterModalStateService);

  // State observables
  isOpenModal$ = this.repeaterStateService.isModalOpen$;


  daysInMonth: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  // Form Data
  enteredRepeatEvery: number = 1;
  enteredRepeatType: string = 'DAY';
  enteredSkipWeekends: boolean = false;
  enteredDataType: string = 'FIXED_DATE';

  enteredStartDate: string = new Date().toISOString().split('T')[0];
  enteredEndDate: string = new Date().toISOString().split('T')[0];

 

  ngOnInit() {
    const repeaterStateSubs = this.repeaterStateService.isModalOpen$.subscribe({
      next: (data) => {
        this.initializeDateTime();
      },
    });

    this.destroyRef.onDestroy(() => {
      repeaterStateSubs.unsubscribe();
    });
  }

  onCloseRepeater(){
    this.repeaterStateService.closeModal();
  }

  initializeDateTime() {
    const now = new Date();
    this.enteredStartDate = now.toISOString().split('T')[0];
    this.enteredEndDate = now.toISOString().split('T')[0];
  }
}

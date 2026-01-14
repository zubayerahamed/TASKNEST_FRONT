import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RepeaterStateService } from '../../../core/services/repeater-state.service';

@Component({
  selector: 'app-create-event-repeater',
  imports: [FormsModule],
  templateUrl: './create-event-repeater.html',
  styleUrl: './create-event-repeater.css'
})
export class CreateEventRepeater {

  @Input() isRepeaterModalOpen!: boolean;

  private repeaterStateService = inject(RepeaterStateService);


  daysInMonth: number[] = Array.from({ length: 31 }, (_, i) => i + 1);

  // Form Data
  enteredRepeatEvery: number = 1;
  enteredRepeatType: string = 'DAY';
  enteredSkipWeekends: boolean = false;
  enteredDataType: string = 'FIXED_DATE';

  enteredStartDate: string = new Date().toISOString().split('T')[0];
  enteredEndDate: string = new Date().toISOString().split('T')[0];

  onCloseRepeater(){
    this.repeaterStateService.updateModalStatus('CLOSE');
  }

  ngOnInit() {
 
  }
}

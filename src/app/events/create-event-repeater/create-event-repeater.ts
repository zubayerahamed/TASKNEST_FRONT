import { Component, inject, Input } from '@angular/core';
import { RepeaterStateService } from '../../core/services/repeater-state.service';

@Component({
  selector: 'app-create-event-repeater',
  imports: [],
  templateUrl: './create-event-repeater.html',
  styleUrl: './create-event-repeater.css'
})
export class CreateEventRepeater {

  @Input() isRepeaterModalOpen!: boolean;

  private repeaterStateService = inject(RepeaterStateService);

  onCloseRepeater(){
    this.repeaterStateService.updateModalStatus('CLOSE');
  }
}

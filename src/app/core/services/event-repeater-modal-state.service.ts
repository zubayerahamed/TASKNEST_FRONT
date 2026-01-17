import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventRepeater } from '../models/event-repeater.model';
import { EventRepeatType } from '../enums/event-repeat-type.enum';
import { DataType } from '../enums/data-type.enum';

@Injectable({
    providedIn: 'root',
})
export class EventRepeaterModalStateService {
    private isModalOpen = new BehaviorSubject<boolean>(false);
    private eventRepeaterObject = new BehaviorSubject<EventRepeater | null>(null);
    private repeaterDetails = new BehaviorSubject<string>('');
    isModalOpen$ = this.isModalOpen.asObservable();
    eventRepeaterObject$ = this.eventRepeaterObject.asObservable();
    repeaterDetails$ = this.repeaterDetails.asObservable();

    openModal() {
        this.isModalOpen.next(true);
    }

    closeModal() {
        this.isModalOpen.next(false);
    }

    toggleModal() {
        this.isModalOpen.next(!this.isModalOpen.value);
    }

    setEventRepeaterObject(repeater: EventRepeater | null) {
        this.eventRepeaterObject.next(repeater);
        if (repeater != null) {
            var msg = "";

            if (repeater.repeatType === EventRepeatType.DAY) {
                const workdaysOnly = repeater.skipWeekends ? "workday" : "day";
                msg = "Repeats every " + repeater.repeatEvery + " " + workdaysOnly + " from ";
                msg += this.formatUiDate(repeater.startDate);
                msg += " to " + this.formatUiDate(repeater.endDate);
            } else if (repeater.repeatType === EventRepeatType.WEEK) {
                msg = "Repeats every " + repeater.repeatEvery + " week(s) on: ";
                const days: string[] = [];
                if (repeater.daysSun) days.push("Sunday");
                if (repeater.daysMon) days.push("Monday");
                if (repeater.daysTue) days.push("Tuesday");
                if (repeater.daysWed) days.push("Wednesday");
                if (repeater.daysThu) days.push("Thursday");
                if (repeater.daysFri) days.push("Friday");
                if (repeater.daysSat) days.push("Saturday");
                msg += days.join(", ");
                msg += " from " + this.formatUiDate(repeater.startDate);
                msg += " to " + this.formatUiDate(repeater.endDate);
            } else if (repeater.repeatType === EventRepeatType.MONTH) {
                msg = "Repeats every " + repeater.repeatEvery + " month(s) on the ";

                if (repeater.dataType === DataType.FIXED_DATE) {
                    repeater.fixedDates.split(',').forEach((dateStr, index, arr) => {
                        msg += this.dateWithSuffix(parseInt(dateStr.trim()));
                        if (index < arr.length - 1) {
                            msg += ", ";
                        }
                    });
                } else {
                    msg += repeater.weekDayPosition + " " + repeater.weekDay;
                }

                msg += " from ";
                msg += this.formatUiDate(repeater.startDate);
                msg += " to " + this.formatUiDate(repeater.endDate);
            } else if (repeater.repeatType === EventRepeatType.YEAR) {
                msg = "Repeats every " + repeater.repeatEvery + " year on ";
                if (repeater.dataType === DataType.FIXED_DATE) {
                    msg += repeater.fixedMonth + " " + this.dateWithSuffix(parseInt(repeater.fixedDate));
                } else {
                    msg += repeater.weekDayPosition + " " + repeater.weekDay + " of " + repeater.weekDayOfMonth;
                }

                msg += " from ";
                msg += this.formatUiDate(repeater.startDate);
                msg += " to " + this.formatUiDate(repeater.endDate);
            }

            this.repeaterDetails.next(msg);
        } else {
            this.repeaterDetails.next('');
        }
    }

    dateWithSuffix(date: number): string {
        let suffix = 'th';
        if (date % 10 === 1 && date !== 11) {
            suffix = 'st';
        } else if (date % 10 === 2 && date !== 12) {
            suffix = 'nd';
        } else if (date % 10 === 3 && date !== 13) {
            suffix = 'rd';
        }
        return date + suffix;
    }

    formatUiDate(date: Date | string): string {
        return new Date(date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    }
}

import { Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventRepeaterModalStateService } from '../../../core/services/event-repeater-modal-state.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import {
    FlatpickrDirective,
    provideFlatpickrDefaults,
} from 'angularx-flatpickr';
import { EventRepeaterService } from '../../../core/services/event-repeater.service';
import { AddEventRepeater } from '../../../core/models/event-repeater.model';
import { AlertService } from '../../../core/services/alert.service';
import { EventRepeatType } from '../../../core/enums/event-repeat-type.enum';
import { DataType } from '../../../core/enums/data-type.enum';
import { WeekDay } from '../../../core/enums/week-day.enum';
import { WeekDayPosition } from '../../../core/enums/week-day-position.enum';
import { WeekDayOfMonth } from '../../../core/enums/week-day-of-month.enum';

@Component({
    selector: 'app-create-event-repeater',
    imports: [FormsModule, FlatpickrDirective, AsyncPipe, TitleCasePipe],
    providers: [provideFlatpickrDefaults()],
    templateUrl: './create-event-repeater.html',
    styleUrl: './create-event-repeater.css'
})
export class CreateEventRepeater implements OnInit, OnChanges {

    private destroyRef = inject(DestroyRef);
    private alertService = inject(AlertService)
    private repeaterStateService = inject(EventRepeaterModalStateService);
    private eventRepeaterService = inject(EventRepeaterService);

    // State observables
    isOpenModal$ = this.repeaterStateService.isModalOpen$;

    // Global properties
    EventRepeatType = EventRepeatType;
    DataType = DataType;
    WeekDayPosition = WeekDayPosition;
    WeekDay = WeekDay;
    daysInMonth: number[] = this.getDaysInMonth();

    eventRepeatTypes = Object.values(EventRepeatType);
    weekDayPositions = Object.values(WeekDayPosition);
    weekDays = Object.values(WeekDay);

    // Form Data
    enteredRepeatEvery: number = 1;
    enteredRepeatType: EventRepeatType = EventRepeatType.DAY;

    // For DAY repeat type
    enteredSkipWeekends: boolean = false;

    // For WEEK repeat type
    enteredRepeatOnDays: string[] = [];

    // For MONTH repeat type
    enteredDataType: DataType = DataType.FIXED_DATE;
    enteredRepeatFixedDates: number[] = [];
    enteredWeekdayPosition: WeekDayPosition = WeekDayPosition.FIRST;
    enteredRepeatWeekday: WeekDay = WeekDay.SUN;

    // For YEAR repeat type
    enteredFixedDate: string = '1';
    enteredRepeatMonth: string = 'JAN';


    enteredStartDate: string = new Date().toISOString().split('T')[0];
    enteredEndDate: string = new Date().toISOString().split('T')[0];

    resetForm() {
        this.daysInMonth = this.getDaysInMonth();
        this.enteredRepeatEvery = 1;
        this.enteredSkipWeekends = false;
        this.enteredRepeatOnDays = [];
        this.enteredDataType = DataType.FIXED_DATE;
        this.enteredRepeatFixedDates = [];
        this.enteredWeekdayPosition = WeekDayPosition.FIRST;
        this.enteredRepeatWeekday = WeekDay.SUN;
        this.enteredRepeatMonth = 'JAN';
        this.enteredFixedDate = '1';
        
    }

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

    ngOnChanges(changes: SimpleChanges): void {
       
    }

    onCloseRepeater() {
        this.repeaterStateService.closeModal();
    }

    initializeDateTime() {
        const now = new Date();
        this.enteredStartDate = now.toISOString().split('T')[0];
        this.enteredEndDate = now.toISOString().split('T')[0];
    }

    clampRepeatEvery() {
        this.enteredRepeatEvery = Math.min(9999, Math.max(1, this.enteredRepeatEvery || 1));
    }

    repeatEveryKeyRestriction(event: KeyboardEvent) {
        const allowedKeys = [
            'Backspace',
            'Delete',
            'ArrowLeft',
            'ArrowRight',
            'Tab'
        ];

        if (allowedKeys.includes(event.key)) {
            return;
        }

        // Block space
        if (event.key === ' ') {
            event.preventDefault();
            return;
        }

        // Allow digits only
        if (!/^[0-9]$/.test(event.key)) {
            event.preventDefault();
        }
    }

    onDayToggle(day: string, event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;

        if (checked) {
            if (!this.enteredRepeatOnDays.includes(day)) {
                this.enteredRepeatOnDays.push(day);
            }
        } else {
            this.enteredRepeatOnDays = this.enteredRepeatOnDays.filter(d => d !== day);
        }
    }

    onFixedDateSelect(date: number, event: Event): void {
        const checked = (event.target as HTMLInputElement).checked;

        if (checked) {
            if (!this.enteredRepeatFixedDates.includes(date)) {
                this.enteredRepeatFixedDates.push(date);
            }
        } else {
            this.enteredRepeatFixedDates = this.enteredRepeatFixedDates.filter(d => d !== date);
        }
    }

    updateDaysInMonth() {
        this.daysInMonth = this.getDaysInMonth(this.enteredRepeatMonth);
    }

    /**
     * Get the days in a specified month and year.
     * @param monthName The name of the month (e.g., "Jan"). If not provided, the current month is used.
     * @param year The year for which to get the days in the month. Defaults to the current year.
     * @returns An array of numbers representing the days in the specified month and year.
     * 
     * Example:
     * getDaysInMonth('Feb', 2024) // returns [1, 2, 3, ..., 29]
     * getDaysInMonth() // returns days of the current month
     * this.getDaysInMonth('Feb'); // returns days of February in the current year
     */
    getDaysInMonth(monthName?: string, year: number = new Date().getFullYear()): number[] {
        let monthIndex: number;

        if (monthName) {
            const months = [
                'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
            ];

            monthIndex = months.indexOf(monthName.toLowerCase());

            if (monthIndex === -1) {
                throw new Error(`Invalid month name: ${monthName}`);
            }
        } else {
            const today = new Date();
            monthIndex = today.getMonth();
            year = today.getFullYear();
        }

        const totalDays = new Date(year, monthIndex + 1, 0).getDate();

        return Array.from({ length: totalDays }, (_, i) => i + 1);
    }

    


    // DB Operations
    onCreateRepeater() {

        const eventRepeater: AddEventRepeater = {
            parentEventId: 0,
            repeatEvery: this.enteredRepeatEvery,
            repeatType: this.enteredRepeatType,

            // For DAY repeat type
            skipWeekends: this.enteredSkipWeekends,

            // For WEEK repeat type
            daysSat: this.enteredRepeatOnDays.includes('SAT'),
            daysSun: this.enteredRepeatOnDays.includes('SUN'),
            daysMon: this.enteredRepeatOnDays.includes('MON'),
            daysTue: this.enteredRepeatOnDays.includes('TUE'),
            daysWed: this.enteredRepeatOnDays.includes('WED'),
            daysThu: this.enteredRepeatOnDays.includes('THU'),
            daysFri: this.enteredRepeatOnDays.includes('FRI'),

            // For MONTH repeat type
            dataType: this.enteredDataType,  // FIXED_DATE or WEEK_DAY_OF_MONTH or WEEK_DAY_OF_YEAR
            fixedDates: this.enteredRepeatFixedDates.join(','), // Comma-separated string of dates
            weekDayPosition: this.enteredWeekdayPosition,
            weekDay: this.enteredRepeatWeekday,

            // For YEAR repeat type
            fixedDate: this.enteredFixedDate,
            fixedMonth: this.enteredRepeatMonth,
            weekDayOfMonth: WeekDayOfMonth.JAN,
            startDate: new Date(this.enteredStartDate),
            endDate: new Date(this.enteredEndDate),
        }

        const createRepeaterSubs = this.eventRepeaterService.createEventRepeater(eventRepeater).subscribe({
            next: (response) => {
                this.alertService.success('Success!', 'Repeater created successfully!');

                // Handle success (e.g., show a success message, close modal, etc.)
                this.repeaterStateService.closeModal();
            },
            error: (error) => {
                // Handle error (e.g., show an error message)
                console.error('Error creating event repeater:', error);
                this.alertService.error(
                    'Error!',
                    'Failed to create repeater. Please try again.'
                );
            }
        });

        this.destroyRef.onDestroy(() => {
            createRepeaterSubs.unsubscribe();
        });
    }
}
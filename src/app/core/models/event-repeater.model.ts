import { DataType } from "../enums/data-type.enum";
import { EventRepeatType } from "../enums/event-repeat-type.enum";
import { WeekDayOfMonth } from "../enums/week-day-of-month.enum";
import { WeekDayPosition } from "../enums/week-day-position.enum";
import { WeekDay } from "../enums/week-day.enum";

export interface EventRepeater{
    id: number;
    parentEventId: number;
    repeatEvery: number;
    repeatType: EventRepeatType;
    skipWeekends: boolean;

    daysSat: boolean;
    daysSun: boolean;
    daysMon: boolean;
    daysTue: boolean;
    daysWed: boolean;
    daysThu: boolean;
    daysFri: boolean;

    dataType: DataType;

    fixedDates: string;
    weekDayPosition: WeekDayPosition;
    weekDay: WeekDay;

    fixedDate: string;
    fixedMonth: string;
    weekDayOfMonth: WeekDayOfMonth;

    startDate: Date;
    endDate: Date;
}

export interface AddEventRepeater {
    parentEventId: number;
    repeatEvery: number;
    repeatType: EventRepeatType;
    skipWeekends: boolean;

    daysSat: boolean;
    daysSun: boolean;
    daysMon: boolean;
    daysTue: boolean;
    daysWed: boolean;
    daysThu: boolean;
    daysFri: boolean;

    dataType: DataType;

    fixedDates: string;
    weekDayPosition: WeekDayPosition;
    weekDay: WeekDay;

    fixedDate: string;
    fixedMonth: string;
    weekDayOfMonth: WeekDayOfMonth;

    startDate: Date;
    endDate: Date;
}

export interface UpdateEventRepeater {
    id: number;
    parentEventId: number;
    repeatEvery: number;
    repeatType: EventRepeatType;
    skipWeekends: boolean;

    daysSat: boolean;
    daysSun: boolean;
    daysMon: boolean;
    daysTue: boolean;
    daysWed: boolean;
    daysThu: boolean;
    daysFri: boolean;

    dataType: DataType;

    fixedDates: string;
    weekDayPosition: WeekDayPosition;
    weekDay: WeekDay;

    fixedDate: string;
    fixedMonth: string;
    weekDayOfMonth: WeekDayOfMonth;

    startDate: Date;
    endDate: Date;
}

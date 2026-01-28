import { PerticipantType } from "../enums/perticipant-type.enum";
import { Document } from "./attached-file.model";

export interface EventDto {
    id: number;
    projectId: number;
    categoryId: number;
    title: string;
    description: string;
    eventDate: Date;
    startTime: string;
    endTime: string;
    location: string;
    isReminderEnabled: boolean;
    reminderBefore: number;
    isReminderSent: boolean;
    isCompleted: boolean;
    eventLink: string;
    checklists: EventChecklist[];
    projectName: string;
    categoryName: string;
    documents: Document[];
    participants: EventPerticipants[];
}

export interface AddEvent {
    title: string;
    description: string;
    projectId: number;
    categoryId: number;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    isReminderEnabled: boolean;
    reminderBefore: number;
    perticipants: number[];
    documents: number[];
    checklists: AddEventChecklist[];
    eventLink: string;
}

export interface UpdateEvent {
    id: number;
    title: string;
    description: string;
    projectId: number;
    categoryId: number;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    isReminderEnabled: boolean;
    reminderBefore: number;
    perticipants: number[];
    documents: number[];
    checklists: AddEventChecklist[];
    eventLink: string;
}

export interface EventChecklist {
    id: number;
    eventId: number;
    description: string;
    isCompleted: boolean;
}

export interface AddEventChecklist {
    description: string;
    isCompleted: boolean;
}

export interface EventPerticipants {
    eventId: number;
    userId: number;
    perticipantType: PerticipantType;
    isReminderSent: boolean;
    participantUser: ParticipantUser;
}

export interface ParticipantUser {
    email: string;
    firstName: string;
    lastName: string;
    thumbnail: string;
}
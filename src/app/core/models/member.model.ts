import { UserWorkspace } from "./user-workspace.model";

export interface Member {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    country: string;
    phone: string;
    location: string;
    dateOfBirth: string; // ISO string from backend
    thumbnail: string | null; // Base64 encoded
    userWorkspace: UserWorkspace | null;
}
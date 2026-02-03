export interface UserDto {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    fullName: string;
    isActive: boolean;
    country: string;
    phone: string;
    location: string;
    dateOfBirth: Date;
    avatar: string;
}